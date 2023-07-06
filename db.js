const { MongoClient } = require('mongodb')

let dbConnection
let URI = 'mongodb+srv://gachohinderitu005:<password>@cluster0.myager5.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(URI)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}