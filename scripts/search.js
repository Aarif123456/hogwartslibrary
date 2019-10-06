//Abdullah Arif
//Search for books
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
		//xmlhttp.withCredentials = true; don't need because you don't need authentication to search
		xmlhttps.send(); 
	}
}

function holdBook(bookISBN, bookName){
	if (confirm("Do you want to hold book: "+bookName+ "?")){
		//create parameter to send to server side
		var par = "bookISBN="+bookISBN;
		//
		var xmlhttp = new XMLHttpRequest();
		var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/holdBooks";
		xmlhttp.open('POST', url, true);
		xmlhttp.onreadystatechange = function() {
		  if (this.readyState == 4 && this.status == 200) {
		    console.log( this.responseText);
		    //**send them to  a page with the hold book confirmation or error
		  }
		}
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.withCredentials = true;
		xmlhttp.send(par); 
	} 
 
}

function createBookTable(bookJSON){ //create table from json file
	console.log(bookJSON);
	var key= ""; //force make key an string
	//create Table with given header
	var tableText = "<table><thead><tr><td></td><td>BookISBN</td><td>Title</td><td>Author</td><td>Pages</td><td>Edition</td><td>Status</td><td>Category</td><td>Holds</td></tr></thead>";
	tableText+="<tbody>"; //Start table body 
	for (book of bookJSON){
		tableText += "<tr>"; //star new row
		if(book.hasOwnProperty('bookName') && book.hasOwnProperty('bookISBN')){
			tableText +="<td>" + `<button type="button" name='holdButton' onclick='holdBook("`+
			book['bookISBN']+ `","` + book['bookName']+`");'>Hold Book</button>'</td>`;
		}
		
		for (key in book) { //for each element in book create entry
			tableText +="<td>";
			if(book.hasOwnProperty(key)){ 
				tableText +=book[key];
			}
			tableText +="</td>";
		}
		tableText += "<tr>"; //end the row
	}
	
	tableText+="</tbody> </table>";//close table
	document.getElementById("books_table").innerHTML = tableText;
}