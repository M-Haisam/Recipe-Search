// Homepage
window.onload = function() {
    var httpRequest = new XMLHttpRequest();
    
    var url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&maxResult=12&requirePictures=true";
    
    httpRequest.open('GET', url);
    httpRequest.responseType = 'json';
    httpRequest.onload = function() {
        var results = httpRequest.response;
        displayResults(results);
        viewMore.onclick = function(){
            moreResults(url);
        };
    };
    httpRequest.send();
};


// End Homepage

var body = document.getElementsByTagName('body');

var scrollButton = document.getElementById('scroll-btn');
scrollButton.onclick = function() {
    animateToTop();
}

var searchBar = document.getElementById('search-bar');
var searchButton = document.getElementById('search-btn');

var courseDropdown = document.getElementById('course-select');
var dietDropdown = document.getElementById('diet-select');
var allergyDropdown = document.getElementById('allergy-select');

var suggestedButtons = document.getElementsByClassName('suggested-btn');
suggestedRecipes()

var overlay = document.getElementById('overlay');
var infoContainer = document.getElementById('info-container');

var attribution = document.getElementById('attribution');
var homepageRecipesHeading = document.getElementById('homepage-recipes-heading');
var recipeContainer = document.getElementById('recipe-container');

var viewMore = document.getElementById('view-more-btn');

//Run function on Button click
searchButton.addEventListener('click', makeRequest);


//function for SEARCH RECIPE API call
function makeRequest() {
    var httpRequest = new XMLHttpRequest();
    
    var courseValue = courseDropdown.options[courseDropdown.selectedIndex].value;
    var dietValue = dietDropdown.options[dietDropdown.selectedIndex].value;
    var allergyValue = allergyDropdown.options[allergyDropdown.selectedIndex].value;
    
    var searchQuery = searchBar.value;
    var url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&q=" + searchQuery + "&maxResult=12&requirePictures=true&allowedCourse[]=" + courseValue + "&allowedDiet[]=" + dietValue + "&allowedAllergy[]=" + allergyValue;
    
    httpRequest.open('GET', url);
    httpRequest.responseType = 'json';
    httpRequest.onload = function() {
        var results = httpRequest.response;
        changeHeading(results);
        recipeContainer.innerHTML = "";
        displayResults(results);
        viewMore.onclick = function(){
            moreResults(url);
        };
    };
    httpRequest.send();
}



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
        var recipeID = document.createElement('p');

        image.src = recipe[i].imageUrlsBySize['90'];
        name.textContent = recipe[i].recipeName;
        
        var recipeRating = recipe[i].rating;
        ratingStars(recipeRating, rating);
        
        totalTime.textContent = recipe[i].totalTimeInSeconds / 60 + " " + "mins";

        recipeID.textContent = recipe[i].id;
        
        article.appendChild(image);
        article.appendChild(name);
        article.appendChild(rating);
        article.appendChild(totalTime);
        article.appendChild(recipeID);
        recipeContainer.appendChild(article);
        
        article.className = 'recipe';
        image.className = 'recipe-img';
        name.className = 'recipe-name';
        rating.className = 'recipe-rating';
        totalTime.className = 'recipe-time';
        recipeID.className = 'recipe-ID';
        
        if (recipeContainer.innerHTML !== "") {
            expandRecipe();
        }
    }
}

function expandRecipe() {
    var displayedRecipes = document.getElementsByClassName('recipe');
    
    for (var i=0;i<displayedRecipes.length;i++) {
        displayedRecipes[i].onclick = function() {
            overlay.style.display = 'block';
            body[0].style.overflow = 'hidden';
            var httpRequest = new XMLHttpRequest();
            var recipeID = this.lastChild.textContent;
            var url = "http://api.yummly.com/v1/api/recipe/" + recipeID + "?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364";
            
            httpRequest.open('GET', url);
            httpRequest.responseType = 'json';
            httpRequest.onload = function() {
                var results = httpRequest.response;
                displayAdditionalInfo(results);
            };
            httpRequest.send();
        }
    }
    
}

function displayAdditionalInfo(results) {
    var imgSrc = results.images[0];
    var recipeIngredients = results.ingredientLines;
    var nutritionalInfo = results.nutritionEstimates;

    console.log(results);
    infoContainer.innerHTML = "";
    
    var cross = document.createElement('i');
    var recipeImg = document.createElement('img');
    var recipeName = document.createElement('h2');
    var recipeSource = document.createElement('a');
    var recipeAttribution = document.createElement('p');
    
    var recipeRating = document.createElement('p');
    var recipeRatingValue = results.rating;
    ratingStars(recipeRatingValue, recipeRating);
    
    var ingredientList = document.createElement('ul');
    for (var i=0;i<recipeIngredients.length;i++) {
        var ingredient = document.createElement('li');
        ingredient.textContent = recipeIngredients[i];
        ingredient.className = "recipe-ingredient";
        ingredientList.appendChild(ingredient);
    }
    
    var recipeCalories = document.createElement('p');
    for (var i=0;i<nutritionalInfo.length;i++) {
        if (nutritionalInfo[i].description === "Energy") {
            recipeCalories.textContent = nutritionalInfo[i].value + " kcal";
        }
    }
    
    cross.className = "close-icon fas fa-times"
    recipeImg.src = imgSrc['hostedLargeUrl'];
    recipeName.textContent = results.name;
    recipeSource.href = results.source['sourceRecipeUrl'];
    recipeSource.textContent = results.source['sourceDisplayName'];
    recipeAttribution.innerHTML = results.attribution['html'];
    
    infoContainer.appendChild(cross);
    infoContainer.appendChild(recipeImg);
    infoContainer.appendChild(recipeName);
    infoContainer.appendChild(recipeSource);
    infoContainer.appendChild(recipeRating);
    infoContainer.appendChild(ingredientList);
    infoContainer.appendChild(recipeCalories);
    infoContainer.appendChild(recipeAttribution);
    overlay.appendChild(infoContainer);
    
    recipeImg.className = "enlarged-img";
    recipeName.className = "enlarged-name";
    recipeSource.className = "recipe-source";
    recipeRating.className = "enlarged-rating";
    ingredientList.className = "ingredient-list";
    recipeCalories.className = "recipe-calories";
    
    cross.onclick = closeOverlay;
    function closeOverlay() {
        overlay.style.display = 'none';
        body[0].style.overflow = 'auto';
    }
}

function suggestedRecipes() {
    var url;
    
    for (var i=0;i<suggestedButtons.length;i++) {
        suggestedButtons[i].onclick = function suggestedRecipesRequest() {
            
            if (this.id === "festive") {
                url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&maxResult=12&requirePictures=true&allowedHoliday[]=holiday^holiday-christmas&allowedHoliday[]=holiday^holiday-thanksgiving";
            }
            else if (this.id === "sweet") {
                url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&maxResult=12&requirePictures=true&flavor.sweet.min=0.4&flavor.sweet.max=1";
            }
            else if (this.id === "spicy") {
                url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&maxResult=12&requirePictures=true&flavor.piquant.min=0.4&flavor.piquant.max=1";
            }
            else if (this.id === "vegan") {
                url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&maxResult=12&requirePictures=true&allowedDiet[]=386^Vegan";
            }
            
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', url);
            httpRequest.responseType = 'json';
            httpRequest.onload = function() {
                var results = httpRequest.response;
                changeHeading(results);
                recipeContainer.innerHTML = "";
                displayResults(results);
                viewMore.onclick = function(){
                    moreResults(url);
                };
            };
            httpRequest.send();
        }
    }
}


function moreResults(url) {
    var currentResults = document.getElementsByClassName('recipe').length;
    var nextResults = currentResults + 12;
    
    var httpRequest = new XMLHttpRequest();
    
    url += "&start=" + nextResults;
    console.log(url);
    
    httpRequest.open('GET', url);
    httpRequest.responseType = 'json';
    httpRequest.onload = function() {
        var results = httpRequest.response;
        displayResults(results);
    };
    httpRequest.send();
}

function changeHeading(result) {
    var courseText = courseDropdown.options[courseDropdown.selectedIndex].text;
    var totalMatches = result.totalMatchCount;
    var searchTerm = result.criteria;
    
    if (searchTerm.q === null) {
        homepageRecipesHeading.textContent = totalMatches + " results found";
    } else if (courseText !== "All courses") {
        homepageRecipesHeading.textContent = totalMatches + " results found for " + searchTerm.q + " " + courseText;
    } else {
        homepageRecipesHeading.textContent = totalMatches + " results found for " + searchTerm.q;
    }
    
    homepageRecipesHeading.style.textTransform = "lowercase";
}

//function to convert number rating to stars
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



function animateToTop() {
    var scrollToTop = setInterval(function() {
        var position = window.pageYOffset;
        if (position > 0) {
            window.scrollTo(0, position - 20);
        } else {
            clearInterval(scrollToTop);
        }
    }, 1);
}

//function scrollToTop() {
//    if (window.pageYOffset != 0) {
//        setTimeout(function() {
//            window.scrollTo(0, window.pageYOffset - 30);
//            scrollToTop();
//        }, 1);
//    }
//}

