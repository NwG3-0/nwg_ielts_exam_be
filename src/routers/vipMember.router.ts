import express from 'express'
import * as questionController from '../controllers/question.controller'
import * as answerController from '../controllers/answer.controller'
import * as resultController from '../controllers/result.controller'
import * as readingController from '../controllers/reading.controller'
import * as listeningController from '../controllers/listening.conntroller'

import { cacheAnswerReadingTest, cacheGetReadingContent } from '../middlewares/cache'
import { vipAccountMiddleware } from '../middlewares'
import { checkUserActive } from '../controllers/checkUserActive.controller'

const router = express.Router()

router.post(
  '/api/question-reading-detail',
  checkUserActive,
  vipAccountMiddleware,
  questionController.getReadingQuestionDetail,
)
router.post(
  '/api/question-listening-detail',
  checkUserActive,
  vipAccountMiddleware,
  questionController.getListeningQuestionDetail,
)

router.post(
  '/api/answer_reading',
  checkUserActive,
  vipAccountMiddleware,
  cacheAnswerReadingTest,
  answerController.getAnswerOfTest,
)

router.post(
  '/api/reading',
  checkUserActive,
  vipAccountMiddleware,
  cacheGetReadingContent,
  readingController.getReadingContent,
)
router.post('/api/reading-test', checkUserActive, vipAccountMiddleware, readingController.getReadingContentByTest)
router.post('/api/reading-all', checkUserActive, vipAccountMiddleware, readingController.getAllReadingData)

router.post('/api/listening-test', checkUserActive, vipAccountMiddleware, listeningController.getListeningContentByTest)

router.post('/api/result_reading', checkUserActive, vipAccountMiddleware, resultController.getResultOfTest)
router.post('/api/result_reading/add', checkUserActive, vipAccountMiddleware, resultController.addResultOfTest)

export default router
