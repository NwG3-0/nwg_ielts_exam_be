import express from 'express'
import * as questionController from '../controllers/question.controller'

const router = express.Router()

router.post('/api/question-reading/create', questionController.createReadingQuestion)

export default router
