import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },

    // Enhanced bio as an object with subfields
    bio: {
      type: new mongoose.Schema({
        text: {
          type: String,
          default: "This user hasn’t added a bio yet.", 
          maxlength: 280,
        },
        dateOfBirth: { type: Date }, 
        gender: {
          type: String, 
        },
        socialLinks: [
          {
            platform: String, 
            url: String,
          },
        ],
        profileTheme: {
          type: String, // Example: "dark" or "light"  -> dark and light mode should depends on particular user
          default: "light",
        },
        bannerImage: {
          type: String, 
        },
        location: {
          country: String,
          city: String,
        },
      }),
      default: {}, // Ensure `bio` is an object even if empty
    },

    
    lastLogin: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    RefreshToken: { type: String },
    status: { type: String }, // Example: "Hey, I’m using this chat app!"
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await  bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isCorrectPassword = async function(password){
     return bcrypt.compare(password,this.password);
};

userSchema.methods.createAcessToken = function(){
    return jwt.sign( 
        {_id:this._id},
        process.env.DataBase_Secret_Acess_key,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
      
    )
}
userSchema.methods.createRefreshToken = function(){
  return jwt.sign({_id:this._id},
    process.env.DataBase_Secret_Refresh_key,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
  )
}
export const User = mongoose.model("User", userSchema);
