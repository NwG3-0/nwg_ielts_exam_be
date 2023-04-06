import express from 'express'
import * as testController from '../controllers/test.controller'
import * as bookController from '../controllers/book.controller'

const router = express.Router()

router.get('/api/test', testController.getTest)
router.get('/api/test-all', testController.getAllTestData)

router.get('/api/book', bookController.getBook)

export default router
