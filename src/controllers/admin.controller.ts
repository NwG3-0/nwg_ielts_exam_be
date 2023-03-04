import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { con } from '..'
import { config } from '../configs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import jwt from 'jsonwebtoken'

dayjs.extend(utc)
const ONE_DAY_IN_SECOND = 86400

export const registerAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const hashPassword = await bcrypt.hash(password, Number(config.AUTH_SALT_VALUE))
    const currentTime = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

    con.query(
      'INSERT INTO admin ( Username, Password, CreatedAt ) VALUES ( ?, ?, ? )',
      [username, hashPassword, currentTime],
      (error, _results) => {
        if (error) {
          if (error.errno === 1062) {
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Username has been used' })
          } else {
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error })
          }
        } else {
          res.status(StatusCodes.OK).json({ success: true, message: 'Add admin success' })
        }
      },
    )
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error })
  }
}

export const loginAdmin = (req, res, _next) => {
  const { username, password } = req.body

  if (username === '' || password === '') {
    res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Email & password are required' })
  }

  con.query('SELECT * FROM admin WHERE Username = ? LIMIT 1', [username], (error, result: any) => {
    if (result.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, data: null, message: 'Invalid username! Please register' })
    } else {
      const hashPassword = bcrypt.compareSync(password, result[0].Password)

      const jwtToken = jwt.sign({ email: result[0].Username }, process.env.JWT_SECRET_KEY ?? '', {
        expiresIn: Number(process.env.JWT_EXPIRATION_DURATION ?? ONE_DAY_IN_SECOND),
      })

      if (hashPassword) {
        res.status(StatusCodes.OK).json({ success: true, message: 'Login successfully', token: jwtToken })
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Wrong password' })
      }
    }
  })
}
