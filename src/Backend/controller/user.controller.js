import { asyncHandler } from "../utils/asyncHandler.js";
import { Link } from "../models/links.model.js";
import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isFormValid } from "../utils/verifyForm.js";

const generateAccessAndRefreshTokens = async userId => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong while generating refresh and access token"
        )
      );
  }
};

// ------ Signup Handler ------ //
const signupHandler = asyncHandler(async (req, res) => {
  const formData = req.body;
  const { name, email, password, history } = formData;

  // check form data validation
  if (!formData) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Unable to get Form Data!"));
  }

  const { isValid, message } = isFormValid(req.body);

  if (!isValid) {
    return res.status(400).json(new ApiResponse(400, {}, message));
  }

  // check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "User Already Exists!"));
  }

  // create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // saving up previously generated history
  const newHistory = [];
  history ??= [];

  for (const data of history) {
    const { shortId, fullUrl } = data;

    if (shortId && fullUrl) {
      const link = await Link.findOne({ shortId, fullUrl, owner: null });

      if (link) {
        link.owner = user._id;
        await link.save();
        newHistory.push(data);
      }
    }
  }

  user.history = newHistory;
  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new Error(500, "Something went wrong");
  }

  const options = {
    httpOnly: true, // cookie cannot be accessed via client-side scripts
    secure: true, // cookie will only be sent over HTTPS
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          createdUser,
          accessToken,
          refreshToken,
        },
        "User Registered Successfully"
      )
    );
});

// ----- Login Handler ----- //
const loginHandler = asyncHandler(async (req, res) => {
  const { email, password, history } = req.body;
  const { isValid, message } = isFormValid({ email, password });

  if (!isValid) {
    return res.status(400).json(new ApiResponse(400, {}, message));
  }

  // finding user and verifying it
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Incorrect Password!"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // saving up previously generated history
  const newHistory = [];
  user.history ??= [];

  for (const data of history) {
    const { shortId, fullUrl } = data;

    if (shortId && fullUrl) {
      const link = await Link.findOne({ shortId, fullUrl, owner: null });

      if (link) {
        link.owner = user._id;
        await link.save();
        newHistory.push(data);
      }
    }
  }

  user.history.push(...newHistory);
  await user.save();

  let loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
          history: loggedInUser.history,
        },
        "User logged In successfully"
      )
    );
});

// ----- Get User Data Handler ----- //
const getUserDataHandler = asyncHandler(async (req, res) => {});

// ----- Logout Handler ----- //
const logoutHandler = (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
};

// ------ Add Url Handler ----- //
const addUrlHandler = asyncHandler(async (req, res) => {
  const shortId = req.params?.shortId;

  if (!shortId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Short Id is required!"));
  }

  const link = await Link.findOne({ shortId });

  if (!link) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Given ShortId doesn't Exists!"));
  }

  if (link.owner) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Given ShortId already has a owner!"));
  }

  link.owner = req.user._id;
  await link.save();

  await User.findByIdAndUpdate(req.user._id, {
    $push: { history: { shortId: link.shortId, fullUrl: link.fullUrl } },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Short URL successfully Added to the User Account"
      )
    );
});

// ----- Remove Url Handler ----- //
const removeUrlHandler = asyncHandler(async (req, res) => {
  const shortId = req.params?.shortId;

  if (!shortId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Short Id is required!"));
  }

  const link = await Link.findOne({ shortId });

  if (link.owner.equals(req.user._id)) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { history: { shortId } },
    });

    await Link.findOneAndDelete({ shortId });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Short Id Removed successfully from the User Account"
      )
    );
});

export {
  loginHandler,
  signupHandler,
  getUserDataHandler,
  logoutHandler,
  addUrlHandler,
  removeUrlHandler,
};
