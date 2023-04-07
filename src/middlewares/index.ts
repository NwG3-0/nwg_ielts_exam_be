import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken'

export const authAdminMiddleware = (req: any, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (!authorizationHeader || authorizationHeader === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: 'Underfined jwt token' })

      throw new Error('Underfined jwt token')
    }

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        jsonwebtoken.verify(token, process.env.JWT_ADMIN_NWG as string, function (err, decoded) {
          if (err) {
            if (err.name === TokenExpiredError.name) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            }

            throw new Error(err)
          }
        })
      }
    }

    // no token found -> this is authentication API
    return next()
  } catch (error) {
    console.error('[Verify JWT] Error: ', error)
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })

    throw new Error('Something went wrong')
  }
}

export const vipAccountMiddleware = (req: any, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (!authorizationHeader || authorizationHeader === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: 'Underfined jwt token' })

      throw new Error('Underfined jwt token')
    }

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        jsonwebtoken.verify(token, process.env.JWT_ACTIVE_USER as string, function (err, decoded: any) {
          if (err) {
            res
              .status(StatusCodes.BAD_REQUEST)
              .json({ success: false, data: null, message: 'Please active the account Vip' })

            throw new Error(err)
          }
        })
      }
    }

    // no token found -> this is authentication API
    return next()
  } catch (error) {
    console.error('[Verify JWT] Error: ', error)
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.UNAUTHORIZED) })

    throw new Error('Something went wrong')
  }
}
