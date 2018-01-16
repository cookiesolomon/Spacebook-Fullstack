var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');


//dummy text
// var hello = new Post ({text: "hi"});

// hello.comments.push({text: "great!", user: "MC"});


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:

app.get("/posts", function (req, res) {
    Post.find((err, post) => {  
        if (err) {
            // Note that this error doesn't mean nothing was found,
            // it means the database had an error while searching, hence the 500 status
            res.status(500).send(err)
        } else {
            // send the list of all people
            res.status(200).send(post);
        }
    });

 });

// 2) to handle adding a post
app.post('/posts', function(req, res){
    var postItem = new Post({
        text: req.body.text,
        comments: []
        
    });
  console.log(postItem);
    postItem.save(function (err, post) {
        if (err) { 
            console.log(err);
        }
        res.json(201, post);
      });
    
});
   


// 3) to handle deleting a post


app.delete('/posts/:id', function (req, res) {
  Post.findByIdAndRemove(req.params.id, function(err, post){
        if(!err) {
            console.log('succeeded');
            res.status(200).send();
            
        } else    
        
        console.log(err);
	});
});
 


// // 4) to handle adding a comment to a post
// app.put('/posts', function(req, res){

// });
// // 5) to handle deleting a comment from a post

// app.delete('/posts', function(req, res){

// });

app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});