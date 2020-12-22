import {insertMainData, insertElement, insertImg, insertElementWithPlace, animationForSlider, insertCategoriesData, 
insertOneCategoriesData, insertOneBookData, insertBasket, insertOrderData, insertActionOne, banerstep, onReady}
from "./functions.js"

import{fetchData, postOrder} from "./server.js"

let tempDB;
let order=[];

const body = document.getElementById('body');
const upMenu = document.getElementsByClassName('Header')[0];
let localStr = window.localStorage;

onReady(function() {
    document.getElementById('load').style.display='none'
    document.getElementsByClassName('container')[0].style.display='block' 
});

class screen{
    constructor(container, db, webURL){
        this.db = db;
        this.container = container;
        this.webURL = webURL;
        this.hashId = -1;
        if (webURL.length > 1) {
            this.hashId = parseInt(webURL[1])
        }
    }
    renderScreen() {
        switch(this.webURL[0]){
            case '#catalog':{
                if(this.hashId != -1){
                    if (this.hashId >= 0 && this.hashId < this.db.Categories.length){
                        insertOneCategoriesData(this.container, this.db, this.hashId);
                    }
                    else  window.location.hash = ''
                }
                else insertCategoriesData(this.container, this.db);
            break;}
            case '#oneBookPage':{
                if (this.hashId >= 0 && this.hashId < this.db.Books.length){
                    insertOneBookData(this.container, this.db, this.hashId);
                }
                else  window.location.hash = ''
            break;}
            case '#backetPage':{
                insertBasket(this.container, this.db, order);
                // reCount()
            break;}
            case '#oneDiscount':{
                if (this.hashId >= 0 && this.hashId < this.db.Discounts.length){
                  insertActionOne(this.container, this.db, this.hashId)
                }
                else  window.location.hash = ''
            break;}
            case '#addOrder':{ 
                if ((JSON.parse(localStr.getItem("orders"))).length>0){
                    insertOrderData(this.container);
                }
                else {window.location.hash = ''}
            break;}
            default: {
                window.location.hash = ''
                insertMainData(this.container, this.db);
                //reCount()
            break;}
        }
    }
}

let scRender = new screen(null, null,"");

window.onload = async function (){
    let screan = document.getElementsByClassName('container');
    
    try{
        tempDB = await fetchData()
    }
    catch (error) {
        alert('Ошибка сервера: '+ error);
    }
    if (localStr.length == 0){
        localStr.setItem("orders",  JSON.stringify( order))
    }
    else {
        let tempOrder = localStr.getItem("orders");
        order=JSON.parse(tempOrder);
    }

   
    if (screan.length > 0){ 
        screan[0].remove();
    }
    let container = insertElementWithPlace('div', 'container', upMenu, 'afterend');
    document.getElementsByClassName('container')[0].style.display='none';

    scRender = new screen(container, tempDB, window.location.hash.split("/"));

    let categoriesContent = document.getElementsByClassName("categoriesContent")[0];
    for(let i = 0; i < scRender.db.Categories.length; i++){
        let textA = insertElement('a', 'oneCategory', categoriesContent);
        textA.innerHTML = scRender.db.Categories[i].name;
        textA.id = scRender.db.Categories[i].id;
    }
   //reCount();
    scRender.renderScreen();
};

function reCount(){
    let counter = 0, price = 0;
    
    let sum = document.getElementById("priceAll");
    let prCounter = document.getElementById("PrCounter");
    let BacketArea = document.getElementsByClassName("BacketArea");

    console.log(BacketArea)
    if (BacketArea.length > 1){
        BacketArea = BacketArea[1].firstChild
    }

    if(order.length != 0){
        for (let i=0; i < order.length; i += 2){
            counter = counter + order[i+1];
            price = price + countPrice(order[i]) * order[i+1];
        }
    }
    sum.innerHTML = price.toFixed(2);
    if (BacketArea.id == 'priceAll'){
        BacketArea.innerHTML='Загальна вартість замовлення: ' + price.toFixed(2)+'грн.';
        prCounter.innerHTML = counter;
    }
};

function countPrice(id){
    for(let i=0; i < scRender.db.Books.length; i++){
        if (id == scRender.db.Books[i].id){
            return scRender.db.Books[i].price;
        }
    }
    return 0;
}

window.addEventListener('click', (event)=>{
    let curentClassName = event.target.className
    let loc = window.location.hash;

    if (curentClassName == '' && event.target.tagName == 'IMG'){
        curentClassName='IMG';
    }
    
    switch (curentClassName){
        case 'bookTitle':{ 
            window.location.hash ='#oneBookPage/'+ event.target.id;
            break;
        }
        case 'oneCategory':{ 
            window.location.hash = '#catalog/'+event.target.id; 
            break;
        }
        case 'PrCounter':{ 
            if (loc != '#basketPage' && event.target.id!=''){
                    window.location.hash = '#backetPage';
                    break;
                }
            }
        case 'BacketArea':{ 
            if (loc!='#backetPage' && event.target.id!='') {
                window.location.hash = '#backetPage';
                break;
            }
        }
        case 'priceAll':{
            if (loc!='#backetPage' && event.target.id!=''){
                window.location.hash = '#backetPage'; 
                break;
            }
        }        
        case 'action':{ 
            window.location.hash ='#oneDiscount/'+ event.target.id; 
            break;
        }
        case 'IMG':{ 
            window.location.hash ='#oneBookPage/'+ event.target.id; 
            break;
        }
       /* case 'order':{
            addToOrder(event.target);
            break;
        }
        case 'unorder':{
            deleteFromOrder(event.target);
            break;
        }*/
        case 'orderBtn':{
            if(order.length > 0){
                window.location.hash ='#createOrder';
                break;
            }
        }
        case 'PutOrder':{
            pushOrder();
            break;
        }
        default: {break;}
    }
});

window.onhashchange = function (){location.reload()}