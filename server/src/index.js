import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
import { fileURLToPath } from "url";
import cookiesparser from "cookie-parser";
import fileupload from "express-fileupload";
import { dbConnect } from "./config/database.js";
import authRoutes from "./Routes/Auth/Auth.routes.js";
import chatRoutes from "./Routes/Chat/Chat.routes.js";
import hostRoutes from "./Routes/Host/Host.routes.js";
import SocketService from "./services/socket.service.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import reviewRoutes from "./Routes/Review/Review.routes.js";
import bookingRoutes from "./Routes/Booking/Booking.routes.js";
import listingRoutes from "./Routes/Listing/Listing.routes.js";
import paymentRoutes from "./Routes/Payment/Payment.routes.js";
import favoriteRoutes from "./Routes/Favourite/Favourite.routes.js";
import userRoutes from "./Routes/User/User.routes.js";
import profileRoutes from "./Routes/User/Profile.routes.js";
import contactUsRoutes from "./Routes/User/ContactUs.routes.js";

const app = express();
const Port = process.env.PORT || 4000;
const server = http.createServer(app);

// socket constructor function  to create a new instance of soket service
new SocketService(server);

// Middleware
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Serve static files from the "assets" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.json());
// cookie parser
app.use(cookiesparser());

app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// db connection
dbConnect();

// cloudinary connection
cloudinaryConnect();

// middleware

app.use(express.urlencoded({ extended: false }));

// Test server
app.use("/api/v1", userRoutes);

// All Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", listingRoutes);
app.use("/api/v1", hostRoutes);
app.use("/api/v1", favoriteRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1", contactUsRoutes);
// server activiation
server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
