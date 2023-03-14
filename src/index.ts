'use strict'

require('dotenv').config()

import mysql from 'mysql2'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import authRoutes from './routers/auth.router'
import adminRoutes from './routers/admin.route'
import publicRoutes from './routers/public.route'
import privateRoutes from './routers/private.router'
import vipMembersRoutes from './routers/vipMember.router'
import { middleware } from './middlewares/passport'
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken'
import { cors } from './utils/cors'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { vipAccountMiddleware } from './middlewares'
import { createClient } from 'redis'

const DEFAULT_SERVER_PORT = 4000
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : DEFAULT_SERVER_PORT

export const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Phamlam@2k',
  database: 'ielts',
})

con.connect((error) => {
  if (!error) {
    return
  }
})

const app = express()
app.use(morgan('combined'))
export let client

app.use(cors)

middleware()
app.use(authRoutes)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '30mb' }))

app.use(adminRoutes)
app.use(publicRoutes)

// Verify access token
app.use((req, res, next) => {
  try {
    const authorizationHeader = req.headers?.authorization
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]
      if (token) {
        jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY as string, function (err, decoded) {
          if (err) {
            if (err.name === TokenExpiredError.name) {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            } else {
              res.status(StatusCodes.BAD_REQUEST).json({ success: false, result: null, message: err.message })
            }
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
})

app.use(vipAccountMiddleware)
app.use(vipMembersRoutes)
app.use(privateRoutes)

app.listen(SERVER_PORT, async () => {
  try {
    client = createClient({
      password: 'CSS1oCiwEiNcXmxAgNVQLotY1xrdtrP8',
      socket: {
        host: 'redis-16663.c292.ap-southeast-1-1.ec2.cloud.redislabs.com',
        port: 16663,
      },
    })
    client.on('error', () => {
      console.log('Redis Client has been connect error')
    })
    await client.connect()
    console.log('Connect to Redis server')
  } catch (error) {
    console.log(error)
  }
})
console.log(`Example app listening on port ${SERVER_PORT}`)
