import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { OAuth2Client } from "google-auth-library";
config();

// NOTE: we do not need to send res for ok status as they are already done
// in Protectes Routes if this all middlware list in Protected Routes work as  ,and no 500 response are send then the user are authZ we will exe call back function over there for 200 ok

// for auth middleware
export const auth = async (req, res, next) => {
  try {
    // extract jwt token.
    // console.log(req.body.token);
    // console.log("cookies",req.cookies.tokenname);
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    console.log("Requested client", req.header);
    console.log("Header: ", req.header("Authorization"));
    const token =
      req.body?.token ||
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("token->", token);

    if (!token || token == undefined)
      return res.status(401).json({
        success: false,
        message: "Token is Missing Login Again",
      });

    // verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // console.log(decoded);
      // Reason so that we can check authorization in next that's  why i placed the decoded back to user request
      req.user = decoded;
      console.log("Auth middleware: ", req.user);
    } catch (err) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        req.user = {
          id: payload.sub, // Google user ID
          email: payload.email,
          name: payload.name,
          role: "User", // Default role for Google users, can be customized
        };
        console.log("Authenticated via Google: ", req.user);
      } catch (googleErr) {
        // If both fail, token is invalid
        return res.status(401).json({
          success: false,
          message: "Token is invalid. Please login again.",
        });
      }
    }
    // go to next middleware/routes/Handler

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong while Verfiying the Token",
      error: err.message,
    });
  }
};
// both middleware are using for authorization task

// for student middleware
export const isHost = (req, res, next) => {
  try {
    // check the role of student which are placed in req.user as previous middleware  as decoded
    if (req.user.role !== "Host") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this Student route",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong while Verfiying the Token",
      error: err.message,
    });
  }
};

// for Admin middleware
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this Admin route",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong while Verfiying the Token",
      error: err.message,
    });
  }
};
