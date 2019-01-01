// Homepage
window.onload = function() {
    var httpRequest = new XMLHttpRequest();
    
    var url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&maxResult=12&requirePictures=true";
    
    httpRequest.open('GET', url);
    httpRequest.responseType = 'json';
    httpRequest.onload = function() {
        var results = httpRequest.response;
        displayResults(results);
    };
    httpRequest.send();
};

// End Homepage

var recipeContainer = document.getElementById('recipe-container');
var searchBar = document.getElementById('search-bar');
var searchButton = document.getElementById('search-btn');
var attribution = document.getElementById('attribution');
//Run function on Button click
searchButton.addEventListener('click', makeRequest);

//function for SEARCH RECIPE API call
function makeRequest() {
    var httpRequest = new XMLHttpRequest();
    
    var searchQuery = searchBar.value;
    var url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&q=" + searchQuery + "&maxResult=9&requirePictures=true";
    
    httpRequest.open('GET', url);
    httpRequest.responseType = 'json';
    httpRequest.onload = function() {
        var results = httpRequest.response;
        section.innerHTML = "";
        displayResults(results);
        searchQuery = ""; 
    };
    httpRequest.send();
}

//function for GET RECIPE API call
//function additionalInfo(info) {
//    var recipe = info.matches;
//    var attribution = info.attribution;
//    
//    recipe.forEach(function(i) {
//
//        var httpRequest = new XMLHttpRequest();
//        //Recipe ID from response 
//        var recipeID = i.id;
////        console.log(recipeID);
//        var url = "http://api.yummly.com/v1/api/recipe/" + recipeID + "?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364"; 
//            
//        httpRequest.open('GET', url);
//        httpRequest.responseType = 'json';
//        httpRequest.onload = function() { 
//            var recipeInfo = httpRequest.response; 
//            displayResults(recipeInfo);
//        };
//        httpRequest.send();
//    })
//}


//function to display results
function displayResults(result) {
    var recipe = result.matches;
    var attr = result.attribution;
    attribution.innerHTML = attr.html;
//    console.log(recipe);
    
    for (var i=0;i<recipe.length;i++) {
        
        var article = document.createElement('article');
        var image = document.createElement('img');
        var name = document.createElement('h2');
        var rating = document.createElement('p');
        var totalTime = document.createElement('p');

        image.src = recipe[i].imageUrlsBySize['90'];
        name.textContent = recipe[i].recipeName;
        
        var recipeRating = recipe[i].rating;
        ratingStars(recipeRating, rating);
        
        totalTime.textContent = recipe[i].totalTimeInSeconds / 60 + " " + "mins";

        article.appendChild(image);
        article.appendChild(name);
        article.appendChild(rating);
        article.appendChild(totalTime);
        recipeContainer.appendChild(article);
        
        article.className = 'recipe';
        name.className = 'recipe-name'
        rating.className = 'recipe-rating';
        totalTime.className = 'recipe-time';
    }
}

function ratingStars(stars, container) {
    var remaining = 5 - stars;
    if (stars <= 5 && stars >= 0) {
        for (var i=0;i<stars;i++) {
            var fullStar = document.createElement('span');
            fullStar.className = "fas fa-star";
            container.appendChild(fullStar)
        };
        for (i=0;i<remaining;i++) {
            var emptyStar = document.createElement('span');
            emptyStar.className = "far fa-star";
            container.appendChild(emptyStar)
        };
    }
}    
