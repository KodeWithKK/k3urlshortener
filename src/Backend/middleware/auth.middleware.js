import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // getting acess token from either the cookie or the header
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized request"));
  }

  // getting the user id
  let decodedUserId = undefined;
  let newAccessTokenRequired = false;

  // decoding access token
  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    decodedUserId = decodedAccessToken?._id;
  } catch (error) {
    // decoding access token failed
    if (error?.name === "TokenExpiredError") {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res
          .status(401)
          .json(new ApiResponse(401, {}, "User Session has Expired!"));
      }

      // decoding refresh token
      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        decodedUserId = decodedRefreshToken?._id;
        isNewAccessTokenGenerated = true;
      } catch (error) {
        // decoding refresh token failed
        return res
          .status(401)
          .json(new ApiResponse(401, {}, "User Session has Expired!"));
      }
    } else {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized request"));
    }
  }

  if (!decodedUserId) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized request"));
  }

  const user = await User.findById(decodedUserId).select("-password");

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid Access token"));
  }

  if (newAccessTokenRequired) {
    const newRefreshToken = user.generateRefreshToken();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
  }

  req.user = user;
  next();
});
