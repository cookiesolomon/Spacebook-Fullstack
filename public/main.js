var SpacebookApp = function () {

 

  var $posts = $(".posts");
  var fetch = function () {
    $.ajax({
      url: "/posts",
      method: "GET",
      success: function (data) {
        posts = data;
        _renderPosts();
      },
      error: function (data) {
        console.log('Error');
      }
    });
  };

  fetch();

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i);
    }
  }

  function addPost(newPost) {
    var posts = [];
    $.ajax(
      {
        method: "POST",
        url: "/posts",
        data: { 'text': newPost },
        success: function (data) {
        console.log(data);
        posts.push(data);
        // _renderPosts(posts);
        fetch();
        },
        error: function (err) {
          console.log('Error: ' + data);
        }
      });
  }
  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list');
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (id) {

    $.ajax({
      url: '/posts/' + id,
      method: 'DELETE',


      success: function (data) {
        console.log('success');
        fetch();
      },
      error: function () {
        console.log('error');

      }
    });
  };

  var addComment = function (newComment, postIndex, postID) {

    $.ajax(
      {
        method: "POST",
        url: "/posts/" + postID + '/comments',
        data: newComment,
        success: function (data) {
          console.log(newComment);
          posts = data;
          _renderComments(postIndex);
          // $('.comments-container').toggleClass('show');
        },
        error: function (err) {
          console.log(err);
        }
      });
  };

  var editPost = function(newPost, postID) {
    $.ajax({
      method: "PUT",
      url: 'posts/' + postID,
      data: { text: newPost },
      success: function (data) {
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }


  var deleteComment = function (postID, commentID) {

    $.ajax({
      method: 'DELETE',
      url: '/posts/' + postID + '/comments/' + commentID,

      success: function (data) {
        console.log('success');
        fetch();
      },
      error: function () {
        console.log('error');

      }
    });
  };
  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    editPost: editPost,
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function () {
  var $input = $("#postText");
  var myFile = $('.file').val();
  console.log(myFile);
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var id = $(this).parents('.post').data().id;
  app.removePost(id);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {
  var postID = $(this).parents('.post').data().id;
  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex, postID);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var postID = $(this).parents('.post').data().id;
  var commentID = $(this).closest('.comment').data().id;
  // var commentID = $(this).parents('.comment').data().id;
  // var $commentsList = $(this).closest('.post').find('.comments-list');
  // var postIndex = $(this).closest('.post').index();
  // var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postID,commentID);


});


$posts.on('click', '.update-post', function () {
  var postID = $(this).parents('.post').data().id;
  var newPost = $(this).siblings('.edit-input').val();
  app.editPost(newPost, postID);
  // $(this).siblings('.remove-post').find('.input-group').toggleClass('show');
})

$posts.on('click', '.edit-post', function(){
  $(this).closest('.post').children('.input-group-edits').toggleClass('show');

})