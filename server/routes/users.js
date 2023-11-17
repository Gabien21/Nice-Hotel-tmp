const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

// @route GET api/user/info
// @desc Get user infomation
// @access Private
router.get("/info", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      email: user.email,
      full_name: user.full_name,
      address: user.address,
      birthday: user.birthday,
      user_id: user.user_id,
      role: user.role,
      createAt: user.createAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route GET api/user/find_info/:email
// @desc Get user infomation by email
// @access Private (only use for staff, admin)
router.get("/find_info/:email", verifyToken, async (req, res) => {
  try {
    console.log(req.params.email);
    const user = await User.findOne({ _id: req.userId });
    const user_find = await User.findOne({ email: req.params.email });
    if (user.role == "Guest") {
      return res.status(200).json({
        success: false,
        message: "Access denied",
      });
    }
    if (
      user.role == "Staff" &&
      (user_find.role == "Business_Admin" || user_find.role == "System_Admin")
    ) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user_find) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      email: user_find.email,
      full_name: user_find.full_name,
      address: user_find.address,
      birthday: user_find.birthday,
      user_id: user_find.user_id,
      role: user_find.role,
      createAt: user_find.createAt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route GET api/user/find_info
// @desc Get guest list
// @access Private (only use for staff, admin)
router.get("/get_guest_list", verifyToken, async (req, res) => {
  try {
    const user_find = await User.findOne({ _id: req.userId });
    if (user_find.role == "Guest") {
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });
    }
    const user = await User.find({ role: "Guest" });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No guest!",
      });
    }

    const guestList = user.map((user) => ({
      email: user.email,
      full_name: user.full_name,
      birthday: user.birthday,
      phone_number: user.phone_number,
      address: user.address,
    }));

    res.json({
      success: true,
      guestList: guestList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route GET api/user/find_info
// @desc Get staff list
// @access Private (only use for admin)
router.get("/get_staff_list", verifyToken, async (req, res) => {
  try {
    const user_find = await User.findOne({ _id: req.userId });
    if (user_find.role == "Guest" || user_find.role == "Staff") {
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });
    }
    const user = await User.find({ role: "Staff" });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No guest!",
      });
    }

    const guestList = user.map((user) => ({
      email: user.email,
      full_name: user.full_name,
      birthday: user.birthday,
      phone_number: user.phone_number,
      address: user.address,
    }));

    res.json({
      success: true,
      guestList: guestList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route PUT api/user/user_info
// @desc Update User Informations
// @access Private
router.put("/user_info", verifyToken, async (req, res) => {
  let { email, password, full_name, phone_number, address, birthday, user_id } =
    req.body;
  //Simple validation
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing email and/or password" });
  const user_find = await User.findOne({ _id: req.userId });
  if (user_find.email != email) {
    const user_tmp = await User.findOne({ email: email });
    if (user_tmp)
      return res
        .status(400)
        .json({ success: false, message: "email already taken" });
  }
  const passwordValid = await argon2.verify(user_find.password, password);
  if (!passwordValid) {
    password = await argon2.hash(password);
  }
  try {
    let updatedUser = {
      email,
      password,
      full_name,
      phone_number,
      address,
      birthday,
      user_id,
    };
    const userUpdateCondition = { _id: req.userId };
    updatedUser = await User.findOneAndUpdate(
      userUpdateCondition,
      updatedUser,
      { new: true }
    );

    //user not authorized to update post
    if (!updatedUser)
      return res.status(200).json({
        success: false,
        message: "User not found!",
      });
    res.json({
      success: true,
      message: "Excellent progress!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route DELETE api/user/
// @desc Delete user
// @access Private (only staff, admin)
router.delete("/:email", verifyToken, async (req, res) => {
  try {
    const user_find = await User.findOne({ _id: req.userId });
    if (user_find.role == "Guest") {
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });
    }
    const user_to_del = await User.findOne({ email: req.params.email });

    if (!user_to_del)
      return res.status(404).json({
        success: false,
        message: "User to delete is not found!",
      });

    if (
      user_find.role != "System_Admin" &&
      (user_to_del == "System_Admin" || user_to_del == "Business_Admin")
    ) {
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });
    }

    if (user_find.role == "Staff" && user_to_del.role != "Guest") {
      return res.status(200).json({
        success: false,
        message: "Access denied!",
      });
    }

    const deleteUser = await User.findOneAndDelete({ email: req.params.email });
    res.json({
      success: true,
      user: deleteUser,
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
