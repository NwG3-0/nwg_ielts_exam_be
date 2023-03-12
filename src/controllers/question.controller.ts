import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

export const getReadingQuestion = (req, res, _next) => {
  const { id_book } = req.query

  if (!id_book) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  con.query('SELECT * FROM question_reading WHERE Id_book = ?', [Number(id_book)], (error, result) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: result[0] })
    }
  })
}

export const createReadingQuestion = (req, res, _next) => {
  const { id_book, question, title_question } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO reading (Id_book, Question, Title_question, CreatedAt) VALUES (?, ?, ?, ?)',
    [id_book, question, title_question, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create reading content success ' })
      }
    },
  )
}
