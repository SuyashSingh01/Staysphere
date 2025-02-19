import express from "express";
const router = express.Router();
import { controllers } from "../../controllers/index.controller";

router.post("/reach/contact", controllers.contactsupport.contactUsController);
// we need to add more routes here
// router.get('/newsletter', controllers.contactsupportgetallNewsletters);
// router.get('/newsletter/:newsletterId',controllers.contactsupportgetNewsletterbyId);
// router.post('/createNewsletter',controllers.contactsupportcreateNewsletter);
// router.delete('/deleteNewsletter/:newsletterId',controllers.contactsupportdeleteNewsletter);

export default router;
