import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const getBook = (req, res, _next) => {
  const queryString = req.query

  let total: { NumberOfBooks: number }[]
  const startPage = Number(queryString.page || DEFAULT_START_PAGE) - 1
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const keyword = queryString.keyword || ''

  con.query('SELECT COUNT(*) AS NumberOfBooks FROM book', (error, result: { NumberOfBooks: number }[]) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      total = result
    }
  })

  con.query(`SELECT * FROM book WHERE Name LIKE '%${keyword}%' LIMIT ?, ?`, [startPage, limit], (error, result) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: result, total: total[0] })
    }
  })
}

export const createBook = (req, res, _next) => {
  const { name, image } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO book (Name, Image, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?)',
    [name, image, currentTime, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create passage success' })
      }
    },
  )
}
