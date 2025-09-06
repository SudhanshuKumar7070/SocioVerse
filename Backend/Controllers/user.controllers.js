import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { uploadProfileImage } from "../Utils/uploadToCloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import mongoose from "mongoose";
import { transporter } from "../Utils/nodeMailer.setup.js";

const options = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production", // true only on HTTPS
};
// function for creating refreshToken and acess tokens
const getAccessAndRefreshToken = async (id) => {
  const currentUser = await User.findById(id);
  if (!currentUser) throw new Api(404, "user not exits");
  const RefreshToken = await currentUser.createRefreshToken();
  const AccessToken = await currentUser.createAcessToken();
  currentUser.RefreshToken = RefreshToken;
  await currentUser.save({ validateBeforeSave: false });
  return { RefreshToken, AccessToken };
};

//  register and login user
const registerUser = AsyncHandler(async (req, res) => {
  //  getting data from req Body
  const { userName, password, email, fullName } = req.body;
  //  checking availablity of data items
  console.log("userName:", userName, password, email, fullName);

  if (
    [userName, password, email, fullName].some(
      (element) => element?.trim() === ""
    )
  )
    throw new ApiError(400, "all fields are required ");

  // checking  if user exists or not of data items
  const currentUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (currentUser) {
    throw new ApiError(400, "user already exists for same email or username");
  }

  const currentProfilePictureUrl = req.file?.path;
  console.log(
    " current profile picture  local_path:>",
    currentProfilePictureUrl
  );
  let cloudinaryResponse = "";
  if (currentProfilePictureUrl) {
    cloudinaryResponse = await uploadProfileImage(currentProfilePictureUrl);
    if (!cloudinaryResponse) {
      throw new ApiError(
        500,
        "something went wrong in uploading image to cloudinary"
      );
    }

    console.log(" cloudinary path of profile Picture:", cloudinaryResponse.url);
  }

  console.log(" current profile picture  local_path", currentProfilePictureUrl);
  //   uploading to cloudinary

  // if (!currentProfilePictureUrl) {
  //   return new ApiError(400, " profile picture is not avaialable");
  // }

  const user = await User.create({
    fullName,
    email,
    profilePicture:
      cloudinaryResponse.url ||
      "https://drive.google.com/file/d/1t0SrqiCC593_MkIAuaex70piNCEPD-46/view?usp=sharing",
    userName: userName.toLowerCase(),
    password,
  });

  if (!user)
    throw new ApiError(
      500,
      "something went wrong in registering user , user not created"
    );
  //    checking for register
  const createdUser = await User.findById(user._id).select(
    " -password -refreshToken "
  );
  if (!createdUser) {
    throw new ApiError(500, " error in registring user ");
  }
  //  adding cookie after register , so user will be automatically logged in
  const { AccessToken, RefreshToken } = await getAccessAndRefreshToken(
    user?._id
  );
  console.log("tokens at register controller", { AccessToken, RefreshToken });

  return res
    .status(201)
    .cookie("accessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options)
    .json(
      new ApiResponse(
        201,
        " user created sucessfully ",
        createdUser,
        AccessToken,
        RefreshToken
      )
    );
});
// login controller____=====**********
const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("email and pass at login :", email, password);
  if ([email, password].some((field) => field.trim() === ""))
    throw new ApiError(400, "all crediantils are required");
  //  check if user registered or not
  const currentUser = await User.findOne({
    email: email,
  });
  if (!currentUser)
    throw new ApiError(400, "can't login , as user not registered");

  const isVerifiedPassWord = await currentUser?.isCorrectPassword(password);
  if (!isVerifiedPassWord) throw new ApiError(401, "invalid password");
  const { AccessToken, RefreshToken } = await getAccessAndRefreshToken(
    currentUser?._id
  );
  if ([AccessToken, RefreshToken].some((field) => field.trim() === ""))
    throw new ApiError(
      500,
      "something went wrong ,missing refresh or access token"
    );

  // get user data via refresh Token
  const loggedUser = await User.findById(currentUser._id).select(
    " -password -RefreshToken"
  );
  if (!loggedUser) throw new ApiError(404, " existing user not exits");
  console.log("access token  for  check::", AccessToken);

  return (
    res
      .status(200)
      .cookie("accessToken", AccessToken, options)
      // .cookie("accessToken", AccessToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",

      // })
      .cookie("refreshToken", RefreshToken, options)
      .setHeader("auth-cookie", "sessionId=abc123; max-age=31536000; path=/;")
      .json(
        new ApiResponse(
          200,
          {
            AccessToken,
            RefreshToken,
            user: loggedUser,
          },
          "login successfull"
        )
      )
  );
});

// generate new refresh Token if the previous one is expired
const generateNewRefreshToken = AsyncHandler(async (req, res) => {
  // get old refresh Token decode it , get data from it , create new access token
  const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!oldRefreshToken)
    new ApiError(404, "refresh token unavailabe in the field");
  const decodedData = jwt.verify(
    oldRefreshToken,
    process.env.DataBase_Secret_Acess_key
  );
  const user = await User.findById(decodedData?._id).select(
    " -password , -RefreshToken"
  );
  if (!user)
    throw new ApiError(
      404,
      "something went wrong in finding user from decoded data"
    );
  const { AccessToken, RefreshToken } = await getAccessAndRefreshToken(
    user?._id
  );
  user.RefreshToken = RefreshToken;
  await user.save();
  return res
    .status(200)
    .cookie("acessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { refreshToken: RefreshToken, accessToken: AccessToken, user: user },
        "tokens updated successfully"
      )
    );
});
// get all user of the application
const listAllContacts = AsyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $project: {
        _id: 1,
        fullName: 1,
        userName: 1,
        profilePicture: 1,
      },
    },
  ]);
  if (!user) throw new ApiError(404, "no users find at the moment");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "fetched successfull"));
});

// add contact or link two use
const addRegisterContacts = AsyncHandler(async (req, res) => {
  const { contactIds } = req.body; //  userids will be array of cotact userIds
  const { userId } = req.params;
  if (!userId.trim()) throw new ApiError(404, "userId missing from params");
  if (!contactIds || contactIds.length === 0)
    throw new ApiError(404, "invalid userIds or missing userIds from client");

  // Convert contactIds to ObjectId array
  const objectIds = contactIds.map((id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, `Invalid ObjectId: ${id}`);
    }
    return new mongoose.Types.ObjectId(id);
  });

  const searchableUserId = new mongoose.Types.ObjectId(userId);
  const updatedUserContact = await User.findByIdAndUpdate(
    searchableUserId,
    {
      $push: {
        contacts: {
          $each: objectIds,
        },
      },
    },
    {
      new: true,
    }
  );
  if (!updatedUserContact)
    throw new ApiError(400, "error in updating the context at the moment");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUserContact, "contact added sussessfully")
    );
});

const getUserContacts = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  // Validate userId
  if (!userId.trim()) throw new ApiError(400, "userId is missing");
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId format");
  }
  const usableUserId = new mongoose.Types.ObjectId(userId);
  // Aggregation pipeline
  const user = await User.aggregate([
    {
      $match: {
        _id: usableUserId,
      },
    },
    //  {$addFields:{
    //   contactDetails:"contactsDetails"
    //  }},

    {
      $lookup: {
        from: "users",
        localField: "contacts",
        foreignField: "_id",
        as: "contacts",
      },
    },
    {
      $project: {
        contacts: 1,
      },
    },
  ]);
  // Check if user or contacts exist
  if (!user) {
    throw new ApiError(404, "No contacts found for the user");
  }
  // Return the fetched contacts
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Contacts fetched successfully"));
});
//  const getUserContacts = AsyncHandler(async(req,res)=>{
//     const {userId} = req.params;
//     if(!userId.trim()) throw new ApiError (400 , "userId not found at the moment");
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//           throw new ApiError(400, "Invalid userId format");
//         }
//         const usableId  = new mongoose.Types.ObjectId(userId);
//           const contactDetails = await User.find({_id:usableId}).populate({
//             path:"contacts.userId",
//              select:"_id profilePicture fullName"
//           })
//           if(!contactDetails) throw new ApiError(404,"unable to fetch contacts at the moment");
//            return res.status(200).json(new ApiResponse(200,contactDetails,"data fetched successfully"));
//  })

const LogoutUser = AsyncHandler(async (req, res) => {
  console.log("user at  moment,", req.user);

  const userId = req.user._id;

  if (!userId)
    throw new ApiError(404, "user Id is not available at the moment");

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId format");
  }
  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(userId),
    {
      $set: {
        RefreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  if (!user) throw new ApiError(404, "can't logout user at  the moment");
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, user, "user loggedOut successfully"));
});
//   controller for maintaining bio
const setBio = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId.trim()) throw new ApiError(404, "required userId");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new ApiError(500, "invalid user id ");
  const { bioText, dateOfBirth, gender, socialLinks, country, city } = req.body;
  console.log(
    "look::",
    bioText,
    dateOfBirth,
    gender,
    socialLinks,
    country,
    city
  );

  // if (
  //   [dateOfBirth, gender, socialLinks, country, city].some(
  //     (element) => !element
  //   )
  // )
  //   throw new ApiError(400, "all filelds are required");

  const bannerImageLocalPath = req.file?.path;
  let bannerCloudUrl;
  if (bannerImageLocalPath) {
    const cloudinaryPath = await uploadProfileImage(bannerImageLocalPath);
    if (!cloudinaryPath.url)
      throw new ApiError(
        500,
        "something went wrong in uploading banner  to cloudinary"
      );
    bannerCloudUrl = cloudinaryPath.url;
  }
  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(userId),

    {
      $set: {
        "bio.text": bioText,
        "bio.dateOfBirth": dateOfBirth,
        "bio.gender": gender,
        "bio.socialLinks": socialLinks,
        "bio.bannerImage": bannerCloudUrl || " ",
        "bio.location.country": country,
        "bio.location.city": city,
      },
      lastUpdated: Date.now(),
    },
    { new: true }
  );
  // const user = await User.findById(new mongoose.Types.ObjectId(userId))
  console.log("user at set bio:", user);

  if (!user) throw new ApiError(500, "something went wrong in updating bio");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "bio created / updated successfully"));
});

const particularUserInfo = AsyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log("function called particularInfo", userId);

  if (!userId.trim())
    throw new ApiError(404, "userId is not available at moment");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new ApiError(400, "invalid user id!");
  const Id = new mongoose.Types.ObjectId(userId);
  const isLoggedInUser = req.user;
  if (!isLoggedInUser) throw new ApiError(402, "unauthorised action");
  const user = await User.aggregate([
    {
      $match: {
        _id: Id,
      },
    },
    {
      $lookup: {
        from: "followers",
        foreignField: "Following",
        localField: "_id",
        as: "Followers",
      },
    },
    {
      $lookup: {
        from: "followers",
        foreignField: "Follower",
        localField: "_id",
        as: "Following",
      },
    },

    {
      $project: {
        contacts: 0,
        password: 0,
        RefreshToken: 0,
        lastLogin: 0,
        lastUpdated: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);
  if (!user) throw new ApiError(500, "unable to fetch data at the moment");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "data fetched succesfully"));
});

// --------forgot password ---

const sendResetPassMail = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("req", req.body);

  try {
    console.log("emial getting;", email);

    const user = await User.findOne({ email: email });
    if (!user)
      throw new ApiError(
        404,
        "invalid email , this emiail is not registered , need to signup first"
      );
    // random number to send code
    const forgot_code = Math.floor(100000 + Math.random() * 900000);
    user.forgotPasswordCode=forgot_code;
    await user.save();
    console.log(user.forgotPasswordCode);
    console.log(user);
    const mailOptions = {
      from: "sudhanshukumar15101@gmail.com",
      to: user?.email,
      subject: "Reset password code ",
      text: "This code is as per your request to reset your password",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Forgot Password Code</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h2 {
      color: #2e7d32;
      margin-bottom: 20px;
    }
    .code-box {
      font-size: 28px;
      font-weight: bold;
      background-color: #e8f5e9;
      color: #2e7d32;
      padding: 15px;
      text-align: center;
      border-radius: 6px;
      letter-spacing: 4px;
    }
    p {
      font-size: 16px;
      color: #333333;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hi ${user?.fullName},</p>
    <p>We received a request to reset your password. Use the code below to proceed:</p>
    <div class="code-box">${forgot_code}</div> 
    <p>This code is valid for the next 10 minutes. If you didn’t request a password reset, you can safely ignore this email.</p>
    <div class="footer">
      &copy; 2025 SocioVerse .
    </div>
  </div>
</body>
</html>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("SMTP connection failed ❌", error);
      } else {
        console.log("SMTP connection successful ✅, ready to send emails!");
      }
    });
    //  if(!mailRes){
    //   throw new ApiError(500,"something went wrong in sending reset password mail");
    //  }
    return res.status(200).json({ message: "mail sent successfully" });
  } catch (err) {
    console.log("error creating at forgot password , err=", err);
    throw new ApiError(
      500,
      `error creating at forgot password , err:${err.message}`
    );
  }
});

const matchForgotCode = AsyncHandler(async (req, res) => {
  const { resetCode } = req.body;
  const { email } = req.params;
   console.log("email and resetCode,", resetCode , email)
  if ([email, resetCode].some((el) => !el)) {
    throw new ApiError(400, "email or resetCode is missing ..");
  }
  const user = await User.findOne({
    email: email,
    forgotPasswordCode: Number(resetCode),
  });
  console.log("checking user at match forgot",user)
  if (!user) throw new ApiError(400, "wrong reset code ! retry");
  return res
    .status(200)
    .json({ message: "code matched successfully", success: true });
});
//---------------------------- reset password --------------
const resetPassword = AsyncHandler(async (req, res) => {
  const { email, forgot_pass_code } = req.params;
  const { newPassword } = req.body;

  if (!email || !forgot_pass_code) {
    throw new ApiError(400, "Either email or pass code is missing");
  }

  if (!newPassword) {
    throw new ApiError(400, "Password is required");
  }
 console.log('new password:',newPassword);
  const hashedPassword = await bcrypt.hash(newPassword,10);
  const updatedUser = await User.findOneAndUpdate(
    { email: email, forgotPasswordCode: Number(forgot_pass_code) },
    { $set: { password: hashedPassword } },
    { new: true }
  );
 console.log(updatedUser);
  if (!updatedUser) {
      
    throw new ApiError(500, "Something went wrong in updating password");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Password changed successfully"));
});


export {
  registerUser,
  loginUser,
  generateNewRefreshToken,
  listAllContacts,
  addRegisterContacts,
  getUserContacts,
  LogoutUser,
  setBio,
  particularUserInfo,

  // forgot password routes:
  sendResetPassMail,
  matchForgotCode,
  resetPassword,
};
