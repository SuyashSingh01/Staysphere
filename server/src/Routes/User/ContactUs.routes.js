import express from "express";
const router = express.Router();
// import { contactUsController } from "../controller/ContactUS";

// const {createNewsletter,deleteNewsletter,getallNewsletters,getNewsletterbyId}=require('../controller/Newsletter');

// router.get('/newsletter', getallNewsletters);
// router.get('/newsletter/:newsletterId',getNewsletterbyId);
// router.post('/createNewsletter',createNewsletter);
// router.delete('/deleteNewsletter/:newsletterId',deleteNewsletter);

router.post("/reach/contact", contactUsController);

export default router;
