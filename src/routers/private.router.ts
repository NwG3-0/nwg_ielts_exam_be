import express from 'express'
import * as readingController from '../controllers/reading.controller'
import * as questionController from '../controllers/question.controller'
import * as passageController from '../controllers/passage.controller'
import * as testController from '../controllers/test.controller'
import * as bookController from '../controllers/book.controller'
import * as answerController from '../controllers/answer.controller'
import { authAdminMiddleware } from '../middlewares'
import { privateMiddleware } from '../middlewares/private'

const router = express.Router()

router.post('/api/reading/create', privateMiddleware, authAdminMiddleware, readingController.createReadingContent)
router.post('/api/passage/create', privateMiddleware, authAdminMiddleware, passageController.createPassage)
router.post('/api/test/create', privateMiddleware, authAdminMiddleware, testController.createTest)
router.post('/api/book/create', privateMiddleware, authAdminMiddleware, bookController.createBook)
router.post(
  '/api/reading_question/create',
  privateMiddleware,
  authAdminMiddleware,
  questionController.createReadingQuestion,
)
router.post('/api/answer_reading/create', privateMiddleware, authAdminMiddleware, answerController.createAnswerOfTest)

export default router
