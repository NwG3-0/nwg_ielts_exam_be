import express from 'express'
import * as readingController from '../controllers/reading.controller'
import { cacheGetReadingContent } from '../middlewares/cache'

const router = express.Router()

router.get('/api/reading', cacheGetReadingContent, readingController.getReadingContent)
router.post('/api/reading/create', readingController.createReadingContent)

export default router
