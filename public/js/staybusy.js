$(document).ready(function() {
    let bodyInput = $("#body");
    let titleInput = $("#title");
    let authorSelect = $("#email");
    console.log(bodyInput);

    $("#submit").on("click ", function(event) {
        event.preventDefault();
        var newPost = {
            title: titleInput
              .val()
              .trim(),
            body: bodyInput
              .val()
              .trim(),
            user: authorSelect.val()
          };
          $.post("/staybusy", newPost)
          .then(function() {
          var row = $("<div>");
          row.addClass("idea");

          row.append("<p> Title: " + newPost.title + "</p>");
          row.append("<p> Idea: " + newPost.body + "</p>");
          row.append("<p> User: " + newPost.user + "</p>");

          $(".new-idea").prepend(row);
          
          }).catch(err => {
              if (err) {
                  console.log(err);
              }
          });

        $("#body").val("");
        $("#title").val("");
        $("#email").val("");
    });

    

   $.get("/staybusy", function(data){
       if (data.length !== 0) {
           for (var i = 0; i<data.length; i++)
           var row = $("<div>");
          row.addClass("idea");

          row.append("<p> Title: " + data[i].title + "</p>");
          row.append("<p> Idea: " + data[i].body + "</p>");
          row.append("<p> User: " + data[i].user + "</p>");

          $(".new-idea").prepend(row);
       }
   })

  });


