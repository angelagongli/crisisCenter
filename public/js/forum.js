$(document).ready(function() {
  $("#createPost").on("click", function() {
    let title = $("#postTitle").val();
    let body = $("#postBody").val();
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
    console.log(data);
    let div = $(".posts");
    for (i = 0; i < data.length; i++) {
      let postContainer = $("<div>").attr("class", "post");
      let postLink = $("<a>").attr("href", `/forum/` + `${data[i].id}`);
      let title = data[i].title;
      postLink.append(title);
      postContainer.append(postLink);
      div.append(postContainer);
    }
  });

  $("#newPost").on("click", function() {
    $("#postModal").on("shown.bs.modal", function() {
      $("#postTitle").trigger("focus");
    });
  });
});
