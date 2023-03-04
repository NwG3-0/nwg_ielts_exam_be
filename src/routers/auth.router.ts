import express from 'express'
import * as authController from '../controllers/auth.controller'
import passport from 'passport'

const router = express.Router()

router.post('/api/login', passport.authenticate('facebook-token', { session: false }), authController.authFacebook)

export default router
