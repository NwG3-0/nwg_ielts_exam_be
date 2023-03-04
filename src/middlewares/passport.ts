import passport from 'passport'
import jwt from 'passport-jwt'
import { config } from '../configs'
import FacebookTokenStrategy from 'passport-facebook-token'

const JwtStrategy = jwt.Strategy
const ExtractJwts = jwt.ExtractJwt

export const middleware = () => {
  passport.use(
    new JwtStrategy(
      { jwtFromRequest: ExtractJwts.fromAuthHeaderAsBearerToken('Authorization'), secretOrKey: config.JWT_SECRET_KEY },
      (payload, done) => {
        try {
          console.log(payload)
        } catch (error) {
          done(error, false)
        }
      },
    ),
  )

  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: config.auth.facebook.CLIENT_ID,
        clientSecret: config.auth.facebook.CLIENT_SECRET,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          console.log('profile: ', profile)

          done(null, profile)
        } catch (error) {
          done(error, false)
        }
      },
    ),
  )
}
