import User from './user.model';

async function createUser(userDetails) {
  const user = new User(userDetails);
  try {
    await user.save();
    return {
      data: user,
      status: 200,
      message: 'User created',
    };
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return {
        status: 401,
        message: 'Email Id already registered',
      };
    }
    return {
      status: 500,
      message: 'User not created',
      data: { error: err },
    };
  }
}

async function createOrUpdate(userDetails) {
  if (!userDetails.email) {
    return {
      status: 401,
      message: 'Email not found',
    };
  }
  try {
    await User.update({ email: userDetails.email }, userDetails, { upsert: true });
    if (user) {
      return {
        data: userDetails,
        status: 200,
        message: 'Logged in',
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: 'User not created',
      data: { error: err },
    };
  }
}

export default {
  createUser,
  createOrUpdate,
};
