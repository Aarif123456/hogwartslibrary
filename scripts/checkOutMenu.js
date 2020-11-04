//Abdullah Arif
//create menu for books checked out to user -allows user to renew books and to report them as lost
"use strict";
var renewBookList=[];
var renewCount=0;
var successRenewCount=0;
var failRenewCount=0;
function markLost(bookBarcode,bookName){
	//console.log(bookBarcode);//mark book as lost 
	if (confirm("Do you really want to report book "+bookName+" with barcode " + bookBarcode+ " as lost?")) 
	{
	 var xmlhttps = new XMLHttpRequest();
	 xmlhttps.open("POST","https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/library/lostBook", true); 
	 //Set get request with given parameter
	 xmlhttps.onreadystatechange = function() {
	 	if (this.readyState == 4 && this.status == 200) {
	 		//create table using info from JSON file 
	 		document.getElementById("lostStatus").innerHTML=this.responseText;
	 		userCheckedOut();
	 	}
	};
	xmlhttps.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttps.withCredentials = true;
	xmlhttps.send("bookBarcode="+bookBarcode); 
	
	} 
}
function renewBook(bookBarcode){
	console.log(bookBarcode);
	var xmlhttps = new XMLHttpRequest(); 
	xmlhttps.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(this.responseText.trim()=="Book renewed!"){
				successRenewCount++;
			}
			else{
				failRenewCount++;
				renewBookList.push("book with barcode:"+bookBarcode+" failed to renew because " +
					this.responseText+"<br>");
			}
			if(successRenewCount+failRenewCount==renewCount && renewCount!=0){
				//display response
				var renewText="";
				if (successRenewCount>0){ 
					renewText +="successfully renewed " +successRenewCount +" book";
					if(successRenewCount>1){ //if more that one book make it plural
						renewText+='s';
					}
					renewText+="!<br>";
				}
				if(failRenewCount>0){
					for(let r of renewBookList){
						renewText +=r;
					}
				}
				userCheckedOut();
				document.getElementById("renewStatus").innerHTML=renewText;
				renewBookList=[];
				renewCount=0;
				successRenewCount=0;
				failRenewCount=0;
			}
		}
	};
	xmlhttps.open("POST","https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/library/renewBooks", true);
	xmlhttps.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttps.withCredentials = true;
	xmlhttps.send("bookBarcode="+bookBarcode); 
}

function renewAll(){
	var checkedBoxes = document.getElementsByName("boxes[]");
	var i; 
	for (i = 0; i < checkedBoxes.length; i++){  
		if(checkedBoxes[i].checked){
			renewCount++; //count up all the books to renew
			renewBook(checkedBoxes[i].value);
		}
	}
}
window.addEventListener('DOMContentLoaded', (event) => {
    userCheckedOut();
});


function userCheckedOut(){
	var xmlhttps = new XMLHttpRequest();
	xmlhttps.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//create table using info from JSON file 
			try {
				if(this.responseText.trim()=="No rows"){
					document.getElementById("checkout_table").innerHTML = "You have no books checked out";
					document.getElementById("renewButton").style.display ="none";//if no books hide button
				}
				else{
					createCheckOut(JSON.parse(this.responseText));
					document.getElementById("renewButton").style.display ="inline";
				}	
			}catch (e) {
				console.log(this.responseText);
				console.log(e);
			}
		}
	};
	var url="https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/user/userCheckedOut";
	xmlhttps.open("GET", url, true); //Set get request with given parameter
	xmlhttps.withCredentials = true;
	xmlhttps.send(); 
}
function createCheckOut(transactionJSON){ //create table from json file
	//console.log(transactionJSON);
	//create Table with given header
	var tableText = "<table><thead><tr>";
	tableText+=`<td><input type="checkbox" id='allBox' onclick=
	"check_all('boxes[]','allBox' )"></td>`; //check box that lets you renew 
	/*tableText+=`<td><input type="checkbox" id='lostAll' onclick=
	"check_all('lostBoxes[]','lostAll')"></td>`;//check box for marking things as lost*/
	tableText+=`<td></td><td>Title</td><td>Author</td><td>Due date</td><td>Renewed</td><td>Holds</td>`;
	tableText+=`</tr></thead>`;//end the head of the table
	tableText+="<tbody>"; //Start table body 
	var bookBarcode;
	var bookISBN ="";
	for (let transaction of transactionJSON){
		tableText += "<tr>"; //one row per transaction
		bookBarcode=transaction['bookBarcode'];
		tableText += `<td><input type="checkbox" name='boxes[]' value ='`+bookBarcode+`'></td>`;
		//tableText += `<td><input type="checkbox" name='lostBoxes[]' value ='`+bookBarcode+`'></td>`;
		tableText +="<td>" + `<input type='image' onclick='markLost("`+bookBarcode+ `","`
		+transaction['bookName']+`");' 
		src="https://abdullaharif.tech/hogwartslibrary/resources/images/flag.png"
		class="img-responsive" alt="flag lost"></td>`;
		tableText +="<td>"+ transaction['bookName'] +"</td>";
		tableText +="<td>"+ transaction['author'] +"</td>";
		tableText +="<td>"+ transaction['dueDate'] +"</td>";
		tableText +="<td>"+ transaction['renewedTime'] +"</td>";
		tableText +="<td>"+ transaction['holds'] +"</td>";
		
		//console.log(transactionJSON[transaction]);
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