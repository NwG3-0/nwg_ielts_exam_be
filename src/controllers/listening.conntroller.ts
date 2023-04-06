import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes } from 'http-status-codes'
import { client, con } from '..'
import { REDIS_KEYS } from '../keys'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const getListeningContent = (req, res, _next) => {
  const { id_passage } = req.body
  try {
    if (id_passage) {
      con.query('SELECT * FROM listening WHERE Id_passage = ?', [Number(id_passage)], async (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          await client.set(`${REDIS_KEYS.READING_CONTENT}-${id_passage}`, JSON.stringify(result))

          res.status(StatusCodes.OK).json({ success: true, data: result })
        }
      })
    } else {
      con.query('SELECT * FROM listening', (error, result) => {
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

export const getListeningContentByTest = async (req, res, next) => {
  try {
    const { id_test } = req.body

    con.query(
      'SELECT listening.id, listening.Audio, passage.Number_passage, listening.CreatedAt FROM listening INNER JOIN passage ON passage.id = listening.Id_passage WHERE passage.Id_test = ?',
      [Number(id_test)],
      (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          res.status(StatusCodes.OK).json({ success: true, data: result })
        }
      },
    )
  } catch (error) {
    console.log(error)
  }
}

export const getAllListeningData = (req, res, _next) => {
  const queryString = req.query

  let total: { NumberOfListenings: number }[]
  const startPage = Number(queryString.page || DEFAULT_START_PAGE) - 1
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const idPassage = Number(queryString.id_passage)

  if (idPassage) {
    con.query(
      'SELECT COUNT(*) AS NumberOfListenings FROM listening INNER JOIN passage ON passage.id = listening.Id_passage WHERE Id_passage = ?',
      [idPassage],
      (error, result: any) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          total = result
        }
      },
    )

    con.query(
      'SELECT listening.id, listening.Content, listening.Title, passage.Number_passage, listening.CreatedAt FROM listening INNER JOIN passage ON passage.id = listening.Id_passage WHERE Id_passage = ? LIMIT ?, ?',
      [idPassage, startPage, limit],
      (error, result) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          res.status(StatusCodes.OK).json({ success: true, data: result, total: total[0] })
        }
      },
    )
  } else {
    con.query(
      'SELECT COUNT(*) AS NumberOfListenings FROM listening',
      (error, result: { NumberOfListenings: number }[]) => {
        if (error) {
          res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
        } else {
          total = result
        }
      },
    )

    con.query(
      'SELECT listening.id, listening.Audio, passage.Number_passage, listening.CreatedAt FROM listening INNER JOIN passage ON passage.id = listening.Id_passage LIMIT ?, ?',
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

export const createListeningContent = (req, res, _next) => {
  const { id_passage, audio } = req.body

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'INSERT INTO listening (Id_passage, Audio, CreatedAt) VALUES (?, ?, ?)',
    [id_passage, audio, currentTime],
    (error, _result) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Create listening content success ' })
      }
    },
  )
}
