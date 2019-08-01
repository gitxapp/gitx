import userService from './user.service';

async function createUserController(req, res) {
  const action = await userService.createUser(req.body);
  res.status(action.status).send({
    message: action.message,
    data: action.data || {},
  });
}

export default {
  createUserController,
};
