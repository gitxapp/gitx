import User from './user.model';

async function createUser(userDetails) {
  const user = new User(userDetails);
  try {
    await user.save();
    return {
      user,
      status: 200,
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

export default {
  createUser,
};
