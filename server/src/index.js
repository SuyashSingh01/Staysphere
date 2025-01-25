import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import cookiesparser from "cookie-parser";
import { dbConnect } from "./config/database.js";
import authRoutes from "./Routes/Auth/Auth.routes.js";
import bookingRoutes from "./Routes/Booking/Booking.routes.js";
import chatRoutes from "./Routes/Chat/Chat.routes.js";
import hostRoutes from "./Routes/Host/Host.routes.js";
import favoriteRoutes from "./Routes/Favourite/Favourite.routes.js";
import listingRoutes from "./Routes/Listing/Listing.routes.js";
import paymentRoutes from "./Routes/Payment/Payment.routes.js";
import reviewRoutes from "./Routes/Review/Review.routes.js";
import SocketService from "./services/socket.service.js";
import { cloudinaryConnect } from "./config/cloudinary.js";

const app = express();
const Port = process.env.PORT || 4000;
const server = http.createServer(app);

// socket constructor function  to create a new instance of soket service
new SocketService(server);

// get the io instance from the socket service

// const io = socketservice.getIO();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
// cookie parser
app.use(cookiesparser());

app.use(express.json());
// db connection
dbConnect();

// cloudinary connection
cloudinaryConnect();

// middleware
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", listingRoutes);
app.use("/api/v1", hostRoutes);
app.use("/api/v1", favoriteRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", chatRoutes);
// server activiation
app.listen(Port, () => {
  console.log("server is running on port ", Port);
});
