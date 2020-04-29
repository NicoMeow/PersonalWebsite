// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var imgs = document.getElementsByClassName('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
// The current Img element used for display as modalImg
var curImgElement;
for (img of imgs) {
    img.addEventListener("click", function(){
    curImgElement = this;
    modal.style.display = "block";
    modalImg.src = curImgElement.src;
    captionText.innerHTML = curImgElement.alt;
    })
}


// Get the <span> elements
var closeSpan = document.getElementsByClassName("close")[0];
var nxtSpan = document.getElementsByClassName("nxtImg")[0];
var prvSpan = document.getElementsByClassName("prvImg")[0];

// When the user clicks on <span> (x), close the modal
closeSpan.onclick = function() {
    modal.style.display = "none";
}

//When the user clicks on <span> (>), display the next image
nxtSpan.onclick = function() {
    curImgElement = curImgElement.nextElementSibling;
    // If reached end of img list, go back to first image
    if (curImgElement == null) {
        curImgElement = imgs[0];
    }
    modalImg.src = curImgElement.src;
    captionText.innerHTML = curImgElement.alt;
}
//When the user clicks on <span> (<), display the previous image
prvSpan.onclick = function() {
    curImgElement = curImgElement.previousElementSibling;
    // If reached top of img list go to the last image
    if (curImgElement == null) {
        curImgElement = imgs[imgs.length - 1];
    }
    modalImg.src = curImgElement.src;
    captionText.innerHTML = curImgElement.alt;
}


//Get the expanded article view
var expandedView = document.getElementById("expanded-article");
//Get the article user wish to expand by clicking on more
var readMores = document.getElementsByClassName("read-more");

for (readMore of readMores) {
    readMore.onclick = function() {
        var article = this.parentElement;
        console.log("article is" + article.id)
        expandedView.style.display = "block";
        document.getElementById("title").innerHTML = article.getElementsByClassName("title")[0].innerHTML;
        document.getElementById("content").innerHTML = article.getElementsByClassName("content")[0].innerHTML;
    }
}

var closeArticle = document.getElementsByClassName("close-article")[0];
closeArticle.onclick = function() {
    expandedView.style.display = "none";
}
