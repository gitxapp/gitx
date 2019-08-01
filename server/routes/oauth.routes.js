import { Router } from 'express';
import OauthController from '../apis/v1/modules/Oauth/oauth.controller';

const router = Router();

router.get('/redirect', OauthController.createOauth);
export default router;
