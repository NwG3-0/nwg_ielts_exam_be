import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const getTest = (req, res, _next) => {
  const { id_book } = req.query

  if (!id_book) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  con.query('SELECT * FROM test WHERE Id_book = ?', [Number(id_book)], (error, result) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: result })
    }
  })
}

export const getAllTestData = (req, res, _next) => {
  const queryString = req.query

  let total: { NumberOfTests: number }[]
  const startPage = Number(queryString.page || DEFAULT_START_PAGE) - 1
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const idBook = Number(queryString.id_book)

  if (idBook) {
    con.query(
      'SELECT COUNT(*) AS NumberOfTests FROM test INNER JOIN book ON book.id = test.Id_book WHERE Id_book = ?',
      [idBook],
      (error, result: any) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          total = result
        }
      },
    )

    con.query(
      'SELECT test.id, test.NumberTest, test.Id_book, book.Name, book.Image FROM test INNER JOIN book ON book.id = test.Id_book WHERE Id_book = ? LIMIT ?, ?',
      [idBook, startPage, limit],
      (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          res.status(StatusCodes.OK).json({ success: true, data: result, total: total[0] })
        }
      },
    )
  } else {
    con.query('SELECT COUNT(*) AS NumberOfTests FROM test', (error, result: { NumberOfTests: number }[]) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        total = result
      }
    })

    con.query(
      'SELECT test.id, test.NumberTest, test.Id_book, book.Name, book.Image FROM test INNER JOIN book ON book.id = test.Id_book LIMIT ?, ?',
      [startPage, limit],
      (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          res.status(StatusCodes.OK).json({ success: true, data: result, total: total[0] })
        }
      },
    )
  }
}

export const createTest = (req, res, _next) => {
  const { number_test, id_book } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO test (Id_book, NumberTest, CreatedAt) VALUES (?, ?, ?)',
    [id_book, number_test, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create test success ' })
      }
    },
  )
}
