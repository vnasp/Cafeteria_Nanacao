const { faker } = require('@faker-js/faker')
const jwt = require('jsonwebtoken')

const generateToken = () => {
  const email = faker.internet.email()
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1m" })
}

module.exports = { generateToken }
