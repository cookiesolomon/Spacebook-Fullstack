var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
    console.log("DB connection established!!!");
})

var Post = require('./models/postModel');


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// create 5 server routes
app.get("/posts", function (req, res) {
    Post.find((err, post) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(post);
        }
    });

});

// 2) to handle adding a post
app.post('/posts', function (req, res) {
    var postItem = new Post({
        text: req.body.text,
        comments: []

    });
    console.log(postItem);
    postItem.save(function (err, post) {
        if (err) {
            console.log(err);
        }
        res.send(post);
    });

});

// 3) to handle deleting a post
app.delete('/posts/:id', function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err, post) {
        if (!err) {
            console.log('succeeded');
            res.status(200).send();

        } else

            console.log(err);
    });
});

// // 4) to handle adding a comment to a post
app.post('/posts/:id/comments', function (req, res) {
    var comment = {
        user: req.body.user,
        text: req.body.text
    }

    Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, function (err, post) {
        // if (!err) {
        //     res.send(200);
        // } else {
        //     res.send(err);
        //     console.log("error adding comment");
        // }
        if(err) return console.log(err);
        //retun all data after adding the comment //updated data 
        Post.find(function(err,updatedData){
            if(err) return commentID.log(err);
            res.send(updatedData);
        })

    });
});
// // 5) to handle deleting a comment from a post

app.delete('/posts/:postID/comments/:commentID', function (req, res) {
    var postID = req.params.postID;
    var commentID = req.params.commentID;

    Post.findById(postID, function (err, post) {
        if (err) throw err;
        post.comments.id(commentID).remove();
        post.save();
        console.log('succeeded');
        res.status(200).send();

    });
});

app.listen(8000, function () {
    console.log("what do you want from me! get me on 8000 ;-)");
});