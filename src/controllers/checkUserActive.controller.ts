import { StatusCodes } from 'http-status-codes'
import { con } from '..'

export const checkUserActive = (req, res, next) => {
  const { user_id } = req.body

  if (!user_id) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Don't try call this api" })

    throw new Error("Don't try call this api")
  }

  con.query(`SELECT * FROM active_users WHERE UserId = ?`, [user_id], (error, result: any[]) => {
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: error })

      throw new Error('You are not the active user')
    } else {
      if (result?.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'You are not the active user' })
      } else {
        return next()
      }
    }
  })
}
