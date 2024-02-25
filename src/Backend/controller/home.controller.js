import { asyncHandler } from "../utils/asyncHandler.js";
import { Link } from "../models/links.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import urlcheck from "is-a-url";

// ----- Short URL Handler ----- //
const shortUrlHandler = asyncHandler(async (req, res) => {
  const url = req.body?.url;

  if (!url) {
    return res.status(400).json((400, {}, "URL is required to shorten it"));
  }

  if (!urlcheck(url)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Given URL is not Valid"));
  }

  const getUniqueId = async () => {
    let shortId = crypto.randomBytes(36).toString("base64").substring(0, 5);

    if (/^[a-zA-Z0-9]{5}$/.test(shortId)) {
      const shortIdCount = await Link.countDocuments({ shortId });
      if (shortIdCount > 0) shortId = getUniqueId();
    } else shortId = getUniqueId();
    return shortId;
  };

  const shortId = await getUniqueId();
  await Link.create({ shortId, url });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        shortId,
        url,
      },
      "URL is Shortned Successfully"
    )
  );
});

// ----- Get URL Handler ----- //
const redirectUrlHandler = asyncHandler(async (req, res) => {
  const shortId = req.params?.shortId.trim();

  if (!shortId) {
    return res
      .status(400)
      .json((400, {}, "Short Id is required to to fetch redirect URL"));
  }

  let entry = await Link.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    },
    { new: true }
  ).select("-visitHistory");

  if (!entry) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Requested URL does not Exists"));
  }

  return res.redirect(301, entry.url);
});

export { shortUrlHandler, redirectUrlHandler };
