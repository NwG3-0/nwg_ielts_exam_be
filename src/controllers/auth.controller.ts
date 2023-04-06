import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import jwt from 'jsonwebtoken'
import { client, con } from '../index'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

dayjs.extend(utc)
const ONE_DAY_IN_SECOND = 86400

export const authFacebook = async (req, res, next) => {
  try {
    const profile = req.user
    const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    con.query(`SELECT * FROM user WHERE id = ${profile.id}`, (error, results: any) => {
      if (results.length === 0) {
        con.query(
          `INSERT INTO user (id, Name, Email, Image, AuthFacebookID, IsActived, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            profile.id,
            profile.displayName,
            profile.emails[0].value,
            profile.photos[0].value,
            '',
            0,
            currentTime,
            currentTime,
          ],
          (error) => {
            if (error) {
              res.send({ success: false, message: error })
            } else {
              res.send({
                success: true,
                data: {
                  id: profile.id,
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  image: profile.photos[0].value,
                  isActived: false,
                },
              })
            }
          },
        )
      } else {
        const jwtToken = jwt.sign(
          { id: results[0].id, name: results[0].Name, email: results[0].Email, isActived: results[0].IsActived },
          process.env.JWT_SECRET_KEY ?? '',
          {
            expiresIn: Number(process.env.JWT_EXPIRATION_DURATION ?? ONE_DAY_IN_SECOND),
          },
        )

        res.send({
          success: true,
          data: {
            id: results[0].id,
            name: results[0].Name,
            email: results[0].Email,
            image: results[0].Image,
            token: jwtToken,
          },
        })
      }
    })
  } catch (error) {
    next(error, false)
  }
}

export const logout = async (req, res, next) => {
  try {
    const { token } = req.body

    if (!token) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Token invalid' })

      return
    }

    await client.set(token, 'blacklisted', 'EX')

    res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Logout successfully' })
  } catch (error) {
    console.log('[log out] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
