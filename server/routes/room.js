const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const User = require("../models/User");
const Room = require("../models/Room");

// @route POST api/room/add_room
// @desc add a room type with specific room
// @access Private (only for system admin)
router.post("/add_room", verifyToken, async (req, res) => {
  try {
    // console.log(req.body)
    const sys_ad = await User.findOne({ _id: req.userId });
    if (!sys_ad)
      return res.status(200).json({
        success: false,
        message: "System admin not found!",
      });
    if (sys_ad.role != "System_Admin")
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });
    const { room_type, room_number, description, state, price, discount } =
      req.body;
    if (!room_type || !room_number || !state || !price || !discount) {
      res.status(200).json({
        success: false,
        message: "Missing information!",
      });
    }
    let room = await Room.findOne({
      room_number: room_number,
    });

    if (room)
      return res.status(200).json({
        success: false,
        message: "Room number has already taken!",
      });

    const newRoom = new Room({
      room_type,
      room_number,
      description,
      state,
      price,
      discount,
    });
    await newRoom.save();

    res.json({
      success: true,
      message: "New room created successfully",
      newRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route PUT api/room/update_room
// @desc Update a room type with specific room
// @access Private (only for system admin)
router.put("/update_room", verifyToken, async (req, res) => {
  try {
    const sys_ad = await User.findOne({ _id: req.userId });
    if (!sys_ad)
      return res.status(200).json({
        success: false,
        message: "System admin not found!",
      });
    if (sys_ad.role != "System_Admin")
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });

    const { room_type, room_number, description, state, price, discount } =
      req.body;

    if (!room_type || !room_number || !state || !price || !discount) {
      res.status(200).json({
        success: false,
        message: "Missing information!",
      });
    }

    let updatedRoom = {
      room_type,
      room_number,
      description,
      state,
      price,
      discount,
    };

    const roomUpdateCondition = {
      room_number: room_number,
    };

    updatedUser = await Room.findOneAndUpdate(
      roomUpdateCondition,
      updatedRoom,
      { new: true }
    );

    if (!updatedUser)
      return res.status(200).json({
        success: false,
        message: "Room number not found!",
      });

    res.json({
      success: true,
      message: "Room updated successfully",
      updatedRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route DEL api/room/update_room
// @desc Delete a specific room
// @access Private (only for system admin)
router.delete("/:room_number", verifyToken, async (req, res) => {
  try {
    const sys_ad = await User.findOne({ _id: req.userId });
    if (!sys_ad)
      return res.status(200).json({
        success: false,
        message: "System admin not found!",
      });
    if (sys_ad.role != "System_Admin")
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });

    const deleteRoom = await Room.findOneAndDelete({
      room_number: req.params.room_number,
    });
    if (!deleteRoom)
      return res
        .status(200)
        .json({ success: false, message: "Room number not found!" });

    return res.json({
      success: true,
      message: "Room deleted successfully",
      deleteRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
