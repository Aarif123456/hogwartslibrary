//Abdullah Arif
//create dynamic dashboard for user
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
	welcomeText.innerHTML = "Welcome "; //text to welcome user by name
	welcomeText.innerHTML += userInfoJSON['fname'] +" " + userInfoJSON['lname'];
	'<li class="nav-item"><a href="https://aarif123456.github.io/HogwartsLibrary/docs/catalogue/search" class="nav-link"> Browse catalogue</a></li> '
	//use javascript to determine which page is active
	//JSON data can hold arrays so get links from one array and the text in the other
	//for loop 
}

window.onload() = createHeadboard(); //Dynamically create headboard on page load

function createHeadboard(pageNum, pageCategory){ //dynamically create headboard using page number 
	pageTitle = ['Browse catalogue', 'Events', 'Reading List'] ;
	pageList = [0,0,3,0,0]; //holds the number of page items
	pageLinks = ['search','events','readingList' ];//link to the given page
	pageListTitle = [[],[],['By book category','By student majors', 'all Time'],[],[]]; //sub page title
	pageListLinks =[];

	//all headboard start the same
	var headboard = `<div class="container">
                    <div class="head-bann">
                        <div class="logo">
                            <a href="https://aarif123456.github.io/HogwartsLibrary/"><img src="https://aarif123456.github.io/HogwartsLibrary/resources/images/logo.png" class="img-responsive" alt="Hogwarts logo" /></a>
                        </div>`;

    //default headboard if not logged in                  
    var defaultHeadboard = `<div class="head-part">
                            <ul>
                                <li><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/register">Signup</a></li>
                                <li><a href="https://aarif123456.github.io/HogwartsLibrary/docs/catalogue/signin">Login</a></li>
                                <div class="clearfix"> </div>
                            </ul>
                        </div>
                        <div class="clearfix"> </div>
                    </div>`;
    //default menu on home pages                 
    var defaultHomeMenu =`<div class="userMenu">
                        <a class="toggleMenu" href="">Menu</a>
                        <ul class="nav">`;
    for(int i=0;i<pageTitle.length ;i++){ 
    	defaultHomeMenu += '<li class="'; //each page is part of the list
    	defaultHomeMenu += (i==0)?"browse ":""; //browse catalogue is special 
    	if(pageNum == i){
    		defaultHomeMenu += "active "; //if on the page make it shine 
    	}
    	// add the link to the page
    	defaultHomeMenu += 'nav-item"><a href="https://aarif123456.github.io/HogwartsLibrary/docs/'; 
    	defaultHomeMenu += (i==0)?'catalogue/':'home/'; //catalogue links to the catalogue pages
    	defaultHomeMenu += pageLinks[i] + '" class="';
    	//if page has sub menu make it root
    	defaultHomeMenu +=(pageList[i]>0)?('root>'+pageTitle +'</a> <ul class="drdw">'):"nav-link>";
    	for(int j=0;j<pageList[i];j++){
    		defaultHomeMenu += '<li><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/charts/';
    		defaultHomeMenu += pageListLinks[i][j];
    		defaultHomeMenu += '>"' +pageListTitle[i][j] +'</a></li>'; 
    	}
    	defaultHomeMenu +=(pageList[i]>0)?('</ul>'):(pageTitle +"</a>");; 
    	defaultHomeMenu +='</li>'; //end option
    }                    
                        `
                            
    
    
                            <li >
                                <a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/" class="root">List</a>
                                <ul class="drdw">
                                    <li><a href="products.html">By major</a></li>
                                    <li><a href="products.html">By category</a></li>
                                    <li><a href="products.html">All time</a></li>
                                </ul>
                            </li>
                            <li class="nav-item"><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/about" class="nav-link">About Us</a>
                            </li>
                            <li class="nav-item"><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/contact" class="nav-link">Contact Us</a>
                            </li>
                            <li class="nav-item"><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/hours" class="nav-link">Hours</a>
                            </li>
                        </ul>
                        <script type="text/javascript" src="https://aarif123456.github.io/HogwartsLibrary/scripts/imported/nav.js"></script>
                    </div>
                    <!-- end userMenu -->
                </div>`;
}