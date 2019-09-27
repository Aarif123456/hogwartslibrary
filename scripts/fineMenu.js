//Abdullah Arif
//Handles displaying user fines on their accounts
fineTable={}; //holds arrays for the types of tables:all,relevant, recent and lost books
totalFine=-1;
//Tells use how much they owe right now
function displayTotalFine(finesJSON){
  var displayText="";
  try{
    totalFine=parseInt(finesJSON.fines);
    var blacklisted=(parseInt(finesJSON.blacklisted)===1)?true:false; //get blacklist status of user
  }catch(e){
    console.log(e);
    totalFine=-5;
  }
  if(totalFine>0){
    displayText+="You currently have a balance of$"+totalFine+" on your account.<br> You can pay your fine through a librarian during our available hours<br>"
  }
  if(blacklisted){
    displayText+= "You are considered a blacklisted user which means that some of your privileges have been revoked until you pay your fines.<br>";
    displayText+= "A student is blacklisted if they carry a balance of $10 or more.<br>";
    displayText+= "A teacher is blacklisted if they carry a balance of $50 or more.<br>";
  }
  
  document.getElementById("totalFine").innerHTML= displayText;
  //if they are blacklisted
}
//organize the incoming JSON into rows to insert into to our table 
function createFineTable(finesJSON){
  createAllFines(finesJSON);
  createLostBooks(finesJSON);
  createRelevantFines(finesJSON);
}

function renderFineTable(update){
  var mode=document.getElementById("mode").value;
  var numRows=document.getElementById("numRows").value;
  var tableText ="";
  if(!(update)){ //if we have new table reset page to 0
    setPage(0,0);
  }
  var pageNum=document.getElementById("pageNum").value;
  //this is common in all array so no point of putting it in the dictionary
  var s=fineTable[mode].slice(pageNum*numRows,(pageNum+1)*numRows);
  if(s.join().includes("<tr>")){ //if the dictionary contains a table then create a table
    tableText = "<table><thead><tr>"; 
    tableText += fineTable[mode+'Header']; //get the header for the correct mode
    tableText+=s.join();//make the sub array into one string
    //close table -> cannot be in dictionary because we don't know where the end is when creating it
    tableText+= "</tbody> </table>";
  }
  else{//other display the user Text fully
    tableText=fineTable[mode]; 
  }
  document.getElementById("fine_table").innerHTML=tableText;

}
//change page number mode:1 -increase, -1 decrease, 0 set to given page number
function setPage(mode,page){
  //check to see if you have rows on next page otherwise hide next button
}

//show fines that the user has to pay currently
function createRelevantFines(finesJSON){
  if(totalFine===-5){ //waiting for ajax to call to change total fine value
    setTimeout(createRelevantFines, 50);//wait 50 millisecnds then recheck
    return; 
  }
  if(totalFine>0){
    var transactionFine=0.00;
    var tableText=`<td>Transaction Id</td><td>Title</td><td>Author</td>
    <td>Return/lost date</td><td>Fine</td>`;
    tableText+=`</tr></thead>`;//end the head of the table
    tableText+="<tbody>"; //Start table body 
    fineTable['relevantHeader']=tableText;
    fineTable['relevant']=[];
    tableText="";
    for (var fine of finesJSON){
      try{ //fines are in descending order, so newest comes first
         transactionFine+=parseFloat(fine['fine']); //get fine from transaction
      }catch(e){
        console.log(e);
      }
      tableText += "<tr>";
      tableText +="<td>"+ fine['transactionID'] +"</td>";
      tableText +="<td>"+ fine['bookName'] +"</td>";
      tableText +="<td>"+ fine['author'] +"</td>";
      if(fine['lostDate']==null){ //if it wasn't lost just give return date
        if(fine['returnDate']==null){
          tableText +="<td>"+ 'book still checked out!' +"</td>";
        }
        else{
          tableText +="<td>"+ fine['returnDate'] +"</td>";
        }
      }
      else{ //make lost books shine 
         tableText +="<td class='lostChild'>"+ fine['lostDate'] +"</td>";
      }
      tableText +="<td>"+ fine['fine'] +"</td>";
      tableText += "</tr>";
      fineTable['relevant'].push(tableText);
      tableText="";
      if(transactionFine>=totalFine){ 
        /*if the cumulative fine from all transaction is greater than the fine 
        the user has to pay than the following fines are not relevant */
        break;
      }
    }
  }
  else{
    tableText="Congratulations! You don't have any relevant fines";
    fineTable['relevant'].push(tableText);
  }
}

//create all fines the user has
function createAllFines(finesJSON){
  //Create head rows on the table
  var tableText=`<td>Transaction Id</td><td>Title</td><td>Author</td>
  <td>Return/lost date</td><td>Fine</td>`;
  tableText+=`</tr></thead>`;//end the head of the table
  tableText+="<tbody>"; //Start table body 
  fineTable['allHeader']=tableText;
  fineTable['all']=[];
  tableText="";
  for (var fine of finesJSON){
    tableText += "<tr>";
    tableText +="<td>"+ fine['transactionID'] +"</td>";
    tableText +="<td>"+ fine['bookName'] +"</td>";
    tableText +="<td>"+ fine['author'] +"</td>";
    if(fine['lostDate']==null){ //if it wasn't lost just give return date
      if(fine['returnDate']==null){
        tableText +="<td>"+ 'book still checked out!' +"</td>";
      }
      else{
        tableText +="<td>"+ fine['returnDate'] +"</td>";
      }
    }
    else{ //make lost books shine 
       tableText +="<td class='lostChild'>"+ fine['lostDate'] +"</td>";
    }
    tableText +="<td>"+ fine['fine'] +"</td>";
    tableText += "</tr>";
    fineTable['all'].push(tableText);
    tableText="";
  }
}
/*
//create recent fines the user has
function createRecentFines(finesJSON){
  fineTable['recent']=""
}*/

//create all the books the users has lost
function createLostBooks(finesJSON){
  //Create head rows on the table
  var tableText=`<td>Title</td><td>Author</td><td>Book barcode</td>
  <td>lost date</td><td>Price></td><td>Fine</td>`;
  tableText+=`</tr></thead>`;//end the head of the table
  tableText+="<tbody>"; //Start table body 
  fineTable['lostHeader']=tableText;
  fineTable['lost']=[];
  tableText="";
  for (var fine of finesJSON){
    if(fine['lostDate']==null){ //if not lost then it is not relevant
      continue;
    }
    tableText += "<tr>";
    tableText +="<td>"+ fine['bookName'] +"</td>";
    tableText +="<td>"+ fine['author'] +"</td>";
    tableText +="<td>"+ fine['bookBarcode'] +"</td>";
    tableText +="<td class='lostChild'>"+ fine['lostDate'] +"</td>";
    tableText +="<td>"+ fine['price'] +"</td>";
    tableText +="<td>"+ fine['fine'] +"</td>";
    tableText += "</tr>";
    fineTable['lost'].push(tableText);
    tableText="";
  }
  if(fineTable['lost'].length==0){
    tableText="Congratulations! You don't have not lost any books";
    fineTable['lost'].push(tableText);
  }
}

//Dynamically load up the fine information once 
window.addEventListener('DOMContentLoaded', (event) => {
    loadFineMenu("loadTransactionList");
    loadFineMenu("loadTotalFine");
});

function loadFineMenu(listType){
  var xmlhttps = new XMLHttpRequest();
  xmlhttps.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //create table using info from JSON file 
      try {
        if(this.responseText.trim()=="No rows"){
          document.getElementById("fine_table").innerHTML = "Congratulations you have no fines at the moment!";
        }
        else{
          if(listType.trim()=="loadTransactionList"){
            createFineTable(JSON.parse(this.responseText));
          }
          else if(listType.trim()=="loadTotalFine"){
            displayTotalFine(JSON.parse(this.responseText));
          }
          
        } 
      }catch (e) {
        console.log(this.responseText);
        console.log(e);
      }
    }
  };
  var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadFineMenu.php?listType="+listType;
  xmlhttps.open("GET", url, true); //Set get request with given parameter
  xmlhttps.withCredentials = true;
  xmlhttps.send(); 
}
