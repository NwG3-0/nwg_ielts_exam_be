import express from 'express'
import * as adminController from '../controllers/admin.controller'
import { authAdminMiddleware } from '../middlewares'
const router = express.Router()

router.post('/api/admin/login', authAdminMiddleware, adminController.loginAdmin)
router.post('/api/admin/register', authAdminMiddleware, adminController.registerAdmin)

export default router
