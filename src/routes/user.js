const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/userModel");

const USER_SAFE_DATA = "firstName lastName";

// Get all the connection request recieved
userRouter.get("/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserID: loggedInUser._id,
      status: "interested",
    }).populate("fromUserID", USER_SAFE_DATA);

    res.status(200).json({
      message: "Requests Fetched Sucessfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

// Get all my connections
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserID: loggedInUser._id, status: "accepted" },
        { toUserID: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserID", USER_SAFE_DATA)
      .populate("toUserID", USER_SAFE_DATA);

    const data = connectionRequest.map((connection) => {
      if (loggedInUser._id.equals(connection.fromUserID._id)) {
        return connection.toUserID;
      }

      return connection.fromUserID;
    });

    res.status(200).json({
      message: "Connections Fetched Sucessfully",
      data,
    });
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = parseInt(req.query.limit) || 10;
     limit = limit > 50 ?  50 : limit;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserID.toString());
      hideUsersFromFeed.add(connection.toUserID.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data: users });
  } catch (error) {
    res.send("ERROR" + error.message);
  }
});

module.exports = userRouter;
