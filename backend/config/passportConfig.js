// this file sets up passport to handle authentication
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { findUserByEmail, findUserById } from '../models/users.js';

//tell passport to use email
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async function (
    email,
    password,
    done,
  ) {
    //wrap everything in a try catch
    try {
      // try finding user by email
      const user = await findUserByEmail(email);

      // no user found, return false
      if (user === null) {
        return done(null, false, { message: 'incorrect email or password' });
      }

      //check if password is correct
      const isMatch = await bcrypt.compare(password, user.passwordHash);

      // id password wrong, return false
      if (isMatch === false) {
        return done(null, false, { message: 'incorrect email or password' });
      }

      //if correct, return the user
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// tells passport what to store in the session
//only stores the user id
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//tells passport how to get full
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
