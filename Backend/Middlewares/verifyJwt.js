import jwt  from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/user.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
  // getting user Token from user- from cookies
  const currentUserJWTtoken =
    req.cookies.accessToken ||
    req.header("Authorisation")?.replace("Bearer ", "");
  if (!currentUserJWTtoken) throw new ApiError(402, " accessToken not availabe");
     console.log('accessTokenCheck::', currentUserJWTtoken);
     
  // decode the access token
  const decodedData = jwt.verify(
    currentUserJWTtoken,
    process.env.DataBase_Secret_Acess_key || "6347319ui3-2prp-ijdi"
  );
  if (!decodedData)
    throw new ApiError(400, "invalid user || token not matched");

  const user = await User.findById(decodedData._id).select(
    " -password -RefreshToken"
  );
  if (!user) throw new ApiError(404, "user not found");
  req.user = user;
  next();
});
