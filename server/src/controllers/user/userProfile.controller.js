import Profile from "../../models/Profile.model.js";
import { imageupload } from "../../services/fileUpload.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import User from "../../models/User.model.js";
import mailSender from "../../utils/sendEmail.js";
import { generatOtp } from "../../utils/utlitity.js";
import OTP from "../../models/Otp.model.js";

class ProfileController {
  async getProfileById(req, res) {
    try {
      const { id } = req.body;
      const profileData = await Profile.findOne({ _id: id });

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Profile Fetched Successfully",
        data: profileData,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Something Went Wrong while Fetching Profile",
      });
    }
  }

  async updateprofileDetails(req, res) {
    try {
      const {
        userID,
        gender,
        username,
        about,
        education,
        contactnumber,
        country,
      } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        userID,
        {
          name: username,
        },
        {
          new: true,
        }
      );

      const profile = await Profile.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(updatedUser.otherdetails) },
        {
          gender: gender,
          username: username,
          about: about,
          education: education,
          contactnumber: contactnumber,
          country: country,
        },
        { new: true }
      );
      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Profile Updated Successfully",
        data: profile,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong while Signing Up",
        error: err.message,
      });
    }
  }
  async deleteprofile(req, res) {
    try {
      const { id } = req.body;
      const user = await User.findById({ _id: id });

      if (!user) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "USer are not found to delete",
        });
      }

      await Profile.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(user.otherdetails),
      });

      // also delete the user from the user model
      // Now Delete User
      const deletedUser = await User.findByIdAndDelete({ _id: id });

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "User Deleted Successfully",
        data: deletedUser,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Something Went Wrong while Deleting Up",
        error: err.message,
      });
    }
  }
  async updateDisplayPicture(req, res) {
    try {
      const { id } = req.body;
      // upload the new image to the cloudinary server
      const newImage = req.files.files;
      if (!newImage) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Please select an image to upload",
        });
      }
      const uploadedImage = await imageupload(req, res, newImage);
      if (!uploadedImage) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: " Image aren't  uploaded",
        });
      }
      const profile = await Profile.findOneAndUpdate(
        { _id: id },
        {
          image: uploadedImage[0]?.mediaurl,
        },
        { new: true }
      );
      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Display Picture Updated Successfully",
        data: profile,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Something Went Wrong while Updating Display Picture",
        error: err.message,
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { oldpassword, newpassword } = req.body;
      const { id } = req.user;

      const isMatch = await bcrypt.compare(oldpassword, user.password);
      if (!isMatch) {
        return JsonResponse(res, {
          title: "Invalid password",
          status: 400,
          success: false,
          message: "Old Password is Incorrect",
        });
      }

      const hashpasword = await bcrypt.hash(newpassword, 10);
      const updatedDetails = await User.findOneAndUpdate(
        { _id: id },
        {
          password: hashpasword,
        },
        { new: true }
      );
      await mailSender(
        email,
        "Password Updated Successfully",
        passwordUpdated(
          updatedDetails.email,
          `Password updated successfully for ${updatedDetails.name}`,
          `If you didn't change your password, please contact us immediately at.staysphere@gmail.com`
        )
      );
      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Password Updated Successfully",
        data: updatedDetails,
      });
    } catch (e) {
      console.log(e);
      return JsonResponse(res, {
        title: e.message,
        status: 500,
        success: false,
        message: "Something Went Wrong while Updating Password",
        error: e.message,
      });
    }
  }
  async updateEmail(req, res) {
    try {
      const { email } = req.body;
      const { id } = req.user;

      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          email: email,
        },
        { new: true }
      );
      // verify the new email
      // send the verification email
      const otp = generatOtp();

      const otpdata = await OTP.create({
        email: email,
        userId: user._id,
        otp,
        phone: user?.phone,
      });
      // send the otp to the user

      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "OTP Sent To Email Successfully",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Something Went Wrong while Updating Email",
        error: err.message,
      });
    }
  }
  async verifyEmail(req, res) {
    try {
      const { otp, email } = req.body;
      const otpdata = await OTP.findOne
        .find({ email: email, otp: otp })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!otpdata) {
        return JsonResponse(res, {
          title: "OTP Is Incorrect",
          status: 400,
          success: false,
          message: "Invalid OTP",
        });
      }
      const user = await User.findOneAndUpdate({ email: email }, { new: true });
      if (!user) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "User Not Found",
        });
      }
      // could be error  here becuse emailVerificied field
      // is  not exist in schema then how to handle this
      // user.emailVerified = true;
      await user.save();
      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Email Verified Successfully",
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Something Went Wrong while Verifying Email",
        error: err.message,
      });
    }
  }
}
export default new ProfileController();
