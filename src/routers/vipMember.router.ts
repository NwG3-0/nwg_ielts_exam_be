import express from 'express'
import * as questionController from '../controllers/question.controller'
import * as answerController from '../controllers/answer.controller'
import * as resultController from '../controllers/result.controller'
import * as readingController from '../controllers/reading.controller'
import * as listeningController from '../controllers/listening.conntroller'

import { cacheAnswerReadingTest, cacheGetReadingContent } from '../middlewares/cache'
import { vipAccountMiddleware } from '../middlewares'
const router = express.Router()

router.get('/api/question-reading-detail', vipAccountMiddleware, questionController.getReadingQuestionDetail)
router.get('/api/question-listening-detail', vipAccountMiddleware, questionController.getListeningQuestionDetail)

router.get('/api/answer_reading', vipAccountMiddleware, cacheAnswerReadingTest, answerController.getAnswerOfTest)

router.get('/api/reading', vipAccountMiddleware, cacheGetReadingContent, readingController.getReadingContent)
router.get('/api/reading-test', vipAccountMiddleware, readingController.getReadingContentByTest)
router.get('/api/reading-all', vipAccountMiddleware, readingController.getAllReadingData)

router.get('/api/listening-test', vipAccountMiddleware, listeningController.getListeningContentByTest)

router.get('/api/result_reading', vipAccountMiddleware, resultController.getResultOfTest)
router.post('/api/result_reading/add', vipAccountMiddleware, resultController.addResultOfTest)

export default router
