const mongoose = require("mongoose");
const User = require("../Model/user.model.js");
const { VideoUploader } = require("../cloudinary/cloudinary.js");

async function generateToken(id) {
  try {
    const userinfo = await User.findById(id); // FIXED

    if (!userinfo) {
      throw new Error("User not found");
    }

    const accessToken = userinfo.generateToken(); // FIXED
    const refreshToken = userinfo.generateRefreshToken(); // FIXED

    userinfo.refreshToken = refreshToken; // FIXED

    await userinfo.save({ validateBeforeSave: false }); // FIXED

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Token generation error:", error.message);
    throw error;
  }
}

/// Auth Controllers
const signUp = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(500).json({
        message: "Name, Email and Password Required~",
        success: false,
      });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const CheckPhoto = req.files?.profile?.[0]?.path;

    if (!CheckPhoto) {
      return res.status(400).json({
        success: false,
        message: "Image is required!",
      });
    }

    const uploadOnCloud = await VideoUploader(CheckPhoto);

    if (!uploadOnCloud) {
      return res.status(500).json({
        success: false,
        message: "Error while uploading on cloudinary",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      bio,
      profile: uploadOnCloud.url,
    });

    const hideCreds = await User.findById(newUser.id).select(
      "-password -refreshToken",
    );

    return res.status(200).json({
      success: true,
      user: hideCreds,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({
        message: "Email / Password both fields required~",
        success: false,
      });
    }

    const findByEmail = await User.findOne({ email });
    if (!findByEmail) {
      return res.status(500).json({
        message: "User not found~",
        success: false,
      });
    }

    const passCheck = findByEmail.comparePassword(password);
    if (!passCheck) {
      return res.status(500).json({
        message: "Incorrect password~",
        success: false,
      });
    }

    const hideCreds = await User.findById(findByEmail.id).select(
      "-password -refreshToken",
    );

    const { accessToken, refreshToken } = await generateToken(findByEmail.id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        message: "Login successful",
        user: hideCreds,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const logout = async (req, res) => {
  try {
    console.log("req comes");
    const findUser = await User.findById(req.user.id);

    if (!findUser) {
      return res.status(500).json({
        message: "User not found",
        success: false,
      });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({
        success: true,
        message: "User successfully logout",
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const userInfo = req.user;
    return res.status(200).json({
      success: true,
      user: userInfo,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { signUp, login, logout, userDetails };
