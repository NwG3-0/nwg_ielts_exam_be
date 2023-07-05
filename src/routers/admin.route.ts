import express from 'express'
import * as adminController from '../controllers/admin.controller'
const router = express.Router()

router.post('/api/admin/login', adminController.loginAdmin)
router.post('/api/admin/register', adminController.registerAdmin)

export default router
