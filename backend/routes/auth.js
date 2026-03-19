// this file handles all the authentication routes
// register, login, get current user, and logout
import express from 'express'
import bcrypt from 'bcrypt'
import passport from '../config/passportConfig.js'
import { createUser, findUserByEmail } from '../models/users.js'
import isAuthenticated from '../middleware/auth.js'

const router = express.Router()

// REGISTER - POST /api/auth/register
// creates a new user account
router.post('/register', async function (req, res) {
  try {
    // get the name email and password from the form
    const { name, email, password } = req.body

    // make sure all fields are filled in
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'all fields are required' })
    }

    // check if user with that email already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'an account with that email already exists' })
    }

    // hash the password before storing it in the database
    const passwordHash = await bcrypt.hash(password, 10)

    // create the new user in the database
    await createUser(name, email, passwordHash)
    console.log('new user created with email:', email)


    res.status(201).json({ message: 'account created successfully' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'something went wrongg on the server' })
  }
})

// LOGIN - POST /api/auth/login
// logs in an existing user using passport
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {

    // if there was a server error
    if (err) {
      return res.status(500).json({ message: 'something went wrong on the server' })
    }

    // if email or password was wrong
    if (!user) {
      return res.status(401).json({ message: info.message })
    }

    // log user in and create a session
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({ message: 'something went wrong on the server' })
      }
      // remove password hash before sending the user back
      delete user.passwordHash
      return res.json({ message: 'login successful', user: user })
    })

  })(req, res, next)
})

// GET CURRENT USER - GET /api/auth/user
// returns the currently logged in user
// isAuthenticated middleware makes sure only logged in users can access this
router.get('/user', isAuthenticated, function (req, res) {
  // passport puts the current user in req.user
  const user = req.user
  // remove the password hash before sending the user back
  delete user.passwordHash
  res.json({ user: user })
})

// LOGOUT - GET /api/auth/logout
// logs the user out and destroys the session
router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: 'something went wrong on the server' })
    }
    res.json({ message: 'logout successful' })
  })
})

export default router