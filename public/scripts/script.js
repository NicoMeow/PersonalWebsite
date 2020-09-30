//global variables
var modal;
var modalImg;
var captionText;
// The current Img element used for display as modalImg
var curImgElement;
var imgs;
// The current expanded article
var expandedView;
//the comment form
var commentForm;
var messageForm;

function pageLoad(){
 console.log("display is" + document.getElementById('messageForm').style.display)
 console.log("display is" + document.getElementById('commentForm').style.display)
    //set the global variables
    modal = document.getElementById("myModal")
    modalImg = document.getElementById("expanded-image");
    //captionText = document.getElementById("expanded-image-caption");
    imgs = document.getElementsByClassName('myImg');
       for (img of imgs) {
           img.onclick = expandImage;
       }
    // load the photo span elements
    document.getElementsByClassName("close")[0].onclick = closeSpan;
    document.getElementsByClassName("nxtImg")[0].onclick = nxtSpan;
    document.getElementsByClassName("prvImg")[0].onclick = prvSpan;

    // load the article elements
    expandedView = document.getElementById("expanded-article")
    var readMores = document.getElementsByClassName("read-more");
    for (readMore of readMores) {
        console.log("readMore is" + readMores)
        readMore.onclick = openArticle;
    }
    document.getElementsByClassName("close-article")[0].onclick = closeArticle;

    //listen the submit event on blogPost comments and take over its submit event.
    commentForm = document.getElementById("commentForm");
    commentForm.addEventListener("submit", function(event) {
        event.preventDefault();
        //validate user input
        if (commentFormValidate(this)){
            sendUpdateComment();
        }
    });

    //listen to the submit event on message form and take over its submit event
    messageForm = document.getElementById("messageForm");
    messageForm.addEventListener("submit", function(event) {
        event.preventDefault();
        //validate user input
        console.log("validation is" + messageFormValidate(this));
        if (messageFormValidate(this)){
            sendMessage();
        }
    })

    //if user click on sendAnotherBtn button, the comment form should re-appear
    document.getElementById("sendAnotherBtn").onclick = () => {
       document.getElementById('messageForm').style.display = "block";
       document.getElementById('successMessage').style.display = "none";
    }
}


//When the user clicks on small image, show expanded-image and caption
function expandImage() {
    curImgElement = this;
    modal.style.display = "block";
    modalImg.src = curImgElement.src;
    //captionText.innerHTML = curImgElement.alt;
}

// When the user clicks on <span> (x), close the modal
function closeSpan() {
    modal.style.display = "none";
}

//When the user clicks on <span> (>), display the next image
function nxtSpan() {
    curImgElement = curImgElement.nextElementSibling;
    // If reached end of img list, go back to first image
    if (curImgElement == null) {
        curImgElement = imgs[0];
    }
    modalImg.src = curImgElement.src;
}

function prvSpan() {
    curImgElement = curImgElement.previousElementSibling;
    // If reached top of img list go to the last image
    if (curImgElement == null) {
        curImgElement = imgs[imgs.length - 1];
    }
    modalImg.src = curImgElement.src;
}


// article functions and the related comments
function openArticle() {
    var article = this.parentElement;
    var articleID = article.id;
    loadComments(articleID);
    //set the value of the hidden element in form
    blogPostIdNode = document.getElementById("blogPostId").setAttribute("value", article.id);
    expandedView.style.display = "block";
    document.getElementById("title").innerHTML = article.getElementsByClassName("title")[0].innerHTML;
    document.getElementById("content").innerHTML = article.getElementsByClassName("content")[0].innerHTML;
}

function closeArticle() {
    expandedView.style.display = "none";
    //deleted the existing comments node
    var element = document.getElementById("comment-view");
    var commentNodes = document.getElementsByClassName("existing-comments");
    while (commentNodes[0]) {
        element.removeChild(commentNodes[0]);
    }
}

function sendUpdateComment() {
    var xhr = new XMLHttpRequest();
    //var FD = new FormData(commentForm);
    var FD = new FormData(commentForm);
    // Define what happens on successful data submission
    xhr.addEventListener("load", function(event) {
      // Clear the form and append the comment to existing comments;
      document.getElementById("commentForm").reset();
      formatComment(JSON.parse(this.responseText));
    });
    // Define what happens in case of error
    xhr.addEventListener("error", function(event) {
      alert( 'Oops! Something went wrong.' );
    } );
    xhr.open("POST", "/leave-comment");
    xhr.send(FD);
}

function sendMessage() {
    var xhr = new XMLHttpRequest();
    var FD = new FormData(messageForm);
    // Define what happens on successful data submission
    xhr.addEventListener("load", function(event) {
       document.getElementById("messageForm").reset();
       //replace the send message form with successMessage
       document.getElementById('messageForm').style.display = "none";
       document.getElementById('successMessage').style.display = "block";
       console.log("display is" + document.getElementById('messageForm').display);
    });
    //Define what happens in case of error
    xhr.addEventListener("error", function(event) {
        alert( 'Oops! Something went wrong.');
    });
    xhr.open("POST", "/send-message");
    xhr.send(FD);
}

// return a JSON object containing all existing comments.
function loadComments(articleID) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var parsed_response = JSON.parse(this.responseText);
            for (comment of parsed_response) {
                formatComment(comment);
            }
        }
    }
    xhttp.open("GET", "/get-comments/" + articleID, true);
    xhttp.send();
}

function formatComment(comment) {
    var info_str = comment.name + " (" + comment.email + ") commented on " + comment.date;
    var content_str = comment.content;
    var comment_id = comment._id;
    //create a parent element to wrap comment content and info
    var existing_comment_div = document.createElement("div");
    existing_comment_div.setAttribute("id", comment_id);
    existing_comment_div.setAttribute("class", "existing-comments");
    var info_div = document.createElement("div");
    var content_div = document.createElement("div");
    var info_node = document.createTextNode(info_str);
    var content_node = document.createTextNode(content_str);
    info_div.appendChild(info_node);
    content_div.appendChild(content_node);
    existing_comment_div.appendChild(info_div);
    existing_comment_div.appendChild(content_div);
    //append new element before add-new-comment element
    var element = document.getElementById("comment-view");
    var child = document.getElementById("add-new-comment");
    element.insertBefore(existing_comment_div,child);
}

// Check that the form fields are not empty and the email addresses are email
function commentFormValidate(form){
    if (form.name.value == "") {
        alert("Please provide your name!");
        form.name.focus();
        return false;
    }
    if (form.email.value=="") {
        alert("Please provide your email!");
        form.email.focus();
        return false;
    }
    if (form.content.value=="") {
        alert("Please provide your comment!");
        form.content.focus;
        return false;
    }
    return true;
}

// Check that the form fields are not empty and the email addresses are email
function messageFormValidate(form){
    if (form.name.value == "") {
        alert("Please provide your name!");
        form.name.focus();
        return false;
    }
    if (form.email.value=="") {
        alert("Please provide your email!");
        form.email.focus();
        return false;
    }
    if (form.message.value=="") {
        alert("Please provide your message!");
        form.message.focus;
        return false;
    }
    return true;
}


window.onload = pageLoad;