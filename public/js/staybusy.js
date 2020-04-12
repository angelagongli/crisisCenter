$(document).ready(function() {
    $.get("/api/user_data").then(function(data) {
      $(".member-name").text(data.name);
    });
        // Getting jQuery references to the post body, title, form, and author select
        var bodyInput = $("#body");
        var titleInput = $("#title");
        var cmsForm = $("#cms");
        var authorSelect = $("#email");
        // Adding an event listener for when the form is submitted
        $(cmsForm).on("submit", handleFormSubmit)
      
        // A function for handling what happens when the form to create a new post is submitted
        function handleFormSubmit(event) {
          event.preventDefault();
          // Wont submit the post if we are missing a body, title, or author
          if (!titleInput.val().trim() || !bodyInput.val().trim() || !authorSelect.val()) {
            return;
          }
          // Constructing a newPost object to hand to the database
          var newPost = {
            title: titleInput
              .val()
              .trim(),
            body: bodyInput
              .val()
              .trim(),
            user: authorSelect.val()
          };
      
     
            submitPost(newPost);
        
        }
      
        // Submits a new post and brings user to blog page upon completion
        function submitPost(post) {
          $.post("/staybust", post, function() {
            window.location.href = "/staybusy";
          });
        }
      
  });
