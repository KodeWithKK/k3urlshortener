import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // getting token from either the cookie or the header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized request"));
    }

    // decoding the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // getting the user data
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, {}, error?.message || "Invalid Access token")
        );
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, error?.message || "Invalid Access token"));
  }
});
