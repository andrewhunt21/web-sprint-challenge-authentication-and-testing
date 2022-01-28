const db = require('../../data/dbConfig')

function find() {
    return db('users')
}

function findBy(filter) {
    return db('users').where(filter)
}

module.exports = {
    find,
    findBy
}