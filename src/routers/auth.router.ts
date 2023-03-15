import express from 'express'
import * as authController from '../controllers/auth.controller'
import passport from 'passport'
import { middleware } from '../middlewares/passport'

const router = express.Router()

router.post(
  '/api/login',
  middleware,
  passport.authenticate('facebook-token', { session: false }),
  authController.authFacebook,
)

export default router
