import express from 'express'
import * as questionController from '../controllers/question.controller'
import * as answerController from '../controllers/answer.controller'
import * as resultController from '../controllers/result.controller'
import * as readingController from '../controllers/reading.controller'
import * as listeningController from '../controllers/listening.conntroller'
import * as gradeController from '../controllers/grade.controller'

import { cacheGetReadingContent } from '../middlewares/cache'
import { vipAccountMiddleware } from '../middlewares'
const router = express.Router()

router.get('/api/question-reading-detail', vipAccountMiddleware, questionController.getReadingQuestionDetail)
router.get('/api/question-listening-detail', vipAccountMiddleware, questionController.getListeningQuestionDetail)

router.get('/api/answer_reading', vipAccountMiddleware, answerController.getAnswerOfTest)
router.get('/api/answer_listening', vipAccountMiddleware, answerController.getAnswerListeningOfTest)

router.get('/api/reading', vipAccountMiddleware, cacheGetReadingContent, readingController.getReadingContent)
router.get('/api/reading-test', vipAccountMiddleware, readingController.getReadingContentByTest)
router.get('/api/reading-all', vipAccountMiddleware, readingController.getAllReadingData)

router.get('/api/listening-test', vipAccountMiddleware, listeningController.getListeningContentByTest)

router.get('/api/result', vipAccountMiddleware, resultController.getResultOfTest)
router.post('/api/result/add', vipAccountMiddleware, resultController.addResultOfTest)

router.post('/api/grade-reading', vipAccountMiddleware, gradeController.gradeTestReading)
router.post('/api/grade-listening', vipAccountMiddleware, gradeController.gradeTestListening)

router.get('/api/wrong-answer-reading-test', vipAccountMiddleware, gradeController.getWrongAnswerReadingTest)
router.get('/api/wrong-answer-listening-test', vipAccountMiddleware, gradeController.getWrongAnswerListeningTest)

export default router
