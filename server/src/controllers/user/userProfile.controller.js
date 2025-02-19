import mongoose from "mongoose";
import OTP from "../../models/Otp.model.js";
import User from "../../models/User.model.js";
import mailSender from "../../utils/sendEmail.js";
import Booking from "../../models/Booking.model.js";
import Payment from "../../models/Payment.model.js";
import Profile from "../../models/Profile.model.js";
import { generatOtp } from "../../utils/utlitity.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import { imagecompress, imageupload } from "../../services/fileUpload.js";

class ProfileController {
  async getProfileById(req, res) {
    try {
      const { id } = req.user;
      const profileData = await Profile.findOne({ user: id });
      console.log("Profile", profileData);
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
        name,
        gender,
        country,
        phone,
        dateofBirth,
        address,
        website,
        bio,
      } = req.body;
      console.log("REAIADS<>", req.body);
      const { id } = req.user;
      // const image = imagecompress(req.body);

      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        {
          name,
        },
        {
          new: true,
        }
      );

      const profile = await Profile.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(updatedUser.otherdetails) },
        {
          name: name,
          gender: gender,
          country: country,
          phone: phone,
          // profilepic: image,
          dateofBirth: dateofBirth,
          address: address,
          website: website,
          bio: bio,
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
        message: "Something Went Wrong while Updating profile Up",
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

  async getTransactions(req, res) {
    try {
      const { id } = req.user;
      if (!id) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "User Not Found",
        });
      }
      console.log("userID", typeof id);
      const transaction = await Payment.find({
        userId: new mongoose.Types.ObjectId(id),
      });
      console.log("transaction", transaction);
      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Transactions Fetched Successfully",
        data: transaction,
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Something Went Wrong while Fetching Transactions",
      });
    }
  }

  async getHostEarnings(req, res) {
    try {
      const { hostId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(hostId)) {
        return res.status(400).json({ message: "Invalid Host ID" });
      }

      // Get all bookings related to the host
      const bookings = await Booking.aggregate([
        {
          $match: {
            "place.host": new mongoose.Types.ObjectId(hostId),
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "payment",
            foreignField: "_id",
            as: "payment",
          },
        },
        {
          $unwind: {
            path: "$payment",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            payment: 1,
            bookingDate: 1,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      console.log("bookings", bookings);
      let totalEarnings = 0;
      let successPayments = 0;
      let failedPayments = 0;
      let pendingPayments = 0;

      const earningsData = bookings
        .map((booking) => {
          const payment = booking.payment;
          if (!payment) return null;

          if (payment.paymentStatus === "success") {
            totalEarnings += payment.amount;
            successPayments += payment.amount;
          } else if (payment.paymentStatus === "failed") {
            failedPayments += payment.amount;
          } else {
            pendingPayments += payment.amount;
          }

          return {
            orderId: payment.orderId,
            amount: payment.amount,
            paymentStatus: payment.paymentStatus,
            paymentMethod: payment.paymentMethod,
            bookingDate: booking.bookingDate,
          };
        })
        .filter(Boolean);
      console.log("earningsData", earningsData);
      console.log("successPayments", successPayments);
      res.json({
        totalEarnings,
        success: successPayments,
        pending: pendingPayments,
        failed: failedPayments,
        bookings: earningsData,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
}
export default new ProfileController();
