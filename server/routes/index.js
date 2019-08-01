import { Router } from 'express';
import UserRoutes from './user.routes';
import NoteRoutes from './note.routes';
import OauthRoutes from './oauth.routes';

const router = Router();
router.use('/user', UserRoutes);
router.use('/oauth', OauthRoutes);
router.use('/note', NoteRoutes);

export default router;
