import { User } from "../model/user.model.js";
import { wrapasync } from "../utils/utility.js";
import { Errhandler } from "../utils/errhandler.js";
import bcrypt from "bcryptjs";
import { Token } from "../utils/token.js";
export const register = wrapasync(async (req, res, next) => {
  const { fullName, password, username, gender } = req.body;
  if (!fullName || !password || !gender || !username) {
    return next(new Errhandler("all field are req", 403));
  }
  const userExist = await User.findOne({ username });
  if (userExist) {
    return next(new Errhandler("user already exists", 403));
  }
  const avatar = `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`;
  const hashedPassword = bcrypt.hashSync(password, 10);
  let user = await User.create({
    fullName,
    username,
    password: hashedPassword,
    gender,
    avatar,
  });
  let token = Token(user._id);

  res
    .status(200)
    .cookie("newToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      // secure: process.env.NODE_ENV == "production",
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      user,
    });
});
export const login = wrapasync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new Errhandler("please enter any valid username and password", 403)
    );
  }
  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new Errhandler(
        "Please enter valid username and password : NOT FOUND",
        403
      )
    );
  }
  const isValidated = await bcrypt.compare(password, user.password);
  let token = Token(user._id);
  if (!isValidated) {
    return next(
      new Errhandler("please enter correct  username and password", 403)
    );
  }
  res
    .status(200)
    .cookie("newToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "none",
    })
    .json({
      success: true,
      user,
    });
});
export const getProfile = wrapasync(async (req, res, next) => {
  let userID = req.user.userid;
  const profile = await User.findById(userID);
  res.status(200).json({
    success: true,
    profile, // this will be extracted in action.payload.data.profile --in user.slice.js
  });
});
export const home = wrapasync(async (req, res) => {
  res.send("home page me");
});
export const logout = wrapasync(async (req, res, next) => {
  res
    .cookie("newToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: none,
      secure: true,
    })
    .json({ success: true, res: "logout successful" });
});
export const getOtherUser = wrapasync(async (req, res) => {
  const userAll = await User.find({ _id: { $ne: req.user.userid } });
  res.json({ res: userAll });
});
