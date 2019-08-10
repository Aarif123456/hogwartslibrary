
function searchBooks(){
	var keyword=document.getElementById('searchWord').value;
	var searchType=document.getElementById('searchType').value.trim();
	if(keyword !=""){
		var xmlhttps = new XMLHttpRequest();
		xmlhttps.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//create table using info from JSON file 
				try {
					createBookTable(JSON.parse(this.responseText));
				}
				catch (e) {
					console.log(this.responseText);
				}
				
			}
		};
		var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/search_div.php?";
		var par="searchWord="+keyword+"&searchType="+searchType;
		xmlhttps.open("GET", url + par, true); //Set get request with given parameter
		xmlhttps.send(); 
	}
}

function createBookTable(userInfoJSON){ //create table from json file
	var welcomeText = document.getElementById("welcomeUser");
	var dashboardItem = document.getElementById("userMenuItem");
	var welcomeText.innerHTML = "Welcome "; //text to welcome user by name
	welcomeText.innerHTML += userInfoJSON['fname'] +" " + userInfoJSON['lname'];
	'<li class="nav-item"><a href="https://aarif123456.github.io/HogwartsLibrary/docs/catalogue/search" class="nav-link"> Browse catalogue</a></li> '
	//use javascript to determine which page is active
	//JSON data can hold arrays so get links from one array and the text in the other
	//for loop 


	


	
}