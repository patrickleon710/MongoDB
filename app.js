const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')
 
// init app and middleware
const app = express()
app.use(express.json())

// db connection
let db
connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('App is listening on port 3000')
        })
        db = getDb()
    }
})


// ROUTES
app.get('/Books', (req, res) => {

    const page = req.query.p || 0
    const booksPerPage = 2
    let books = []

    db.collection('Books')
    .find()
    .sort({author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books)
    })
    .catch(() => {
        res.status(500).json({error: 'Could not fetch the books'})
    })
})

app.get('/Books/:id' , (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('Books')
        .findone({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
            .catch(() => {
                res.status(500).json({error: 'could not fetch the documents'})
            })
        })
    } else {
        res.status(500).json({error: 'not valid id'})
    }
})

app.post('/Books', (req, res) => {
    const book = req.body

    db.collection('Books')
    .insertOne(book)
    .then(result => {
        res.status(200).json(result)
        .catch((err) => {
            res.status(500).json({error: 'could not create a new document'
            })
        })
    })
    
})