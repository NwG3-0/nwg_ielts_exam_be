import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import jwt from 'jsonwebtoken'
import { con } from '../index'

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
          { name: results[0].Name, email: results[0].Email, isActived: results[0].IsActived },
          process.env.JWT_SECRET_KEY ?? '',
          {
            expiresIn: Number(process.env.JWT_EXPIRATION_DURATION ?? ONE_DAY_IN_SECOND),
          },
        )

        res.send({
          success: true,
          data: {
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
