import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Link } from "../models/links.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from 'crypto';
import urlcheck from 'is-a-url';

const shortUrl = asyncHandler(async (req, res) => {
  const url = req.body.url;

  if (url === undefined || url.trim() === '') {
    throw new ApiError(400, "Url is required to shorten it");
  }

  if (!urlcheck(url)) {
    return res
    .status(404)
    .json(
      new ApiResponse(404,
        {
          shortId: null,
          url
        },
      "Given Url is nor Valid"
    ));

  }

  const getUniqueId = async () => {
    let shortId = crypto.randomBytes(36).toString('base64').substring(0, 5);

    if (/^[a-zA-Z0-9]{5}$/.test(shortId)) {
      const shortIdCount = await Link.countDocuments({ shortId });
      if (shortIdCount > 0) id = getUniqueId();
    }
    else shortId = getUniqueId();
    return shortId;
  }

  const shortId = await getUniqueId();

  await Link.create({shortId, url});

  return res
  .status(200)
  .json(
    new ApiResponse(200, {
      shortId,
      url
    },
    "URL is Shortned Successfully"
  ));
});

const getURL = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId;

  if (shortId === undefined || shortId.trim() === '') {
    throw new ApiError(400, "Short Id is required to to fetch redirect URL");
  }

  let entry = await Link.findOneAndUpdate({ shortId }, {
      $push: {
        visitHistory: { timestamp: Date.now() }
      }
    },
    { new: true }
  ).select("-visitHistory");

  if (!entry?.url) {
    return res
    .status(404)
    .json(new ApiResponse(404, {}, "Requested URL does not Exists"));
  }

  return res.redirect(301, entry.url);

});

export { shortUrl, getURL };
