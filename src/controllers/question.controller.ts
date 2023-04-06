import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

export const getReadingQuestion = (req, res, _next) => {
  const { id_passage } = req.query

  if (!id_passage) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  con.query('SELECT * FROM question_reading WHERE Id_passage = ?', [Number(id_passage)], (error, result) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: result })
    }
  })
}

export const getReadingQuestionDetail = (req, res, next) => {
  const { id_test } = req.query

  if (!id_test) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid id test' })
  }

  con.query(
    'SELECT question_reading.id, question_reading.Type, question_reading.Id_passage, question_reading.Question, question_reading.Title_question, passage.Id_test FROM question_reading INNER JOIN passage ON passage.id = question_reading.Id_passage WHERE passage.Id_test = ?',
    [Number(id_test)],
    (error, result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: result })
      }
    },
  )
}

export const createReadingQuestion = (req, res, _next) => {
  const { id_passage, type, question, title_question } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO question_reading (Id_passage, Question, Title_question, Type, CreatedAt) VALUES (?, ?, ?, ?, ?)',
    [id_passage, question, title_question, type, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create reading content success ' })
      }
    },
  )
}

export const getListeningQuestionDetail = (req, res, next) => {
  const { id_test } = req.query

  if (!id_test) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  con.query(
    'SELECT question_listening.id, question_listening.Question, question_listening.Title_question, passage.Id_test FROM question_listening INNER JOIN passage ON passage.id = question_listening.Id_passage WHERE passage.Id_test = ?',
    [Number(id_test)],
    (error, result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: result })
      }
    },
  )
}

export const createListeningQuestion = (req, res, _next) => {
  const { id_passage, question, title_question } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO question_listening (Id_passage, Question, Title_question, CreatedAt) VALUES (?, ?, ?, ?)',
    [id_passage, question, title_question, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create reading content success ' })
      }
    },
  )
}
