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
	var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/renewBook.php";
	xmlhttps.open("POST", url, true); //Set get request with given parameter
	xmlhttps.withCredentials = true;
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttps.send("bookBarcode="+bookBarcode); 
}

window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("checkout_table").innerHTML = "You have no books checked out";	
	var xmlhttps = new XMLHttpRequest();
	xmlhttps.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//create table using info from JSON file 
			try {
				createCheckOut(JSON.parse(this.responseText));
			}catch (e) {
				console.log(this.responseText);
				console.log(e);
			}
		}
	};
	var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadCheckoutMenu.php";
	xmlhttps.open("GET", url, true); //Set get request with given parameter
	xmlhttps.withCredentials = true;
	xmlhttps.send(); 
});



	function createCheckOut(transactionJSON){ //create table from json file
	//var key= ""; //force make key an string
	//create Table with given header
	var tableText = "<table><thead><tr>";
	tableText+=`<td><input type="checkbox" id='renewAll' onclick=
	"check_all('renewBoxes[]','renewAll' )"></td>`; //check box that lets you renew 
	tableText+=`<td><input type="checkbox" id='lostAll' onclick=
	"check_all('lostBoxes[]','lostAll')"></td>`;//check box for marking things as lost
	tableText+=`<td>Title</td><td>Author</td><td>Due date</td><td>Renewed</td><td>Holds</td>`;
	tableText+=`</tr></thead>`;//end the head of the table
	tableText+="<tbody>"; //Start table body 
	var bookISBN ="";
	for (var transaction of transactionJSON){
		tableText += "<tr>"; //one row per transaction
		tableText += `<td><input type="checkbox" name='renewBoxes[]' value ='`+bookBarcode+`'></td>`;
		tableText += `<td><input type="checkbox" name='lostBoxes[]' value ='`+bookBarcode+`'></td>`;
		tableText +="<td>"+ transaction['bookName'] +"</td>";
		tableText +="<td>"+ transaction['author'] +"</td>";
		tableText +="<td>"+ transaction['dueDate'] +"</td>";
		tableText +="<td>"+ transaction['renewedTime'] +"</td>";
		tableText +="<td>"+ transaction['holds'] +"</td>";
		
		//console.log(transactionJSON[transaction]);
		bookBarcode=transaction['bookBarcode'];
		//console.log(bookISBN);
		tableText += "<tr>"; //end the row
	}
	tableText+= "</tbody> </table>";//close table
	document.getElementById("checkout_table").innerHTML = tableText;	
}

function check_all(boxName,allboxname){
	var checkedBoxes = document.getElementsByName(boxName); 
	var i; 
	if (document.getElementById(allboxname).checked) 
		for (i = 0; i < checkedBoxes.length; i++) 
			checkedBoxes[i].checked=true; 
	else 
		for (i = 0; i < checkedBoxes.length; i++) 
			checkedBoxes[i].checked=false; 
}

/*for (var key in transactionJSON[transaction]){
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
		}*/