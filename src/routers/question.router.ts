import express from 'express'
import * as questionController from '../controllers/question.controller'
import { vipAccountMiddleware } from '../middlewares'

const router = express.Router()

router.post('/api/question-reading/create', questionController.createReadingQuestion)
router.get('/api/question-reading', vipAccountMiddleware, questionController.getReadingQuestion)
router.get('/api/question-reading-detail', questionController.getReadingQuestionDetail)

export default router
