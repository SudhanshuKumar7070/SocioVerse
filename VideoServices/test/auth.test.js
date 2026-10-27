import "../loadEnv.js";
import assert from "node:assert";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { verifyJWT } from "../Middleware/verifyJwt.js";
import { authorizeRoles } from "../Middleware/authorize.js";
import { User } from "../Db/Schema/userSchema.js";
import videoUploadRoute from "../Routes/videoUpload.route.js";
import { router as videoLikeRoute } from "../Routes/videoLike.routes.js";
import videoFetchRoute from "../Routes/videoFetch.route.js";

// Mock helper to create mock req, res, next
function createMockHttp({ cookies = {}, headers = {}, body = {}, params = {} } = {}) {
  const req = {
    cookies,
    headers,
    body,
    params,
    user: undefined,
  };

  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    },
  };

  let nextCalled = false;
  let nextError = null;
  const next = (err) => {
    nextCalled = true;
    nextError = err;
  };

  return { req, res, next, isNextCalled: () => nextCalled, getNextError: () => nextError };
}

const SECRET = process.env.DataBase_Secret_Acess_key || "6347319ui3-2prp-ijdi";
const validUserId = new mongoose.Types.ObjectId().toString();

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

console.log("\n🧪 Running Video Services Authentication & Authorization Test Suite...\n");

// 1. Missing Token Tests
await test("Rejects request when no token is provided in cookies or headers (401)", async () => {
  const { req, res, next, isNextCalled } = createMockHttp();
  await verifyJWT(req, res, next);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.data.success, false);
  assert.match(res.data.message, /token missing/i);
  assert.strictEqual(isNextCalled(), false);
});

// 2. Malformed Token Tests
await test("Rejects malformed token (401)", async () => {
  const { req, res, next, isNextCalled } = createMockHttp({
    headers: { authorization: "Bearer invalid.token.value" },
  });
  await verifyJWT(req, res, next);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.data.success, false);
  assert.match(res.data.message, /invalid access token/i);
  assert.strictEqual(isNextCalled(), false);
});

// 3. Expired Token Tests
await test("Rejects expired token with 401", async () => {
  const expiredToken = jwt.sign({ _id: validUserId }, SECRET, { expiresIn: "-1s" });
  const { req, res, next, isNextCalled } = createMockHttp({
    cookies: { accessToken: expiredToken },
  });
  await verifyJWT(req, res, next);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.data.success, false);
  assert.match(res.data.message, /expired/i);
  assert.strictEqual(isNextCalled(), false);
});

// 4. Token signed with wrong secret
await test("Rejects token signed with untrusted secret (401)", async () => {
  const badSecretToken = jwt.sign({ _id: validUserId }, "wrong-untrusted-secret", { expiresIn: "1h" });
  const { req, res, next, isNextCalled } = createMockHttp({
    cookies: { accessToken: badSecretToken },
  });
  await verifyJWT(req, res, next);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.data.success, false);
  assert.match(res.data.message, /invalid access token/i);
  assert.strictEqual(isNextCalled(), false);
});

// 5. Token with invalid payload claims
await test("Rejects token with non-ObjectId payload claim (401)", async () => {
  const badPayloadToken = jwt.sign({ _id: "not-a-valid-object-id" }, SECRET, { expiresIn: "1h" });
  const { req, res, next, isNextCalled } = createMockHttp({
    headers: { authorization: `Bearer ${badPayloadToken}` },
  });
  await verifyJWT(req, res, next);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.data.success, false);
  assert.match(res.data.message, /invalid token claims/i);
  assert.strictEqual(isNextCalled(), false);
});

// 6. User lookup failure (User does not exist in DB)
await test("Rejects request when user does not exist in DB (401)", async () => {
  const originalFindById = User.findById;
  User.findById = () => ({
    select: async () => null,
  });

  try {
    const validToken = jwt.sign({ _id: validUserId }, SECRET, { expiresIn: "1h" });
    const { req, res, next, isNextCalled } = createMockHttp({
      cookies: { accessToken: validToken },
    });
    await verifyJWT(req, res, next);
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /user not found/i);
    assert.strictEqual(isNextCalled(), false);
  } finally {
    User.findById = originalFindById;
  }
});

// 7. Inactive user rejection
await test("Rejects request when user account is inactive (403)", async () => {
  const originalFindById = User.findById;
  User.findById = () => ({
    select: async () => ({
      _id: validUserId,
      email: "inactive@socioverse.com",
      userName: "inactive_user",
      isActive: false,
    }),
  });

  try {
    const validToken = jwt.sign({ _id: validUserId }, SECRET, { expiresIn: "1h" });
    const { req, res, next, isNextCalled } = createMockHttp({
      cookies: { accessToken: validToken },
    });
    await verifyJWT(req, res, next);
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /inactive/i);
    assert.strictEqual(isNextCalled(), false);
  } finally {
    User.findById = originalFindById;
  }
});

// 8. Active user success & req.user attachment
await test("Attaches verified user to req.user and calls next() for valid active user", async () => {
  const mockUserDoc = {
    _id: validUserId,
    email: "active@socioverse.com",
    userName: "active_user",
    isActive: true,
    role: "user",
  };

  const originalFindById = User.findById;
  User.findById = () => ({
    select: async () => mockUserDoc,
  });

  try {
    const validToken = jwt.sign({ _id: validUserId }, SECRET, { expiresIn: "1h" });
    const { req, res, next, isNextCalled } = createMockHttp({
      cookies: { accessToken: validToken },
    });
    await verifyJWT(req, res, next);
    assert.strictEqual(isNextCalled(), true);
    assert.ok(req.user);
    assert.strictEqual(req.user.email, "active@socioverse.com");
    assert.strictEqual(req.user._id, validUserId);
  } finally {
    User.findById = originalFindById;
  }
});

// 9. Transport: Authorisation header (UK spelling) support
await test("Extracts and verifies token from Authorisation header (UK spelling)", async () => {
  const mockUserDoc = {
    _id: validUserId,
    email: "uk_header@socioverse.com",
    userName: "uk_user",
    isActive: true,
  };

  const originalFindById = User.findById;
  User.findById = () => ({
    select: async () => mockUserDoc,
  });

  try {
    const validToken = jwt.sign({ _id: validUserId }, SECRET, { expiresIn: "1h" });
    const { req, res, next, isNextCalled } = createMockHttp({
      headers: { authorisation: `Bearer ${validToken}` },
    });
    await verifyJWT(req, res, next);
    assert.strictEqual(isNextCalled(), true);
    assert.strictEqual(req.user.userName, "uk_user");
  } finally {
    User.findById = originalFindById;
  }
});

// 10. Database error vs JWT error separation
await test("Distinguishes database infrastructure error from token errors (500, not 401)", async () => {
  const originalFindById = User.findById;
  User.findById = () => {
    throw new Error("MongoNetworkError: connection timed out");
  };

  try {
    const validToken = jwt.sign({ _id: validUserId }, SECRET, { expiresIn: "1h" });
    const { req, res, next, isNextCalled } = createMockHttp({
      cookies: { accessToken: validToken },
    });
    await verifyJWT(req, res, next);
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.data.success, false);
    assert.match(res.data.message, /database error/i);
    assert.strictEqual(isNextCalled(), false);
  } finally {
    User.findById = originalFindById;
  }
});

// 11. Role authorization middleware tests
await test("authorizeRoles allows access when user possesses required role", async () => {
  const { req, res, next, isNextCalled } = createMockHttp();
  req.user = { _id: validUserId, role: "admin" };
  const authMiddleware = authorizeRoles("admin", "moderator");
  authMiddleware(req, res, next);
  assert.strictEqual(isNextCalled(), true);
});

await test("authorizeRoles denies access with 403 when user lacks required role", async () => {
  const { req, res, next, isNextCalled } = createMockHttp();
  req.user = { _id: validUserId, role: "user" };
  const authMiddleware = authorizeRoles("admin");
  authMiddleware(req, res, next);
  assert.strictEqual(res.statusCode, 403);
  assert.strictEqual(res.data.success, false);
  assert.strictEqual(isNextCalled(), false);
});

await test("authorizeRoles denies access with 401 when req.user is absent", async () => {
  const { req, res, next, isNextCalled } = createMockHttp();
  const authMiddleware = authorizeRoles("admin");
  authMiddleware(req, res, next);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(isNextCalled(), false);
});

// 12. Verify route protection configuration
await test("POST /video/upload route is protected with verifyJWT", async () => {
  const uploadLayer = videoUploadRoute.stack.find(
    (layer) => layer.route && layer.route.path === "/video/upload"
  );
  assert.ok(uploadLayer, "Route /video/upload exists");
  const handlers = uploadLayer.route.stack.map((s) => s.name);
  assert.ok(
    handlers.includes("verifyJWT"),
    `Expected verifyJWT in upload route stack, got: ${handlers.join(", ")}`
  );
});

await test("PATCH /video/like-video/:videoId is protected with verifyJWT", async () => {
  const likeLayer = videoLikeRoute.stack.find(
    (layer) => layer.route && layer.route.path === "/video/like-video/:videoId"
  );
  assert.ok(likeLayer, "Route /video/like-video/:videoId exists");
  const handlers = likeLayer.route.stack.map((s) => s.name);
  assert.ok(
    handlers.includes("verifyJWT"),
    `Expected verifyJWT in like route stack, got: ${handlers.join(", ")}`
  );
});

await test("PATCH /video/dislike-video/:videoId is protected with verifyJWT", async () => {
  const dislikeLayer = videoLikeRoute.stack.find(
    (layer) => layer.route && layer.route.path === "/video/dislike-video/:videoId"
  );
  assert.ok(dislikeLayer, "Route /video/dislike-video/:videoId exists");
  const handlers = dislikeLayer.route.stack.map((s) => s.name);
  assert.ok(
    handlers.includes("verifyJWT"),
    `Expected verifyJWT in dislike route stack, got: ${handlers.join(", ")}`
  );
});

await test("GET /video/show-video-likes/:videoId is public (no verifyJWT)", async () => {
  const showLikesLayer = videoLikeRoute.stack.find(
    (layer) => layer.route && layer.route.path === "/video/show-video-likes/:videoId"
  );
  assert.ok(showLikesLayer, "Route /video/show-video-likes/:videoId exists");
  const handlers = showLikesLayer.route.stack.map((s) => s.name);
  assert.strictEqual(
    handlers.includes("verifyJWT"),
    false,
    "show-video-likes should be public"
  );
});

console.log(`\n======================================`);
console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
console.log(`======================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
