//Abdullah Arif
//create dynamic html pages
window.onload = function(){ //create common elements
	 loadNavbarHeader(); //get variable values
	 loadNavbarMenu()
	 loadCommonFooter();
	 document.getElementsByClassName("head-part").innerHTML=`<ul>
                                <li><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/register">Signup</a></li>
                                <!-- add in link to register**-->
                                <li><a href="https://aarif123456.github.io/HogwartsLibrary/docs/catalogue/signin">Login</a></li>
                                <div class="clearfix"> </div>
                            </ul>`   ; //just a test
}


function loadCommonFooter(){ //load common footer -this makes it easier to make changes 
	footerText = `<div class="footer">
        <div class="container">
            <div class="footer-top">
                <div class="subsc">
                </div>
                <div class="footer-bottom">
                    <div class="footer-nav">
                        <ul>
                            <li><a href="https://aarif123456.github.io/HogwartsLibrary/">home </a></li>
                            <li><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/contact">contact </a></li>
                            <li><a href="about.html">about</a></li>
                            <div class="clearfix"> </div>
                        </ul>
                    </div>
                    <p>Copyrights © 2015 4useri All rights reserved | Template by <a href="https://w3layouts.com/">W3layouts</a></p>
                </div>
            </div>
        </div>`;
    document.getElementById('commonFooter').innerHTML = footerText;    
}

function loadNavbarHeader(){ //dynamically create navbar using page number 
    var xmlhttp = new XMLHttpRequest();
    var pageCategory =document.getElementById("pageCategory").value.trim();
    var pageNum =document.getElementById("pageNum").value.trim();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadNavbarHeader";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
    //call function to load the home or custom
      if (this.readyState == 4 && this.status == 200) {
      	if(this.responseText.trim() != "not logged in"){
      		document.getElementsByClassName("head-part").innerHTML=this.responseText;
      	}
      	else{
      		//if we arn't logged in and are not on home category pages then go to sign in page
      		if(!(pageCategory=="home" ||(pageCategory =="catalogue" && pageNum==0 ))) {
      			window.location = "https://aarif123456.github.io/HogwartsLibrary/docs/catalogue/signin";
      		}
      	}
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    xmlhttp.send();  
                      
}

function createHomeNavbar(){
	pageNum = document.getElementById("pageNum").value;
	pageTitle = ['Browse catalogue', 'House Fines', 'Reading List','About Us','Contact Us','Hours'] ;
	pageList = [0,0,3,0,0]; //holds the number of page items
	pageLinks = ['search','houseFine','readingList', 'about','contact','hours'];//link to the given page
	pageListTitle = [[],[],['By book category','By student majors', 'All Time'],[],[],[]]; //sub page title
	pageListLinks =[[],[],['h','h','h'],[],[],[]];

    //default menu on home pages                 
    var defaultHomeMenu="";
    for(var i=0;i<pageTitle.length;i++){ 
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
    	defaultHomeMenu +=(pageList[i]>0)?('root">'+pageTitle[i] +'</a> <ul class="drdw">'):'nav-link">';
    	for(var j=0;j<pageList[i];j++){
    		defaultHomeMenu += '<li><a href="https://aarif123456.github.io/HogwartsLibrary/docs/home/charts/';
    		defaultHomeMenu += pageListLinks[i][j];
    		defaultHomeMenu += '">' +pageListTitle[i][j] +'</a></li>'; 
    	}
    	defaultHomeMenu +=(pageList[i]>0)?('</ul></li>'):(pageTitle[i] +"</a></li>");
    	defaultHomeMenu +=''; //end option
    }          
    //finish default user Menu          
    defaultHomeMenu += `</ul>`;
    return defaultHomeMenu ;
}


function loadNavbarMenu(){
	var menu = document.getElementsByClassName("nav");

	if(document.getElementById("pageCategory").value.trim()=="home"){
		menu[0].innerHTML = createHomeNavbar();
	}
	else{ //if in catalogue use custom options
		var xmlhttp = new XMLHttpRequest();
		var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadNavbarMenu";
		xmlhttp.open('POST', url, true);
		xmlhttp.onreadystatechange = function() {
		//call function to load the home or custom
		  if (this.readyState == 4 && this.status == 200) {
		  	if(this.responseText.trim()!="Invalid User"){
		  		menu[0].innerHTML = "Menu" + this.responseText;
		  	}
		  	else{
		  		if(!(pageCategory=="home" ||(pageCategory =="catalogue" && pageNum==0 ))) {
	      			window.location = "https://aarif123456.github.io/HogwartsLibrary/docs/catalogue/signin";
	      		}
	      	}
		  }
		}
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.withCredentials = true;
		xmlhttp.send(); 
	}
}