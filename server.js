var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var multer = require('multer');
// var upload = multer();

mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost/spacebookDB');

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
app.post('/posts',function (req, res) {
    var postItem = new Post({
        text: req.body.text,
        comments: []

    });
    // var fileIMG = req.file;
    console.log(postItem);
    postItem.save(function (err, post) {
        if (err) {
            console.log(err);
        }
        res.send(post);
    });

});

//adding a file
// app.post('/posts', upload.single('photoField'), function (req, res, next) {
//     // req.file is the file uploaded via the form's `photoField` 
//     // req.body will hold the text fields, for example 'username'
//   })

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


app.put('/posts/:id', function (req,res){
    Post.findByIdAndUpdate(req.params.id, req.body,function(err,data){
      if (err) throw error;
      else{res.send(data)}
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

app.listen(process.env.PORT || '8000');