import { StatusCodes } from 'http-status-codes'
import { REDIS_KEYS } from '../keys'
import { client } from '..'

export const cacheGetReadingContent = async (req, res, next) => {
  const { id_passage } = req.query

  const result = await client.get(`${REDIS_KEYS.READING_CONTENT}-${id_passage}`)

  if (result) {
    res.status(StatusCodes.OK).json({ success: true, data: JSON.parse(result), message: 'Day la cache' })
  } else {
    next()
  }
}

export const cacheAnswerReadingTest = async (req, res, next) => {
  const { id_test } = req.query

  const result = await client.get(`${REDIS_KEYS.READING_ANSWER}-${id_test}`)

  if (result) {
    res.status(StatusCodes.OK).json({ success: true, data: JSON.parse(result), message: 'Day la cache' })
  } else {
    next()
  }
}
