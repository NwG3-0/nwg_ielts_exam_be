import { StatusCodes } from 'http-status-codes'
import { config } from '../configs'

export const authAdminMiddleware = (req: any, res, next) => {
  const admin = req.headers['admin']

  if (admin == config.AUTH_ADMIN) {
    return next()
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You are not the admin' })
  }
}
