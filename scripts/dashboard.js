
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
	var key= ""; //force make key an string
	//create Table with given header
	var tableText = "<table><thead><tr><td>BookISBN</td><td>Title</td><td>Author</td><td>Pages</td><td>Edition</td><td>Status</td><td>Category</td><td>Holds</td></tr></thead>";
	tableText+="<tbody>"; //Start table body 
	for (info of userInfoJSON){
		tableText += "<tr>"; //star new row
		for (key in info) { //for each element in info create entry
			tableText +="<td>";
			if(info.hasOwnProperty(key)){ 
				tableText +=info[key];
			}
			tableText +="</td>";
		}
		tableText += "<tr>"; //end the row
	}
	
	tableText+="</tbody> </table>";//close table
	document.getElementById("books_table").innerHTML = tableText;

	
}