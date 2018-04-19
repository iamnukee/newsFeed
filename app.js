"use strict";
var url = "http://sports.espn.go.com/espn/rss/news";
window.onload = function(){
	init(url);
}

function init(url){
	//NHL URL for ESPN RSS feed
	//$('#feedlist').hide();

	if (localStorage.getItem('username') && localStorage.getItem('password')) {
		getFavorites(localStorage.getItem('username'), localStorage.getItem('password'));
	}

	document.querySelector("#content").innerHTML = "<b>Loading news...</b>";
	$("#content").fadeIn(250);
	//fetch the data
	load();
	$('#feeds :checkbox').change(load);
	$('#login').click(logIn);
	$('#register').click(register);
}

var stories = [];

function loadStories(){
	stories = []
	return $('#feeds :checked').toArray().map(checkbox =>{
		return "http://sports.espn.go.com/espn/rss/" + checkbox.value +"/news";
	});
}

function load(){
	loadStories().forEach( url => {
		$.get(url).done(function(data){
			xmlLoaded(data);
		});
	})
}
		
function xmlLoaded(obj){
	console.log("obj = " +obj);
	var items = obj.querySelectorAll("item");
	
//show the logo
	var image = obj.querySelector("image")
	var logoSrc = image.querySelector("url").firstChild.nodeValue;
	var logoLink = image.querySelector("link").firstChild.nodeValue;
	$("#logo").attr("src",logoSrc);
	
	//parse the data

	items.forEach(item => (stories.push(item)));
	stories.sort((story1, story2) => {
		return new Date(story2.querySelector("pubDate")) - new Date(story1.querySelector("pubDate"));
	});
	populate(stories);
}



function populate(stories){
	var html = "";
	for (var i=0;i<stories.length;i++){
		//get the data out of the item
		var newsItem = stories[i];
		var title = newsItem.querySelector("title").firstChild.nodeValue;
		console.log(title);
		var description = newsItem.querySelector("description").firstChild.nodeValue;
		var link = newsItem.querySelector("link").firstChild.nodeValue;
		var pubDate = newsItem.querySelector("pubDate").firstChild.nodeValue;
		
		//present the item as HTML
		var line = '<div class="item">';
		line += "<h2>"+title+"</h2>";
		line += '<p><i>'+pubDate+'</i> - <a href="'+link+'" target="_blank">See original</a></p>';
		//title and description are always the same (for some reason) so I'm only including one
		//line += "<p>"+description+"</p>";
		line += "</div>";
		
		html += line;
	}

	document.querySelector("#content").innerHTML = html;
}

function logIn() {
  var username = $('input[name="username"]')[0].value;
  var password = $('input[name="password"]')[0].value;
  $('feedlist').show();
  $('login-form').hide();
}

function getFavorites(username, password) {
  $.get('api.php', {
    'command': 'favorites',
    'username': username,
    'password': password,
  }).done(data => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    favorites = data;
    $('#login-form').hide();
    $('#feedlist').show();
  });
}

function register() {
  var username = $('input[name="username"]')[0].value;
  var password = $('input[name="password"]')[0].value;
  $.post('api.php', {
    'command': 'register',
    'username': username,
    'password': password,
  }).done(data => {
    logIn();
  });
}

