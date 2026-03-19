// this file sets up passport to handle authentication
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { findUserByEmail, findUserById } from '../models/users.js'

//tell passport to use email
passport.use(new LocalStrategy({ usernameField: 'email' }, async function (email, password, done) {
    //wrap everything in a try catch
    try {
        // try finding user by email
        const user = await findUserByEmail(email)

        // no user found, return false
        if (!user) {
            return done(null, false, {message: 'incorrect email or password'})
        }
        
        //check if password is correct
        const passwordIsValid = await bcrypt.compare(password, user.passwordHash)

        // id password wrong, return false
        if (!passwordIsValid) {
            return done(null, false, { message: 'incorrect email or password' })
        }

        //if correct, return the user
        return done(null, user)
    
    } catch (error) {
        return done(error)
    }
}))

// tells passport what to store in the session
//only stores the user id
passport.serializeUser(function (user, done) {
    done(null, user._id)
})

//tells passport how to get full
passport.deserializeUser(async function (id, done) {
    try {
        const user = await findUserById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})

export default passport