const User = require('../users/users-model')
const { findBy } = require('../users/users-model')

function validateUser(req, res, next) {
  const { username, password } = req.body
  if (!username || !username.trim() || !password || !password.trim()) {
    res.status(400).json({ 
      message: 'username and password required'
    })
  } else {
    // req.username = username.trim()
    // req.password = password
    next()
  }
}
  
async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) next()
    else next({ status: 422, message: 'username taken' })
  } catch (err) {
    next(err)
  }
}

const checkUsernameExists = async (req, res, next) => {
  try {
    const [user] = await findBy({ username: req.body.username })
    if (!user) {
      next({ status: 401, message: 'invalid credentials' })
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  validateUser,
  checkUsernameFree,
  checkUsernameExists
}