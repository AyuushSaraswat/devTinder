const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/userModel");

requestRouter.post("/send/:status/:toUserID", userAuth, async (req, res) => {
  try {
    const fromUserID = req.user._id;
    const toUserID = req.params.toUserID;
    const status = req.params.status;

    const connectionRequest = new ConnectionRequestModel({
      fromUserID,
      toUserID,
      status,
    });

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type",
      });
    }

    const toUser = await User.findById(toUserID);

    if (!toUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isExistingReq = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserID, toUserID },                                 // A -> B
        { fromUserID: toUserID, toUserID: fromUserID },           // B -> A
      ],
    });

    if (isExistingReq) {
      return res.status(400).json({
        message: "Connection Request Already Sent",
      });
    }

    const data = await connectionRequest.save();

    res.status(200).json({
      message: "Connection Request Sent",
      data,
    });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});





requestRouter.post("/review/:status/:requestID", userAuth, async (req, res) => {
  try {
    const { status, requestID } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type",
      });
    }

    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestID,
      toUserID: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      throw Error("Failed to find the connection Request");
    }

    connectionRequest.status = status;

     const data = await connectionRequest.save();

    res.status(200).json({
      message: "Connection Request"+  status + data
    });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

module.exports = requestRouter;
