import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

export const getPassage = (req, res, _next) => {
  const { id_test } = req.query

  if (!id_test) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID test' })
  }

  con.query('SELECT * FROM passage WHERE Id_test = ?', [Number(id_test)], (error, result) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: result[0] })
    }
  })
}

export const createPassage = (req, res, _next) => {
  const { number_passage, id_test } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO passage (Id_test, Number_passage, CreatedAt) VALUES (?, ?, ?, ?)',
    [id_test, number_passage, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create passage success' })
      }
    },
  )
}
