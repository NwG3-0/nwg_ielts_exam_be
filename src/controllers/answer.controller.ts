import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { client, con } from '..'
import { REDIS_KEYS } from '../keys'

dayjs.extend(utc)

export const getAnswerOfTest = async (req, res, _next) => {
  const { id_test } = req.body

  if (!id_test) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  con.query('SELECT * FROM answer_reading WHERE Id_test = ?', [Number(id_test)], async (error, result) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      await client.set(`${REDIS_KEYS.READING_ANSWER}-${id_test}`, JSON.stringify(result))

      res.status(StatusCodes.OK).json({ success: true, data: result })
    }
  })
}

export const createAnswerOfTest = (req, res, _next) => {
  const { id_test, answer, keyword, explain, where } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO answer_reading (Id_test, Answer, Keyword, Explaining, WhereInfo, CreatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [id_test, answer, keyword, explain, where, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create reading content success ' })
      }
    },
  )
}
