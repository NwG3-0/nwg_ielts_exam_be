import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'
import { config } from '../configs'

export const authAdminMiddleware = (req: any, res, next) => {
  const admin = req.headers['admin']

  if (admin == config.AUTH_ADMIN) {
    return next()
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You are not the admin' })
  }
}

export const vipAccountMiddleware = (req: any, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string, function (err, decoded: any) {
          console.log(decoded)
          if (!decoded.isActived) {
            res
              .status(StatusCodes.BAD_REQUEST)
              .json({ success: false, data: null, message: 'Please active the account Vip' })
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
    return
  }
}
