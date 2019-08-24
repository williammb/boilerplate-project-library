/*
 *
 *
 *       Complete the API routing below
 *       
 *       
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
    async function teste(db, books) {

        return result;
    }


    app.route('/api/books')
        .get(function(req, res) {
            MongoClient.connect(CONNECTION_STRING, (err, db) => {
                if (err) {
                    res.json({ error: 'Database error: ' + err });
                }
                db.collection('books').find({}).toArray(async(err, books) => {
                    if (err) {
                        res.json({ error: 'Error find: ' + err });
                    }
                    const result = [];
                    db.collection('comments').find({}).toArray((err, comments) => {
                        if (err) {
                            res.json({ error: 'Error find: ' + err });
                        }
                        let result = books.map(book => {
                            const comment = comments.filter(value => value.bookid === book);
                            const commentcount = comment === [] ? 0 : comment.length
                            return { _id: book._id, title: book.title, commentcount }
                        });
                        res.json(result);
                    })
                })
            });

            //response will be array of book objects
            //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        })

    .post(function(req, res) {
        if (!req.body['title']) {
            res.json({ error: 'no input provide' })
        } else {
            const book = {
                title: req.body['title']
            }
            MongoClient.connect(CONNECTION_STRING, (err, db) => {
                if (err) {
                    res.json({ error: 'Database error: ' + err });
                }
                db.collection('books').insertOne(book, (err, data) => {
                    if (err) {
                        res.json({ error: 'Erro to save this book' });
                    }
                    res.json(book);
                })
            })
        }
        //response will contain new book object including atleast _id and title
        //res.json({ _id: data._id, title: data.title });
    })

    .delete(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json({ error: 'Database error: ' + err });
            }
            db.collection(books).remove({}, (err, data) => {
                if (err) {
                    res.json({ Error: 'could not delete' + req.body['_id'] });
                }
                res.json({ success: 'complete delete successful' });
            })
        })

        //if successful response will be 'complete delete successful'
        //delete all books
    });



    app.route('/api/books/:id')
        .get(function(req, res) {
            MongoClient.connect(CONNECTION_STRING, (err, db) => {
                if (err) {
                    res.json({ error: 'Database error: ' + err });
                }
                db.collection('books').findOne(ObjectId(req.params.id), (err, book) => {
                    if (err) {
                        res.json({ error: 'erro to find book' });
                    }
                    if (!book) {
                        res.json({ error: 'no book provide' });
                    } else {
                        db.collection('comments').find({ bookid: req.params.id }).toArray((err, comments) => {
                            if (err) {
                                res.json({ error: 'erro to find comments' });
                            }
                            res.json({ _id: book._id, title: book.title, comments: comments })
                        })
                    }
                })
            })

            //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
            //res.json({ _id: book._id, title: book.title, comments: data })
        })

    .post(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json({ error: 'Database error: ' + err });
            }
            const comment = {
                bookid: req.params.id,
                comment: req.body.comment
            }
            console.log('WTF')
            db.collection('books').findOne(ObjectId(req.params.id), (err, book) => {
                if (err) {
                    res.json({ error: 'Error find: ' + err });
                }
                if (!book) {
                    res.json({ error: 'no book provide' });
                } else {
                    db.collection('comments').insertOne(comment, (err, data) => {
                        if (err) {
                            res.json({ error: 'Error find: ' + err });
                        }
                        db.collection('comments').find({ bookid: req.params.id }).toArray((err, comments) => {
                            if (err) {
                                res.json({ error: 'Error find: ' + err });
                            }
                            res.json({ _id: books._id, title: books.title, comments: comments })
                        })
                    })
                }
            })

        })

        //json res format same as .get
        //res.json({ _id: book._id, title: book.title, comments: data })
    })

    .delete(function(req, res) {

        if (!req.params.id) {
            res.json({ error: 'no book provide' })
        } else {
            db.collection('books').findOne(ObjectId(req.params.id)).toArray((err, books) => {
                if (err) {
                    res.json({ error: 'no book exists' })
                }
                db.collection('books').deleteOne({ _id: ObjectId(req.params.id) }, (err, data) => {
                    if (err) {
                        res.json({ error: 'no book exists' })
                    }
                    res.json({ success: 'delete successful' });
                })
            })
        }
    });
    //if successful response will be 'delete successful'
};