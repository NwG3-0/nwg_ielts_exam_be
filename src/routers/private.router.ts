import express from 'express'
import * as readingController from '../controllers/reading.controller'
import * as passageController from '../controllers/passage.controller'
import * as testController from '../controllers/test.controller'
import * as bookController from '../controllers/book.controller'
import { authAdminMiddleware } from '../middlewares'

const router = express.Router()

router.post('/api/reading/create', authAdminMiddleware, readingController.createReadingContent)
router.post('/api/passage/create', authAdminMiddleware, passageController.createPassage)
router.post('/api/test/create', authAdminMiddleware, testController.createTest)
router.post('/api/book/create', authAdminMiddleware, bookController.createBook)

export default router
