//Abdullah Arif
//handles books being returned
"use strict";
//potentially autofill for books
//function suggestBarcode(barcode){}

function returnBook() {
    var bookBarcode =document.getElementById("bookBarcode").value.trim();
    var par ="bookBarcode="+bookBarcode;

    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/returnBook";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log( this.responseText); //**change div with id "hint"
        document.getElementById("hint").innerHTML = this.responseText;
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    
    xmlhttp.send(par); 
    //clear fields
    document.getElementById("return").reset();
}
