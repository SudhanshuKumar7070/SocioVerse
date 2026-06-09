import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let serviceAccount;

// Try to load from environment variable first (for production/Render)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env variable:", error.message);
    process.exit(1);
  }
} else {
  // Fallback to local JSON file (for local development)
  try {
    const keyPath = path.join(__dirname, "firebase-admin-private-key.json");
    if (fs.existsSync(keyPath)) {
      const keyFile = fs.readFileSync(keyPath, "utf8");
      serviceAccount = JSON.parse(keyFile);
      console.log("ℹ️  Using local firebase-admin-private-key.json");
    } else {
      console.error("❌ FIREBASE_SERVICE_ACCOUNT env variable not set and local file not found");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Failed to load Firebase credentials:", error.message);
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendMessageToMany = async (
  receiversList,
  payload,
  content,
  serviceName,
) => {
  const message = {
    tokens: receiversList,
    notification: {
      title: serviceName,
      body: content,
    },
    data: {
      type: serviceName,
      payload: payload,
    },
  };
  console.log(
    "sendMessageToMany - sending message:",
    JSON.stringify(message, null, 2),
  );

  const response = await admin.messaging().sendEachForMulticast(message);
  console.log("Success:", response.successCount);
  console.log("Failed:", response.failureCount);

  if (response.failureCount > 0) {
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        console.log(`Token ${idx} failed:`, resp.error?.message || resp.error);
      }
    });
  }

  return response;
};
