// checks if the user is logged in before allowing access

function isAuthenticated(req, res, next) {

  //checks if there is a valid session for this user
  if (req.isAuthenticated()) {
    //user logged in, let them through
    return next();
  }

  // user is not not logged in so send back an error
  res.status(401).json({
    message: 'you must be logged in',
  });
}

export default isAuthenticated;
