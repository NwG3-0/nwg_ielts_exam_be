import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { client, con } from '..'
import { AnswerData, WrongAnswerData } from '../models/common'
import { REDIS_KEYS } from '../keys'

dayjs.extend(utc)

export const gradeTestReading = async (req, res, _next) => {
  const { id_test, answer, user_id } = req.body

  let wrongAnswer: WrongAnswerData[] = []
  const convertAnswer = JSON.parse(answer)

  if (!id_test) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })

    throw new Error('Invalid ID Book')
  }

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'SELECT * FROM answer_reading WHERE Id_test = ?',
    [Number(id_test)],
    async (error, result: AnswerData[] | any) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        result.map((ans: AnswerData, index: number) => {
          if (
            typeof convertAnswer.answer[index + 1] === 'undefined' ||
            convertAnswer.answer[index + 1] === '' ||
            convertAnswer.answer[index + 1].toLowerCase() !== ans.Answer.toLowerCase()
          ) {
            wrongAnswer.push({ ...ans, Where: index + 1 })
          }
        })

        con.query(
          'INSERT INTO result_test (Id_test, Id_user, Type, Result, CreatedAt) VALUES (?, ?, ?, ?, ?)',
          [Number(id_test), user_id, 'Reading', 40 - wrongAnswer.length, currentTime],
          (error, data) => {
            if (error) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
            } else {
              client.set(`${REDIS_KEYS.WRONG_ANSWER_READING}-${id_test}-${user_id}`, JSON.stringify(wrongAnswer))
              client.expire(`${REDIS_KEYS.WRONG_ANSWER_READING}-${id_test}-${user_id}`, 60 * 60)

              res.status(StatusCodes.OK).json({ success: true, message: 'Here is your result' })
            }
          },
        )
      }
    },
  )
}

export const gradeTestListening = async (req, res, _next) => {
  const { id_test, answer, user_id } = req.body

  let wrongAnswer: WrongAnswerData[] = []
  const convertAnswer = JSON.parse(answer)

  if (!id_test) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid ID Book' })
  }

  const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

  con.query(
    'SELECT * FROM answer_listening WHERE Id_test = ?',
    [Number(id_test)],
    async (error, result: AnswerData[] | any) => {
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
      } else {
        result.map((ans: AnswerData, index: number) => {
          if (
            typeof convertAnswer.answer[index + 1] === 'undefined' ||
            convertAnswer.answer[index + 1] === '' ||
            convertAnswer.answer[index + 1].toLowerCase() !== ans.Answer.toLowerCase()
          ) {
            wrongAnswer.push({ ...ans, Where: index + 1 })
          }
        })

        con.query(
          'INSERT INTO result_test (Id_test, Id_user, Type, Result, CreatedAt) VALUES (?, ?, ?, ?, ?)',
          [id_test, user_id, 'Listening', 40 - wrongAnswer.length, currentTime],
          (error, _result) => {
            if (error) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })
            } else {
              client.set(`${REDIS_KEYS.WRONG_ANSWER_LISTENING}-${id_test}-${user_id}`, JSON.stringify(wrongAnswer))
              client.expire(`${REDIS_KEYS.WRONG_ANSWER_LISTENING}-${id_test}-${user_id}`, 60 * 60)
              res.status(StatusCodes.OK).json({ success: true, message: 'Here is your result' })
            }
          },
        )
      }
    },
  )
}

export const getWrongAnswerReadingTest = async (req, res, _next) => {
  try {
    const { id_test, user_id } = req.query

    const result = await client.get(`${REDIS_KEYS.WRONG_ANSWER_READING}-${id_test}-${user_id}`)

    if (result) {
      res.status(StatusCodes.OK).json({ success: true, data: JSON.parse(result) })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null })
    }
  } catch (error) {
    console.error('[Verify JWT] Error: ', error)
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
    return
  }
}

export const getWrongAnswerListeningTest = async (req, res, _next) => {
  try {
    const { id_test, user_id } = req.query

    const result = await client.get(`${REDIS_KEYS.WRONG_ANSWER_LISTENING}-${id_test}-${user_id}`)

    if (result) {
      res.status(StatusCodes.OK).json({ success: true, data: JSON.parse(result) })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null })
    }
  } catch (error) {
    console.error('[Verify JWT] Error: ', error)
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })
    return
  }
}
