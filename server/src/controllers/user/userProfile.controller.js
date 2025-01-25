import Profile from "../../models/Profile.model";

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
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong while Fetching Profile",
        error: err.message,
      });
    }
  }

  async updateprofileDetails(req, res) {
    const { id, gender, username, about, education, contactnumber, country } =
      req.body;
    try {
      const profile = await Profile.findOneAndUpdate(
        { _id: id },
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
    const { id, email } = req.body;
    try {
      const profile = await Profile.findOneAndDelete({ _id: id });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong while Deleting Up",
        error: err.message,
      });
    }
  }
  async updateDisplayPicture(req, res) {
    const { id, image } = req.body;
    try {
      const profile = await Profile.findOneAndUpdate(
        { _id: id },
        {
          image: image,
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Display Picture Updated Successfully",
        data: profile,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something Went Wrong while Updating Display Picture",
        error: err.message,
      });
    }
  }
}
export default new ProfileController();
