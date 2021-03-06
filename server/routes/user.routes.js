import { Router } from 'express';
import UserController from '../apis/v1/modules/User/user.controller';

const router = Router();

router.post('/', UserController.createUserController);

router.get('/all', UserController.getUsersController);

export default router;
