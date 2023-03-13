import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { client, con } from '..'
import { REDIS_KEYS } from '../keys'

dayjs.extend(utc)

export const getReadingContent = (req, res, _next) => {
  const { id_passage } = req.query
  try {
    if (id_passage) {
      con.query('SELECT * FROM reading WHERE Id_passage = ?', [Number(id_passage)], async (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          await client.set(`${REDIS_KEYS.READING_CONTENT}-${id_passage}`, JSON.stringify(result[0]))

          res.status(StatusCodes.OK).json({ success: true, data: result[0] })
        }
      })
    } else {
      con.query('SELECT * FROM reading', (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          res.status(StatusCodes.OK).json({ success: true, data: result })
        }
      })
      con.end()
    }
  } catch (error) {
    console.log(error)
  }
}

export const createReadingContent = (req, res, _next) => {
  const { id_passage, content, title, type } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO reading (Id_passage, Content, Title, Type, CreatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [id_passage, content, title, type, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create reading content success ' })
      }
    },
  )
}
