//Abdullah Arif
//create menu to check out books

function markLost(bookBarcode){
	//console.log(bookBarcode);//mark book as lost 
	var xmlhttps = new XMLHttpRequest();
	xmlhttps.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//create table using info from JSON file 
			try {
				createCheckOut(JSON.parse(this.responseText));
			}catch (e) {
				console.log(this.responseText);
			}
		}
	};
	var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/lostBook.php";
	xmlhttps.open("POST", url, true); //Set get request with given parameter
	xmlhttps.withCredentials = true;
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttps.send("bookBarcode="+bookBarcode); 
}
function renewBook(bookBarcode){
	var xmlhttps = new XMLHttpRequest();
	xmlhttps.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//create table using info from JSON file 
			try {
				createCheckOut(JSON.parse(this.responseText));
			}catch (e) {
				console.log(this.responseText);
			}
		}
	};
	var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/lostBook.php";
	xmlhttps.open("POST", url, true); //Set get request with given parameter
	xmlhttps.withCredentials = true;
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttps.send("bookBarcode="+bookBarcode); 
}

window.onload =  function (){
	document.getElementById("checkout_table").innerHTML = "You have no books checked out";	
	var xmlhttps = new XMLHttpRequest();
	xmlhttps.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//create table using info from JSON file 
			try {
				createCheckOut(JSON.parse(this.responseText));
			}catch (e) {
				console.log(this.responseText);
			}
		}
	};
	var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadCheckoutMenu.php";
	xmlhttps.open("GET", url, true); //Set get request with given parameter
	xmlhttps.withCredentials = true;
	xmlhttps.send(); 
};



	function createCheckOut(transactionJSON){ //create table from json file
	//var key= ""; //force make key an string
	//create Table with given header
	var tableText = "<table><thead><tr><td>Title</td><td>Holds</td><td>bookBarcode</td><td>Duedate</td><td>Renewed</td><td>Lost button</td><td>Renew button</td></tr></thead>";
	tableText+="<tbody>"; //Start table body 
	var bookISBN ="";
	for (var transaction in transactionJSON){
		tableText += "<tr>"; //one row per transaction
		//console.log(transactionJSON[transaction]);
		for (var key in transactionJSON[transaction]){
			if(key==="bookInfo"){
				tableText += "<td>"+ transactionJSON[transaction][key]['bookName']+"</td>";
				//tableText += "<td>"+ transactionJSON[transaction][key]['author']+"</td>";
				tableText += "<td>"+ transactionJSON[transaction][key]['holds']+"</td>";
			}
			if(key==="bookItemInfo"){
				bookISBN = transactionJSON[transaction][key]['bookISBN'];
			}
			if(key==="transactionInfo"){
				for (var item in transactionJSON[transaction][key]){
					tableText += "<td>"+transactionJSON[transaction][key][item]+"</td>";
				}
				bookBarcode = transactionJSON[transaction][key]['bookBarcode'];
			}
		}
		//console.log(bookISBN);
		tableText +="<td>" + "<button type='submit' onclick='markLost(\""+bookBarcode+"\");'>Lost</button>" +"</td>";
		tableText +="<td>" + "<button type='submit' onclick='renewBook(\""+bookBarcode+"\");'>Renew</button>" +"</td>";
		tableText += "<tr>"; //end the row
	}
	tableText+= "</tbody> </table>";//close table
	document.getElementById("checkout_table").innerHTML = tableText;	
}