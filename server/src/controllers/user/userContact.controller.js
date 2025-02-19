import { contactUsEmail } from "../../mailTemplate/contactUsEmail.js";
import ContactMessage from "../../models/ContactMessage.js";
import { JsonResponse } from "../../utils/jsonResponse.js";
import mailSender from "../../utils/sendEmail.js";

class ContactSupportController {
  async contactUsController(req, res) {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return JsonResponse(res, {
          status: 400,
          success: false,
          message: "Please Fill all the Fields",
        });
      }
      const contactUsEmailData = await ContactMessage.create({
        name: name,
        email: email,
        message: message,
      });
      await mailSender(
        email,
        "Staysphere Contact Us",
        contactUsEmail(name, email, message)
      );
      return JsonResponse(res, {
        status: 200,
        success: true,
        message: "Message Sent Successfully",
        data: contactUsEmailData,
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
