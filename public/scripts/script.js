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
    captionText = document.getElementById("expanded-image-caption");
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
        readMore.onclick = openArticle;
    }
    document.getElementsByClassName("close-article")[0].onclick = closeArticle;
}


//When the user clicks on small image, show expanded-image and caption
function expandImage() {
    curImgElement = this;
    modal.style.display = "block";
    modalImg.src = curImgElement.src;
    captionText.innerHTML = curImgElement.alt;
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


// article functions
function openArticle() {
    var article = this.parentElement;
    console.log("article is " + article);
    expandedView.style.display = "block";
    document.getElementById("title").innerHTML = article.getElementsByClassName("title")[0].innerHTML;
    document.getElementById("content").innerHTML = article.getElementsByClassName("content")[0].innerHTML;
}

function closeArticle() {
    expandedView.style.display = "none";
}

window.onload = pageLoad;
