import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { con } from '../index'

dayjs.extend(utc)

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
        res.send({
          success: true,
          data: {
            name: results[0].Name,
            email: results[0].Email,
            image: results[0].Image,
            isActived: results[0].IsActived,
          },
        })
      }
    })
  } catch (error) {
    next(error, false)
  }
}
