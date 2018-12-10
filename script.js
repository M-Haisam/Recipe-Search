var section = document.getElementById('results');
var searchBar = document.getElementById('search-bar');
var searchButton = document.getElementById('search-btn');

searchButton.addEventListener('click', makeRequest);

function makeRequest() {
    var httpRequest = new XMLHttpRequest();
    
    var searchQuery = searchBar.value;
    var url = "http://api.yummly.com/v1/api/recipes?_app_id=66e91053&_app_key=a92012752df81d1908ca0373af73e364&q=appetizers&maxResult=12&requirePictures=true";
    
    httpRequest.open('GET', url);
    httpRequest.responseType = 'json';
    httpRequest.onload = function () {
        var recipeInfo = httpRequest.response;
        section.innerHTML = "";
        displayInfo(recipeInfo);
        searchQuery = "";
    };
    httpRequest.send();
}

function displayInfo(info) {
    var recipe = info.matches;
    var attribution = info.attribution;
    console.log(recipe);
    for (var i=0;i<recipe.length;i++) {
        
        var article = document.createElement('article');
        var image = document.createElement('img');
        var name = document.createElement('h2');
        var rating = document.createElement('p');
        
        image.src = recipe[i].imageUrlsBySize["90"];
        name.textContent = recipe[i].recipeName;
        rating.textContent = recipe[i].rating;
        
        article.appendChild(image);
        article.appendChild(name);
        article.appendChild(rating);
        section.appendChild(article);   
    }
}