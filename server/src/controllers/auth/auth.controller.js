import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { config } from "dotenv";
import OTP from "../../models/Otp.model.js";
import User from "../../models/User.model.js";
import Profile from "../../models/Profile.model.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import firebaseAuth from "../../utils/verifygooglefauthToken.js";
import { generateToken, generatOtp } from "../../utils/utlitity.js";
import mailSender from "../../utils/sendEmail.js";
import { passwordUpdated } from "../../mailTemplate/passwordChange.js";
import { createVerification } from "../../utils/sendOtp.js";
import otpTemplate from "../../mailTemplate/otpverificationEmail.js";
config();
// import { OAuth2Client } from "google-auth-library";

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
        console.log("Verified token", decodedToken);
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
          name,
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
        await Profile.findByIdAndUpdate(
          { _id: profile._id },
          { user: user._id }
        );
        const token = generateToken({
          id: uid,
          email: email,
          role: user.role,
          name: name,
        });
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
          return JsonResponse(res, {
            status: 400,
            message: "Please provide name, email and password",
            success: false,
          });
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
          name,
        });

        // Create a new user
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
          otherdetails: profile._id,
        });
        // upadate the profile of the new user
        await Profile.findByIdAndUpdate(
          { _id: profile._id },
          {
            user: newUser._id,
          }
        );

        // Generate JWT token
        const token = generateToken({
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
        });

        res.cookie("token", token, {
          expires: new Date(Date.now() + 24 * 3600000),
          sameSite: "none",
          secure: true,
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
        data: [],
        error: err.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { firebaseToken, email, password } = req.body;
      if (firebaseToken) {
        // Verify Firebase token
        const decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);
        const { uid, email, name, picture } = decodedToken;

        // Check if user already exists in the database
        let user = await User.findOne({ googleId: uid });

        if (!user) {
          // If not, create a new user
          return JsonResponse(res, {
            status: 400,
            message: "User not found with Google account",
            success: false,
            data: [],
          });
        }
        const profileupdate = await Promise.all([
          Profile.findOneAndUpdate(
            { _id: user.otherdetails },
            {
              name: name,
              profilepic: picture,
            },
            { new: true }
          ),
          User.findOneAndUpdate(
            { googleId: uid },
            {
              name: name,
            },
            { new: true }
          ),
        ]);

        const token = generateToken({
          id: uid,
          email: email,
          role: user.role,
          name: name,
        });

        return JsonResponse(res, {
          message: "Google login successful",
          success: true,
          status: 200,
          data: {
            token,
            user,
            profileupdate,
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
          return JsonResponse(res, {
            status: 400,
            message: "Email and password are required",
            success: false,
            data: [],
          });
        }
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return JsonResponse(res, {
            status: 404,
            message: "User not found",
            success: false,
            data: [],
          });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return JsonResponse(res, {
            status: 400,
            message: "Invalid credentials",
            success: false,
          });
        }

        // Create a JWT token
        const token = generateToken({
          id: user._id,
          name: user.name,
          email: email,
          role: user.role,
        });

        // set the cookie to the token
        const options = {
          expires: new Date(Date.now() + 24 * 3600000),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        };

        res.cookie("token", token, options);

        return JsonResponse(res, {
          status: 200,
          message: "Login successful",
          success: true,
          data: {
            user,
            token,
          },
        });
      }
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        message: "Internal server error occurred during login",
        success: false,
        data: [],
        error: err.message,
      });
    }
  }

  // Implementation for forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
        });
      }
      const token = crypto.randomBytes(20).toString("hex");

      const updatedDetails = await User.findOneAndUpdate(
        { email: email },
        {
          token: token,
          resetPasswordExpires: Date.now() + 3600000,
        },
        { new: true }
      );
      console.log("DETAILS", updatedDetails);

      const url = `http://localhost:5173/update-password/${token}`;

      await mailSender(
        email,
        "Password Reset STAYSPHERE",

        passwordUpdated(
          updatedDetails.email,
          `Password updated successfully for ${updatedDetails.name}`,
          `Your Link for Password Reset is ${url}. Please click this url to reset your password.`
        )
      );
      return JsonResponse(res, {
        title: "Check Your Email Address for Reset Password",
        status: 200,
        success: true,
        message:
          "Email Sent Successfully, Please Check Your Email to Continue Further",
      });
    } catch (error) {
      return JsonResponse(res, {
        status: 500,
        error: error.message,
        success: false,
        message: `Some Error in Sending the Reset Message`,
      });
    }
  }

  // Implementation for password reset with token
  async resetPassword(req, res) {
    try {
      const { token } = req.params || req.body;
      const { password, confirmPassword } = req.body;

      console.log("TOKEN", token);
      if (confirmPassword !== password) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Password and Confirm Password Does not Match",
        });
      }
      const userDetails = await User.findOne({ token: token });
      if (!userDetails) {
        return JsonResponse(res, {
          status: 404,
          success: false,
          message: "Token is Invalid",
        });
      }
      if (userDetails.resetPasswordExpires <= Date.now()) {
        return JsonResponse(res, {
          status: 404,
          success: false,
          message: `Token is Expired, Please Regenerate Your Token`,
        });
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { token: token },
        { password: encryptedPassword },
        { new: true }
      );
      JsonResponse(res, {
        title: "Password Reset Successful",
        status: 200,
        success: true,
        message: `Password Reset Successful`,
      });
    } catch (error) {
      return JsonResponse(res, {
        title: error.message,
        status: 500,
        error: error.message,
        success: false,
        message: `Some Error in Updating the Password`,
      });
    }
  }
  // Change Password with old password
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const { id } = req.user;
      console.log(
        "Change Password",
        id,
        oldPassword,
        newPassword,
        confirmPassword
      );

      const user = await User.findOne({ _id: id });
      if (!user) {
        return JsonResponse(res, {
          status: 404,
          success: false,
          message: "User not found",
        });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Old Password is Incorrect",
        });
      }
      if (newPassword !== confirmPassword) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Password and Confirm Password Does not Match",
        });
      }
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate(
        { _id: id },
        { password: encryptedPassword },
        { new: true }
      );
      mailSender(
        user.email,
        "Password Updated",
        `Your Password has been updated successfully if you have not done this please contact us immediately`
      );
      return JsonResponse(res, {
        title: "Password Updated Successfully",
        status: 200,
        success: true,
        message: "Password Updated Successfully",
      });
    } catch (error) {
      return JsonResponse(res, {
        title: error.message,
        status: 500,
        error: error.message,
        success: false,
        message: `Some Error in Updating the Password`,
      });
    }
  }
  //  Authentication and Verification

  async emailVerification(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });

      if (!user) {
        return JsonResponse(res, {
          status: 400,
          message: "User not found with this email address",
          success: false,
        });
      }
      const otp = generatOtp();
      await OTP.create({
        email,
        otp,
      });

      return JsonResponse(res, {
        status: 200,
        title: "Email sent successfully",
        message: "Email sent successfully",
        success: true,
      });
    } catch (err) {
      console.error(err.message);
      return JsonResponse(res, {
        status: 500,
        message: "Internal server error occurred during Email Verification",
        success: false,
        error: err.message,
      });
    }
  }
  async emailVerificationWithOTP(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return JsonResponse(res, {
          status: 400,
          message: "Email or OTP is missing",
          success: false,
        });
      }
      const otpdata = await OTP.findOne({ email: email, otp: otp })
        .sort({ createdAt: -1 })
        .limit(1);
      if (otpdata === null) {
        return JsonResponse(res, {
          status: 400,
          title: "Invalid OTP",
          message: "Invalid OTP",
          success: false,
          data: [],
        });
      }
      if (otpdata.otp === otp) {
        const userVerified = await User.findOneAndUpdate(
          { email: email },
          {
            $set: {
              isEmailVerified: true,
            },
          },
          { new: true }
        );

        return JsonResponse(res, {
          status: 200,
          title: "Email Verified successfully",
          message: "Email Verified successfully",
          success: true,
          data: userVerified,
        });
      }
    } catch (err) {
      console.error(err.message);
      return JsonResponse(res, {
        status: 500,
        message: "Internal server error occurred during Email Verification",
        success: false,
        error: err.message,
      });
    }
  }

  async phoneVerification(req, res) {
    try {
      const { phone, email } = req.body;
      const otp = generatOtp();
      const otpdata = await OTP.create({ phone: phone, otp: otp });
      const otpAtphone = await createVerification(phone, otp);
      console.log("Twiliootp", otpAtphone);
      console.log("DBOTP", otpdata);
      // const user = await User.findOneAndUpdate({ email:email }, { $set: { phone: phone } }, { new: true });

      return JsonResponse(res, {
        status: 200,
        title: "OTP sent successfully",
        message: "OTP sent successfully",
        success: true,
        data: [],
      });
    } catch (err) {
      console.error(err.message);
      return JsonResponse(res, {
        status: 500,
        message: "Internal server error occurred during Phone Verification",
        success: false,
        error: err.message,
      });
    }
  }

  async phoneVerificationWithOTP(req, res) {
    try {
      const { phone, otp, email } = req.body;
      console.log(phone, otp, email);
      const { id } = req.user;
      if (!phone || !otp) {
        return JsonResponse(res, {
          status: 400,
          title: "Phone or OTP is missing",
          message: "Phone or OTP is missing",
          success: false,
          data: [],
        });
      }
      const otpdata = await OTP.findOne({ phone: phone, otp: otp })
        .sort({ createdAt: -1 })
        .limit(1);
      if (otpdata === null) {
        return JsonResponse(res, {
          status: 400,
          title: "Invalid OTP",
          message: "Invalid OTP",
          success: false,
          data: [],
        });
      }

      if (otpdata.otp === otp) {
        console.log("userid", id);
        const user = await User.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              isPhoneVerified: true,
              phone: phone,
            },
          }
        );
        console.log("User updated", user);
        return JsonResponse(res, {
          status: 200,
          title: "Phone Verified Successfully",
          message: "Phone Verified Successfully",
          success: true,
          data: user,
        });
      } else {
        return JsonResponse(res, {
          status: 400,
          title: "Invalid OTP",
          message: "Invalid OTP",
          success: false,
          data: [],
        });
      }
    } catch (err) {
      console.error(err.message);
      return JsonResponse(res, {
        status: 500,
        message: "Internal server error occurred during Phone Verification",
        success: false,
        error: err.message,
      });
    }
  }

  // Host Authentication and Verification needs a changes
  async hostRegister(req, res) {
    try {
      const { email, phone, role } = req.body;
      const user = await User.findOne({ email })
        .populate("otherdetails")
        .exec();

      console.log("user", user);
      if (user && user?.role == role) {
        return JsonResponse(res, {
          status: 400,
          message: "User is already registered and Verified with the same role",
          success: false,
          data: user,
        });
      }
      // we can also direct check with email in User model and checke whether the user role  is same or not if same then return the user
      if (user && user.otherdetails?.phone == phone) {
        const updatedUser = await User.findOneAndUpdate(
          { otherdetails: new mongoose.Types.ObjectId(user._id) },
          { role: role | "Host" },
          { new: true }
        );
        return JsonResponse(res, {
          status: 400,
          message: "User is successfully registered and Verified with role",
          success: false,
          data: updatedUser,
        });
      }
      const otp = generatOtp();
      // else verify the user number then update the role
      const otpdata = await createVerification(phone, otp);
      // const otpdata = 234;
      console.log("otpsada", otpdata);
      if (otpdata) {
        // also post hook to send the email notification
        const saveotp = await OTP.create({
          email,
          userId: user._id,
          phone,
          otp: otpdata.toString(),
        });
        const token = generateToken({
          id: user._id,
          email: email,
          name: user.name,
          role: user.role,
          phone: phone,
        });

        return JsonResponse(res, {
          status: 200,
          title: `OTP sent successfully for role ${role} Verification on phone ${phone} and email ${saveotp?.email}`,
          message: "OTP is Valid only for 5 minutes",
          success: true,
          data: {
            user,
            token,
          },
        });
      }
    } catch (err) {
      console.error(err);
      return JsonResponse(res, {
        status: 500,
        message: "Internal server error occurred during Host registration",
        success: false,
        data: [],
        error: err.message,
      });
    }
  }
  async hostVerify(req, res) {
    try {
      const { otp, phone } = req.body;
      const otpdata = await OTP.findOne({ phone: phone, otp: otp })
        .sort({ createdAt: -1 })
        .limit(1);
      if (otpdata === null) {
        return JsonResponse(res, {
          status: 400,
          title: "Invalid OTP",
          message: "Invalid OTP",
          success: false,
          data: [],
        });
      }
      console.log("otasdata", otpdata);
      if (otpdata.otp === otp) {
        const userVerified = await User.findOneAndUpdate(
          { _id: otpdata.userId },
          {
            $set: {
              isEmailVerified: true,
              isPhoneVerified: true,
              role: "Host",
            },
          },
          { new: true }
        );
        const token = generateToken({
          id: userVerified._id,
          email: userVerified.email,
          role: userVerified.role,
          phone: phone,
        });
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          expires: new Date(Date.now() + 24 * 3600000),
        });
        return JsonResponse(res, {
          status: 200,
          title: "Host Verified Successfully",
          message: "Host verified successfully",
          success: true,
          data: {
            userVerified,
            token,
          },
        });
      }
    } catch (err) {
      console.error(err.message);
      return JsonResponse(res, {
        status: 500,
        message: "Internal server error occurred during Host Verification",
        success: false,
        data: [],
        error: err.message,
      });
    }
  }

  async hostLogin(req, res) {
    try {
      const { token } = req.body;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded token in host", decoded);
      const user = await User.findOne({ _id: decoded.id });
      if (!user) {
        return JsonResponse(res, {
          status: 400,
          message: "User not found",
          success: false,
        });
      }
      if (user.role !== "Host") {
        return JsonResponse(res, {
          status: 400,
          message: "User not verified",
          success: false,
        });
      }
      return JsonResponse(res, {
        status: 200,
        message: "Login successful",
        success: true,
        data: user,
      });
    } catch (err) {
      console.error(err.message);
    }
  }
}

export default new AuthController();
