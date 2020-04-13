$(document).ready(function() {
  let userName;
  let userID;
  let userEmail;
  let recipientID;
  let recipientEmail;
  let contentHTML;
  let contentText;
  let members;
  
  $.get("/api/user_data").then(function(data) {
    userName = data.name;
    userID = data.id;
    userEmail = data.email;
    $(".member-name").text(userName);
  });

  $.get("/api/user_family_data").then(function(data) {
    members = data;
    for (member of data) {
      let option = $("<option>").text(`${member.name}`);
      $("#recipient").append(option);
    }
  });

  $.get("/api/nytimes").then(function(data) {
    updatePage(data);
  });

  $.get("/api/tweets").then(function(data) {
    appendTweets(data);
  });

  $(document).on("click", ".email-btn", function() {
    let contentID = $(this).data("id");
    contentHTML = $(`#${contentID}`).html();
    contentText = $(`#${contentID}`).text();
    $("#subject").val("[Corona Crisis Center] FWD: "); 
    if (contentID.includes("article")) {
      $("#message").val("Here is an interesting article!"); 
    } else if (contentID.includes("tweet")) {
      $("#message").val("Here is an interesting tweet!"); 
    }
  });

  $("#send").on("click", function(event) {
    event.preventDefault();
    let subject = $("#subject").val().trim();
    let message = $("#message").val().trim();
    let recipient = $("#recipient").val().trim();

    for (member of members) {
      if (member.name = recipient) {
        recipientID = member.id;
        recipientEmail = member.email;
      }
    }

    let email = {
      content:  contentHTML,
      text: contentText,
      subject: subject,
      message: message,
      userName: userName,
      userID: userID,
      userEmail: userEmail,
      recipientID: recipientID,
      recipientEmail: recipientEmail
    };
    
    $.post("/api/emails", email)
      .then(function(data) {
        console.log(data);
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      });

      $("#message").val("");
      $("#subject").val("");

  });

  $(document).on("click", ".bookmark-btn", function() {
    let contentID = $(this).data("id");
    contentHTML = $(`#${contentID}`).html();
    contentText = $(`#${contentID}`).text();
    $("#note").val("I want to view this later!"); 
  });

  $("#save").on("click", function(event) {
    event.preventDefault();
   
    let bookmark = {
      content:  contentHTML,
      text: contentText,
      note: $("#note").val().trim(),
      userID: userID
    };
    
    $.post("/api/bookmarks", bookmark)
      .then(function(data) {
        console.log("Posted... " + JSON.stringify(data));
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      });

      $("#note").val("");

  });

 
  /**
   * takes API data (JSON/object) and turns it into elements on the page
   * @param {object} NYTData - object containing NYT API data
   */
  function updatePage(NYTData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = 10;
  
    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
      // Get specific article info for current index
      var article = NYTData.response.docs[i];
  
      // Create the  list group to contain the articles and add the article content for each
      var $articleList = $("<ul>");
      $articleList.addClass("list-group");
  
      // Add the newly created element to the DOM
      $(".articles").append($articleList);
  
      // If the article has a headline, log and append to $articleList
      var headline = article.headline;
      var $articleListItem = $("<li class='list-group-item articleHeadline'>");
      var articleDiv = $("<div id='article" + i + "'>");
      $articleListItem.append(articleDiv);
  
      if (headline && headline.main) {
        articleDiv.append("<h5>" + headline.main + "</h5>");
      }
  
      // If the article has a byline, log and append to $articleList
      var byline = article.byline;
  
      if (byline && byline.original) {
        articleDiv.append("<p>" + byline.original + "</p>");
      }
  
      // Log published date, and append to document if exists
      var pubDate = article.pub_date;
      if (pubDate) {
        articleDiv.append("<p>" + pubDate.substring(0, 10) + "</p>");
      }

      // Log abstract, and append to document if exists
      var abstract = article.abstract;
      if (abstract) {
        articleDiv.append("<p>" + abstract + "</p>");
      }

      // Log paragraph, and append to document if exists
      var paragraph = article.lead_paragraph;
      if (paragraph && (paragraph !== abstract)) {
        articleDiv.append("<p>" + paragraph + "</p>");
      }
  
      // Append and log url
      articleDiv.append("<p><a href='" + article.web_url + "'>" + article.web_url + "</a></p>");

      var buttonsRow = $("<p><span class='buttons-span'>Email this article</span></p>");
      var emailButton = $("<button type='button' class='btn btn-primary email-btn' data-toggle='modal' data-target='#email'></button>");
      emailButton.attr("data-id", "article" + i);
      emailButton.append($("<i class='fas fa-envelope'></i>"));
      buttonsRow.prepend(emailButton);
      buttonsRow.prepend($("<span class='buttons-span'>Bookmark this article</span>"));
      var bookmarkButton = $("<button type='button' class='btn btn-primary bookmark-btn' data-toggle='modal' data-target='#bookmark'></button>");
      bookmarkButton.attr("data-id", "article" + i);
      bookmarkButton.append($("<i class='fas fa-bookmark'></i>"));
      buttonsRow.prepend(bookmarkButton);

      // Append the article
      $articleListItem.append(buttonsRow);
      $articleList.append($articleListItem);
    }
  }

  function appendTweets(tweets) {
    let twitterDiv = $("#twitter");
    let twitterList = twitterDiv.append($("<ul class='list-group'></ul>"));
    for (let i = 0; i < 10; i++) {
      let tweet = tweets[i];
      let tweetListItem = $("<li class='list-group-item'></li>");
      let tweetDiv = $("<div id='tweet" + i + "'>");
      tweetDiv.append("<p><img src='" + tweet.user.profile_image_url + 
      "'> " + tweet.user.name + " (@" + tweet.user.screen_name + ")</p>");
      tweetDiv.append("<p><i class='fas fa-quote-left'></i> " + 
        tweet.text + " <i class='fas fa-quote-right'></i></p>");
      tweetDiv.append("<p>" + tweet.created_at + "</p>");
      tweetDiv.append("<p><i class='fas fa-retweet'></i> " + tweet.retweet_count + 
        " <i class='far fa-heart'></i> " + tweet.favorite_count + "</p>");
      tweetListItem.append(tweetDiv);
      
      let bookmarkButtonRow = $("<p><span class='buttons-span'>Bookmark this tweet</span></p>");
      let bookmarkButton = $("<button type='button' class='btn btn-primary bookmark-btn' data-toggle='modal' data-target='#bookmark'></button>");
      bookmarkButton.attr("data-id", "tweet" + i);
      bookmarkButton.append($("<i class='fas fa-bookmark'></i>"));
      bookmarkButtonRow.prepend(bookmarkButton);
      tweetListItem.append(bookmarkButtonRow);
      
      let emailButtonRow = $("<p><span class='buttons-span'>Email this tweet</span></p>");
      let emailButton = $("<button type='button' class='btn btn-primary email-btn' data-toggle='modal' data-target='#email'></button>");
      emailButton.attr("data-id", "tweet" + i);
      emailButton.append($("<i class='fas fa-envelope'></i>"));
      emailButtonRow.prepend(emailButton);
      tweetListItem.append(emailButtonRow);
      twitterList.append(tweetListItem);
    }
  }
  
});
