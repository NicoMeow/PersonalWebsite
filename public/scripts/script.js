//global variables
var modal;
var modalImg;
var captionText;
// The current Img element used for display as modalImg
var curImgElement;
var imgs;
// The current expanded article
var expandedView;

function pageLoad(){
    //set the global variables
    //modal = document.getElementsByClassName('modal')[0];
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
    captionText.innerHTML = curImgElement.alt;
}

function prvSpan() {
    curImgElement = curImgElement.previousElementSibling;
    // If reached top of img list go to the last image
    if (curImgElement == null) {
        curImgElement = imgs[imgs.length - 1];
    }
    modalImg.src = curImgElement.src;
    captionText.innerHTML = curImgElement.alt;
}


// article functions and the related comments
function openArticle() {
    var article = this.parentElement;
    console.log("article is " + article);
//    var comments = loadComments(article);
// return a JSON object containing all existing comments.
    function loadComments(article_id) {
      console.log("loading comments")
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("response text is " + this.responseText);
            var parsed_response = JSON.parse(this.responseText);
            //console.log("parsed response is" + parsed_response);                                      }];
            for (comment of parsed_response) {
                console.log("comment is" + comment);
                var info_str = "User "+ comment.user + " commented on " + comment.date;
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
        }
      };
      xhttp.open("GET", "/get-comments/" + article.id, true);
      xhttp.send();
    }
    loadComments();
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

//// create the html section for al existing comments related to article
//function createCommentNode(comments){
//    //get "existing-comments" DOM node
//    var existingComments = document.getElementsByClassName("existing-comments")[0];
//    //append comments as children of this node
//    for (comment of comments){
//        var info = document.createElement('DIV');
//        info.innerHTML = "user A posted sth on day b" // will be changed to comment metadata
//        var content = document.createElement('DIV');
//        content.innerHTML = "this is the content of the comment" // will eb changed to actual comment
//        existingComments.body.appendChild(info);
//        existingComments.body.appendChild(content);
//    }
//    console.log("existing comments are" + existingComments);
//    return existingComments;
//}
//

//
//function loadComments(title) {
//    // make a HTTP request to retrieve comments related to article
//    let request = new XMLHttpRequest();
//    request.open('GET', '/currentArticle/title');
//    request.responseType = 'text';
//    request.onload = () {
//        return request.response;
//    }
//    request.send();
//}

window.onload = pageLoad;
