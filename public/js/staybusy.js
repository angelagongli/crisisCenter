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
          .then(function(data) {
          console.log("success" + JSON.stringify(data));
          
          }).catch(err => {
              if (err) {
                  console.log(err);
              }
          });
    });
  });
