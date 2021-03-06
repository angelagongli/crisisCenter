$(document).ready(function() {
  $("#createPost").on("click", function() {
    let title = $("#title").val();
    let body = $("#body").val();
    $.ajax({
      url: "/posts",
      method: "POST",
      data: {
        title: title,
        body: body
      }
    }).then(function() {
      location.reload();
    });
  });

  $.get("/posts", function(data) {
    let div = $(".posts");
    for (i = 0; i < data.length; i++) {
      let postContainer = $("<a>").attr("class", "post");
      postContainer.attr("href", `/forum/` + `${data[i].id}`);
      let postLink = $("<a>").attr("href", `/forum/` + `${data[i].id}`);
      postLink.attr("id", "linkColor");
      let postLinkSpan = $("<span>").attr("class", "toPost");
      let title = data[i].title;
      postLinkSpan.append(postLink);
      postLink.append(title);
      postContainer.append(postLinkSpan);
      div.append(postContainer);
    }
  });

  $("#newPost").on("click", function() {
    $("#postModal").on("shown.bs.modal", function() {
      $("#postTitle").trigger("focus");
    });
  });

  let url = window.location.href;
  let id = url.substring(41, 45);

  $.get(`/comments/${id}`, function(data) {
    let commentsContainer = $("#commentArea");
    commentsContainer.empty();
    for (i = 0; i < data.length; i++) {
      let commentRow = $("<div>").attr("class", "comment");
      let comment = $("<p>");
      let commentMessage = data[i].message;
      comment.append(commentMessage);
      commentRow.append(comment);
      commentsContainer.append(commentRow);
    }
  });

  $("#createComment").on("click", function() {
    let comment = $("#newComment")
      .val()
      .trim();

    $.ajax({
      url: url,
      method: "POST",
      data: {
        message: comment,
        id: id
      }
    }).then(function() {
      $("#newComment").val("");
      location.reload();
    });
  });
});
