$(document).ready(function() {
    $(".delete-btn").on("click", function() {
        let bookmarkID = $(this).attr("id");
        $.ajax({
            method: "DELETE",
            url: "/api/bookmarks/" + bookmarkID
        }).then(function() {
            window.location.href = "/bookmarks"
        });
    })
});