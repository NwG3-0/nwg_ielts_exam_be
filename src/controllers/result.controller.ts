import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const getResultOfTest = async (req, res, _next) => {
  const queryString = req.body

  let total: { NumberOfResults: number }[]
  const startPage = Number(queryString.page || DEFAULT_START_PAGE) - 1
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const idUser = queryString.user_id

  if (!idUser) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  con.query(
    'SELECT COUNT(*) AS NumberOfResults FROM result_test INNER JOIN test ON test.id = result_test.Id_test WHERE Id_user = ?',
    [idUser],
    (error, result: any) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        total = result
      }
    },
  )

  con.query(
    'SELECT result_test.Result, result_test.Type, test.NumberTest, book.Name, result_test.CreatedAt FROM result_test JOIN test ON test.id = result_test.Id_test JOIN book ON book.id = test.Id_book WHERE Id_user = ? LIMIT ?, ?',
    [idUser, startPage, limit],
    async (error, result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: result, total: total[0] })
      }
    },
  )
}

export const addResultOfTest = (req, res, _next) => {
  const { id_test, user_id, result, type } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO result_test (Id_test, Id_user, Type, Result, CreatedAt) VALUES (?, ?, ?, ?)',
    [id_test, user_id, type, result, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create result success' })
      }
    },
  )
}
