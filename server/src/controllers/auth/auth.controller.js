import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";
import User from "../../models/User.model.js";
import Profile from "../../models/Profile.model.js";
import firebaseAuth from "../../utils/verifygooglefauthToken.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import OTP from "../../models/Otp.model.js";
config();

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// const firebaseApp = initializeApp({
//   credential: admin.credential.cert(
//     JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
//   ),
// });

// const firebaseAuth = getAuth(firebaseApp);

class AuthController {
  async signup(req, res) {
    try {
      const { name, email, password, role, firebaseToken } = req.body;
      if (!firebaseToken && !password) {
        return JsonResponse(res, {
          status: 401,
          success: false,
          message: "Password is required",
          data,
        });
      }
      if (firebaseToken) {
        const decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);
        const { uid, email, name, picture } = decodedToken;
        // console.log("decodedToken: ", decodedToken);

        // Check if the user already exists
        let user = await User.findOne({ email: email });
        if (user) {
          return JsonResponse(res, {
            status: 400,
            message: "User already exists Please login",
            success: false,
            data: user,
          });
        }

        // Create a profile for the user
        const profile = await Profile.create({
          username: name,
          profilepic: picture,
          // Add any other default details you want
        });
        console.log("profile created", profile);

        // Create a new user
        const password = undefined;
        user = await User.create({
          name: name,
          email: email,
          password: password || null,
          googleId: uid,
          // No password for Google signups
          otherdetails: profile._id,
        });
        const token = jwt.sign(
          { id: uid, email: email, role: user.role, name: name },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        console.log("user", user);
        return JsonResponse(res, {
          status: 200,
          message: "Google user registered successfully",
          success: true,
          data: {
            user,
            token,
          },
        });
      } else {
        // Handle traditional signup
        if (!name || !email || !password) {
          return res.status(400).json({ message: "Please fill all fields" });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
          return JsonResponse(res, {
            status: 400,
            message: "User already exists",
            success: false,
            data: [],
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a profile for the user
        const profile = await Profile.create({
          username: name,
          otherDetails: null,
        });

        // Create a new user
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
          googleId,
          otherdetails: profile._id,
        });
        res.cookie("token", token, {
          expires: new Date(Date.now() + 24 * 3600000),
          httpOnly: true,
        });

        return JsonResponse(res, {
          status: 200,
          message: "User created successfully",
          success: true,
          data: newUser,
        });
      }
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        message: "Server error in Signup  user",
        success: false,
        error: err.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { firebaseToken } = req.body;
      if (firebaseToken) {
        // Verify Firebase token
        const decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);
        const { uid, email, name, picture } = decodedToken;

        // Check if user already exists in the database
        let user = await User.findOne({ googleId: uid });
        if (!user) {
          // If not, create a new user
          return res.status(404).json({
            message: "Google account is not registered",
            success: false,
          });
        }
        const token = jwt.sign(
          { id: uid, email: email, role: user.role, name: name },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        return JsonResponse(res, {
          message: "Google login successful",
          success: true,
          status: 200,
          data: {
            token,
            user,
          },
        });

        //   // Handle Google Login
        //   const ticket = await client.verifyIdToken({
        //     idToken: googleToken,
        //     audience: GOOGLE_CLIENT_ID,
        //   });

        //   const payload = ticket.getPayload();
        //   const googleEmail = payload.email;

        //   // Check if the user exists
        //   let user = await User.findOne({ email: googleEmail });
        //   if (!user) {
        //     return res.status(404).json({
        //       message: "Google account is not registered",
        //       success: false,
        //     });
        //   }

        // Create a JWT token
        // const token = jwt.sign(
        //   { id: user._id, email: user.email, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "24h" }
        // );

        // return res.status(200).json({
        //   message: "Google login successful",
        //   success: true,
        //   token,
        //   user,
        // });
      } else {
        // Handle traditional login
        if (!email || !password) {
          return res.status(400).json({
            message: "Please provide email and password",
            success: false,
          });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({
            message: "User not found",
            success: false,
          });
        }
        if (user.googleId != null) {
          return res.status(404).json({
            message:
              "User is registered with google account try to login with google account",
            success: false,
          });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            message: "Invalid credentials",
            success: false,
          });
        }

        // Create a JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        // set the cookie to the token
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
        });

        return res.status(200).json({
          message: "Login successful",
          success: true,
          token,
          data: user,
        });
      }
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        message: "Internal server error occurred during login",
        success: false,
        error: err.message,
      });
    }
  }
  // Host Authentication
  async hostRegister(req, res) {
    const { email, phone, role } = req.body;
    const profile = await Profile.findOne(phone);
    const user = await User.findOne({
      otherDetails: new mongoose.Model.ObjectId(profile._id),
    });
    if (profile) {
      if (user && user?.role == role) {
        return JsonResponse(res, {
          message: "User is already registered and Verified with the same role",
          success: false,
          data: user,
        });
      }
      const updatedUser = await User.findOneAndUpdate(
        { otherDetails: new mongoose.Model.ObjectId(profile._id) },
        { role: role || "Host" },
        { new: true }
      );
      return JsonResponse(res, {
        message: "User role updated successfully",
        success: true,
        data: updatedUser,
      });
    }
    // else verify the user number then update the role
    const otpdata = await createVerification(phone);
    if (otpdata) {
      const saveotp = await OTP.create({
        userId: user._id,
        phone,
        otp: otpdata,
      });
      return JsonResponse(res, {
        title: "OTP is Valid only for 5 minutes",
        message: "OTP sent successfully",
        success: true,
        data: otpdata,
      });
    }
    try {
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        message: "Internal server error occurred during Host registration",
        success: false,
        error: err.message,
      });
    }
  }

  async forgotPassword(req, res, next) {
    // Implementation for forgot password
  }

  async resetPassword(req, res, next) {
    // Implementation for password reset
  }
  async hostVerify(req, res) {
    try {
      const { otp, phone } = req.body;
      const otpdata = await OTP.findOne({ phone: phone, otp: otp });
      if (otpdata) {
        const user = await User.findOneAndUpdate(
          { phone },
          { $set: { verified: true } },
          { new: true }
        );
        c;
        return JsonResponse(res, {
          title: "Host Verified Successfully",
          message: "Host verified successfully",
          success: true,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async hostLogin(req, res) {
    try {
      const { token } = req.body;
    } catch (err) {
      console.error(err.message);
    }
  }
}

export default new AuthController();
