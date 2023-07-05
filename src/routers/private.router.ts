import express from 'express'
import * as readingController from '../controllers/reading.controller'
import * as listeningController from '../controllers/listening.conntroller'
import * as questionController from '../controllers/question.controller'
import * as passageController from '../controllers/passage.controller'
import * as testController from '../controllers/test.controller'
import * as bookController from '../controllers/book.controller'
import * as answerController from '../controllers/answer.controller'
import * as checkActiveUserController from '../controllers/checkUserActive.controller'

import { authAdminMiddleware } from '../middlewares'
import { privateMiddleware } from '../middlewares/private'

const router = express.Router()

// Router for admin
router.get('/api/passage', passageController.getPassage)
router.get('/api/passage-all', passageController.getAllPassageData)
router.post('/api/passage/create', privateMiddleware, authAdminMiddleware, passageController.createPassage)

router.post('/api/reading/create', authAdminMiddleware, readingController.createReadingContent)
router.post('/api/test/create', authAdminMiddleware, testController.createTest)
router.post('/api/book/create', authAdminMiddleware, bookController.createBook)
router.post('/api/reading_question/create', authAdminMiddleware, questionController.createReadingQuestion)
router.post('/api/question-reading/create', authAdminMiddleware, questionController.createReadingQuestion)
router.post('/api/answer_reading/create', authAdminMiddleware, answerController.createAnswerOfTest)
router.post('/api/answer_listening/create', authAdminMiddleware, answerController.createAnswerListeningOfTest)

//Router check active user
router.post('/api/check-active-user', privateMiddleware, checkActiveUserController.checkUserActive)

router.post('/api/listening/create', authAdminMiddleware, listeningController.createListeningContent)
router.post('/api/question-listening/create', questionController.createListeningQuestion)

router.get('/api/question-reading', authAdminMiddleware, questionController.getReadingQuestion)
export default router
