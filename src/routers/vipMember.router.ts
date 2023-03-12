import express from 'express'
import * as questionController from '../controllers/question.controller'
import { cacheGetReadingContent } from '../middlewares/cache'

const router = express.Router()

router.get('/api/question-reading', cacheGetReadingContent, questionController.getReadingQuestion)

export default router
