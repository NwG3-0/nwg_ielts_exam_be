import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { con } from '..'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

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

export const getAllPassageData = (req, res, _next) => {
  const queryString = req.query

  let total: { NumberOfPassages: number }[]
  const startPage = Number(queryString.page || DEFAULT_START_PAGE) - 1
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const idTest = Number(queryString.id_test)

  if (idTest) {
    con.query(
      'SELECT COUNT(*) AS NumberOfPassages FROM passage INNER JOIN test ON test.id = passage.Id_test WHERE Id_test = ?',
      [idTest],
      (error, result: any) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          total = result
        }
      },
    )

    con.query(
      'SELECT passage.id, passage.Number_passage, test.NumberTest, passage.CreatedAt FROM passage INNER JOIN test ON test.id = passage.Id_test WHERE Id_test = ? LIMIT ?, ?',
      [idTest, startPage, limit],
      (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          res.status(StatusCodes.OK).json({ success: true, data: result, total: total[0] })
        }
      },
    )
  } else {
    con.query('SELECT COUNT(*) AS NumberOfPassages FROM passage', (error, result: { NumberOfPassages: number }[]) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        total = result
      }
    })

    con.query(
      'SELECT passage.id, passage.Number_passage, test.NumberTest, passage.CreatedAt FROM passage INNER JOIN test ON test.id = passage.Id_test LIMIT ?, ?',
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

export const createPassage = (req, res, _next) => {
  const { number_passage, id_test } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO passage (Id_test, Number_passage, CreatedAt) VALUES (?, ?, ?)',
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
