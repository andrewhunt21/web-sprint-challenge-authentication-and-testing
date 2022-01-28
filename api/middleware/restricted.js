const { JWT_SECRET } = require('../secrets')
const jwt = require('jsonwebtoken')
const User = require('../users/users-model')

const restricted = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return next({ status: 401, message: 'token required' })
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
}

function validateUser(req, res, next) {
  const { username, password } = req.body
  if (!username || !username.trim() || !password || !password.trim()) {
    res.status(400).json({ 
      message: 'username and password required'
    })
  } else {
    req.username = username.trim()
    req.password = password.trim()
    next()
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) next()
    else next({ status: 422, username: 'username taken' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  restricted,
  validateUser,
  checkUsernameFree
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
