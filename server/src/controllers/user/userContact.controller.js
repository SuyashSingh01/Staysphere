import Profile from "../../models/Profile.model.js";
import User from "../../models/User.model.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import mailSender from "../../utils/sendEmail.js";

class ContactSupportController {
  async contactUsController(req, res) {
    try {
      const { name, email, message } = req.body;
      await mailSender("", "Contact Us", contactUsEmail(name, email, message));
      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Message Sent Successfully",
      });
    } catch (err) {
      console.log(err);
      return JsonResponse(res, {
        status: 500,
        success: false,
        message: "Something Went Wrong while Sending Message",
        error: err.message,
      });
    }
  }
}

export default new ContactSupportController();
