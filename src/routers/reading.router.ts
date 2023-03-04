import express from 'express'
import * as readingController from '../controllers/reading.controller'

const router = express.Router()

router.get('/api/reading', readingController.getReadingContent)
router.post('/api/reading/create', readingController.createReadingContent)

export default router
