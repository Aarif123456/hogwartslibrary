//Abdullah Arif
//create dynamic html pages
'use strict';
window.onload = function () {
    //create common elements
    loadNavbarHeader(); //get variable values
    loadNavbarMenu();
    loadCommonFooter();
};

function loadCommonFooter() {
    //load common footer -this makes it easier to make changes
    var d = new Date();
    var footerText = `<div class="footer">
        <div class="container">
            <div class="footer-top">
                <div class="subsc">
                </div>
                <div class="footer-bottom">
                    <div class="footer-nav">
                        <ul>
                            <li><a href="https://abdullaharif.tech/hogwartslibrary/">home </a></li>
                            <li><a href="https://abdullaharif.tech/hogwartslibrary/docs/home/contact">contact </a></li>
                            <li><a href="about.html">about</a></li>
                            <div class="clearfix"> </div>
                        </ul>
                    </div>
                    <p>Copyrights ©2019-`;

    footerText += d.getFullYear();
    footerText += ` 4useri All rights reserved | Template by <a href="https://w3layouts.com/">W3layouts</a></p>
                </div>
            </div>
        </div>`;
    document.getElementById('commonFooter').innerHTML = footerText;
}

function loadNavbarHeader() {
    //dynamically create navbar using page number
    var xmlhttp = new XMLHttpRequest();
    var pageCategory = document.getElementById('pageCategory').value.trim();
    var pageNum = document.getElementById('pageNum').value.trim();
    var url =
        'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/loadNavbarHeader';
    var headpart = document.getElementsByClassName('head-part');
    var screenwidth = screen.width; //use this to send to php file
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function () {
        //call function to load the home or custom
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.trim() != 'not logged in!') {
                //load customized header
                //console.log(this.responseText);
                headpart[0].innerHTML = this.responseText;
                /*if(pageCategory=="signIn"){
                window.location = "https://https://abdullaharif.tech/hogwartslibrary/docs/catalogue/userDashboard";
            }*/
            } else {
                //if we arn't logged in and are not on home category pages then go to sign in page
                if (
                    pageCategory == 'home' ||
                    pageCategory == 'signIn' ||
                    (pageCategory == 'catalogue' && pageNum == '0')
                ) {
                    headpart[0].innerHTML = `<ul>
                            <li><a href="https://abdullaharif.tech/hogwartslibrary/docs/home/register">Signup</a></li> 
                            <li><a href="https://abdullaharif.tech/hogwartslibrary/docs/catalogue/signin">Login</a></li>
                                <div class="clearfix"> </div>
                        </ul> `;
                    //console.log(pageCategory +pageNum);
                } else {
                    window.location =
                        'https://abdullaharif.tech/hogwartslibrary/docs/catalogue/signin';
                }
            }
        }
    };
    xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    );
    xmlhttp.withCredentials = true;
    xmlhttp.send('screenwidth=' + screenwidth);
}

function createHomeNavbar() {
    //load navbar at home pages
    var pageNum = document.getElementById('pageNum').value;
    var pageTitle = [
        'Browse catalogue',
        'House Fines',
        'Reading List',
        'About Us',
        'Contact Us'
    ];
    var pageList = [0, 0, 3, 0, 0]; //holds the number of page items
    var pageLinks = ['search', 'houseFine', 'readingList', 'about', 'contact']; //link to the given page
    var pageListTitle = [
        [],
        [],
        ['By book category', 'By student majors', 'All Time'],
        [],
        [],
        []
    ]; //sub page title
    var pageListLinks = [
        [],
        [],
        ['bookCategory', 'studentMajor', 'allTime'],
        [],
        [],
        []
    ];

    //default menu on home pages
    var defaultHomeMenu = '';
    for (var i = 0; i < pageTitle.length; i++) {
        defaultHomeMenu += '<li class="'; //each page is part of the list
        defaultHomeMenu += i == 0 ? 'browse ' : ''; //browse catalogue is special
        if (pageNum == i) {
            defaultHomeMenu += 'active '; //if on the page make it shine
        }
        // add the link to the page
        defaultHomeMenu +=
            'nav-item"><a href="https://abdullaharif.tech/hogwartslibrary/docs/';
        defaultHomeMenu += i == 0 ? 'catalogue/' : 'home/'; //catalogue links to the catalogue pages
        defaultHomeMenu += pageLinks[i] + '" class="';
        //if page has sub menu make it root
        defaultHomeMenu +=
            pageList[i] > 0
                ? 'root">' + pageTitle[i] + ' </a> <ul class="drdw">'
                : 'nav-link">';
        for (var j = 0; j < pageList[i]; j++) {
            defaultHomeMenu +=
                '<li class=""><a href="https://abdullaharif.tech/hogwartslibrary/docs/home/charts/';
            defaultHomeMenu += pageListLinks[i][j];
            defaultHomeMenu += '">' + pageListTitle[i][j] + '</a></li>';
        }
        defaultHomeMenu +=
            pageList[i] > 0 ? '</ul></li>' : pageTitle[i] + '</a></li>';
        defaultHomeMenu += ''; //end option
    }
    //finish default user Menu
    defaultHomeMenu += `</ul>`;
    return defaultHomeMenu;
}

function createNavbar(pageJSON) {
    var pageNum = document.getElementById('pageNum').value;
    var pageCategory = document.getElementById('pageCategory').value.trim();
    var key = ['0', '1', '2', '3', '4', '5'];
    var defaultHomeMenu = '';
    for (var i = 0; i < 6; i++) {
        defaultHomeMenu += '<li class="'; //each page is part of the list
        //Make browse catalogue shine read
        defaultHomeMenu +=
            pageJSON.pageTitle[key[i]] == 'Browse collection' ? 'browse ' : '';
        if (pageNum == i) {
            defaultHomeMenu += 'active '; //if on the page make it shine
        }
        // add the link to the page
        defaultHomeMenu +=
            'nav-item"><a href="https://abdullaharif.tech/hogwartslibrary/docs/';
        defaultHomeMenu += pageJSON.pageLinks[key[i]] + '" class="';
        //if page has sub menu make it root
        defaultHomeMenu += 'nav-link">';
        defaultHomeMenu += pageJSON.pageTitle[key[i]] + '</a></li>';
        defaultHomeMenu += ''; //end option
    }
    //finish default user Menu
    defaultHomeMenu += `</ul>`;
    return defaultHomeMenu;
}

function loadNavbarMenu() {
    var menu = document.getElementsByClassName('nav');
    var pageCategory = document.getElementById('pageCategory').value.trim();
    var pageNum = document.getElementById('pageNum').value;
    if (pageCategory == 'home') {
        menu[0].innerHTML = createHomeNavbar();
    } else {
        //if in catalogue use custom options
        var xmlhttp = new XMLHttpRequest();
        var url =
            'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/loadNavbarMenu';
        xmlhttp.open('POST', url, true);
        xmlhttp.onreadystatechange = function () {
            //call function to load the home or custom
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText.trim() != 'not logged in!') {
                    menu[0].innerHTML = createNavbar(
                        JSON.parse(this.responseText)
                    );
                } else {
                    if (
                        pageCategory == 'home' ||
                        pageCategory == 'signIn' ||
                        (pageCategory == 'catalogue' && pageNum == '0')
                    ) {
                        menu[0].innerHTML = createHomeNavbar();
                        console.log('menu part ' + pageCategory + pageNum);
                    } else {
                        window.location =
                            'https://abdullaharif.tech/hogwartslibrary/docs/catalogue/signin';
                    }
                }
            }
        };
        xmlhttp.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
        );
        xmlhttp.withCredentials = true;
        xmlhttp.send();
    }
}
