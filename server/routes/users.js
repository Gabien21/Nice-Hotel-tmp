const express = require("express");
const router = express.Router();
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

// @route GET api/user/info
// @desc Get user infomation
// @access Private
router.get("/find_info", verifyToken, async (req, res) => {
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
  
module.exports = router;
