import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { client, con } from '..'
import { REDIS_KEYS } from '../keys'

dayjs.extend(utc)

export const getReadingContent = (req, res, _next) => {
  const { id_book, test } = req.query
  try {
    if (id_book && test) {
      con.query(
        'SELECT * FROM reading WHERE Id_book = ? AND Test = ?',
        [Number(id_book), Number(test)],
        async (error, result) => {
          if (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
          } else {
            await client.set(`${REDIS_KEYS.READING_CONTENT}-${id_book}-${test}`, JSON.stringify(result[0]))

            res.status(StatusCodes.OK).json({ success: true, data: result[0] })
          }
          con.end()
        },
      )
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
  const { id_book, test, content, title, type } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO reading (Id_book, Test, Content, Title, Type, CreatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [id_book, test, content, title, type, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create reading content success ' })
      }
    },
  )
}
