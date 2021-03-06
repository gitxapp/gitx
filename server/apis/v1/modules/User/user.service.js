import jwt from "jsonwebtoken";

import User from "./user.model";

import Note from "../Note/note.model";

async function createUser(userDetails) {
  const user = new User(userDetails);
  try {
    await user.save();

    return {
      data: user,
      status: 200,
      message: "User created"
    };
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return {
        status: 401,
        message: "Email Id already registered"
      };
    }
    return {
      status: 500,
      message: "User not created",
      data: { error: err }
    };
  }
}

async function createOrUpdate({
  userName,
  githubId,
  email,
  avatarUrl,
  company,
  location,
  bio,
  authParams,
  accessToken
}) {
  const userDetails = {
    userName,
    githubId,
    email,
    avatarUrl,
    company,
    location,
    bio,
    authParams,
    accessToken
  };
  try {
    await User.update({ githubId }, userDetails, { upsert: true });
    const updatedUser = await User.findOne({ githubId });

    userDetails._id = updatedUser._id;
    userDetails.expiresIn = "7d";
    userDetails.token = jwt.sign(userDetails, process.env.JWT_KEY);

    return {
      data: userDetails,
      status: 200,
      message: "Logged in"
    };
  } catch (err) {
    return {
      status: 500,
      message: "User not created",
      data: { error: err }
    };
  }
}

async function getUsers() {
  try {
    const users = await User.find({}).select(
      "userName name githubId email avatarUrl company location bio"
    );
    const notes = await Note.find({});
    return {
      status: 200,
      data: {
        totalUsers: users.length,
        totalNotes: notes.length,
        allUsers: users
      }
    };
  } catch (err) {
    return {
      status: 200,
      message: "Failed to fetch users",
      data: { error: err }
    };
  }
}

export default {
  createUser,
  createOrUpdate,
  getUsers
};
