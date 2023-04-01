import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

export const getResultOfTest = async (req, res, _next) => {
  const { id_user } = req.query

  if (!id_user) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  con.query('SELECT * FROM result_reading_test WHERE Id_user = ?', [Number(id_user)], async (error, result) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: result })
    }
  })
}

export const addResultOfTest = (req, res, _next) => {
  const { id_test, id_user, result } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO result_reading_test (Id_test, Id_user, Result, CreatedAt) VALUES (?, ?, ?, ?)',
    [id_test, id_user, result, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create result success' })
      }
    },
  )
}
