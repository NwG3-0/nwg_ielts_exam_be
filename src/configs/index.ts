require('dotenv').config()

export const config: any = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  AUTH_SALT_VALUE: process.env.AUTH_SALT_VALUE,
  AUTH_ADMIN: process.env.AUTH_ADMIN,
  auth: {
    facebook: {
      CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
      CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    },
  },
}
