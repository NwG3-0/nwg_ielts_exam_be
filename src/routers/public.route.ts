import express from 'express'
import * as passageController from '../controllers/passage.controller'
import * as testController from '../controllers/test.controller'
import * as readingController from '../controllers/reading.controller'
import * as bookController from '../controllers/book.controller'

import { cacheGetReadingContent } from '../middlewares/cache'

const router = express.Router()

router.get('/api/passage', passageController.getPassage)
router.get('/api/passage-all', passageController.getAllPassageData)

router.get('/api/test', testController.getTest)
router.get('/api/test-all', testController.getAllTestData)

router.get('/api/reading', cacheGetReadingContent, readingController.getReadingContent)
router.get('/api/reading-all', readingController.getAllReadingData)

router.get('/api/book', bookController.getBook)

export default router
