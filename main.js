import {insertMainData, insertElement, insertElementWithPlace, insertCategoriesData, 
insertOneCategoriesData, insertOneBookData, insertBasket, insertOrderData, insertDiscountOne, onLoad}
from "./functions.js"
    
import{fetchData, postOrder} from "./server.js"
    
let tempDB;
let order=[];

    
const upMenu = document.getElementsByClassName('Header')[0];
let localStr = window.localStorage;
    
onLoad();

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
                    changeCounter();
                break;}
                case '#oneDiscount':{
                    if (this.hashId >= 0 && this.hashId < this.db.Discounts.length){
                      insertDiscountOne(this.container, this.db, this.hashId)
                    }
                    else  window.location.hash = ''
                break;}
                case '#createOrder':{ 
                    if ((JSON.parse(localStr.getItem("orders"))).length>0){
                        insertOrderData(this.container);
                        changeCounter();
                    }
                    else {window.location.hash = ''}
                break;}
                default: {
                    window.location.hash = ''
                    insertMainData(this.container, this.db);
                break;}
            }
        }
}
    
let scRender = new screen(null, null,"");


function changePage() {
    let screan = document.getElementsByClassName('container');
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
    changeCounter();
    scRender.renderScreen();
}
    
window.onload = async function (){
    try{
        tempDB = await fetchData()
    }
    catch (error) {
        alert('Ошибка сервера: '+ error);
    }
    if (localStr.getItem('orders') == null || localStr.getItem('orders') == undefined){
        localStr.setItem("orders",  JSON.stringify( order))
    }
    else {
        let tempOrder = localStr.getItem("orders");
        order=JSON.parse(tempOrder);
    }
    changePage()        
};
    
function countPrice(id, tempCount){
    for(let i=0; i < scRender.db.Books.length; i++){
        if (id == scRender.db.Books[i].id){
            return scRender.db.Books[i].price*tempCount;
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
        case 'priceAll':{
            if (loc!='#backetPage' && event.target.id!=''){
                window.location.hash = '#backetPage'; 
                break;
            }
        }     
        case 'PrCounter':{ 
            if (loc != '#basketPage' && event.target.id!=''){
                    window.location.hash = '#backetPage';
                    break;
                }
            }
        case 'BacketArea':{ 
            if (loc != '#backetPage' && event.target.id != '') {
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
        case 'orderBtn':{
            if(order.length > 0){
                window.location.hash ='#createOrder';
            }
            break;
        }
        case 'addOrder':{
            addOrder(event.target);
            break;
        }
        case 'delOrder':{
            delOrder(event.target);
            break;
        }
        case 'MakeOrder':{
            pushOrder(event.target)
        }
        default: {break;}
    }
});
    
function changeCounter(){
    let tcounter = 0, price=0;
    let sum = document.getElementById("priceAll");
    let counterProduct = document.getElementById("PrCounter");
    let onCount = document.getElementsByClassName("onCount");
    

    if(order !== null){      
        for (let i = 0; i < order.length; i+=2){
            tcounter = tcounter + order[i+1];
            price = price + countPrice(order[i], order[i+1]);
        }

        sum.innerHTML=price.toFixed(2);

        if(onCount[0] !== undefined){
            onCount[0].firstChild.innerHTML= "Всего: " + price.toFixed(2) + "UA"
        }
    }
    counterProduct.innerHTML = tcounter;

};

function addOrder(target){
    let id = target.parentElement.firstChild.id;
    for (let i = 0; i < order.length; i+=2){
        if (order[i] == id){
            order[i+1]++;
            console.log(target.parentElement.firstChild.className)
            if (target.parentElement.childNodes[1].className == 'counterOrdered'){
                target.parentElement.childNodes[1].innerHTML = order[i+1];
            }
            localStr.setItem("orders", JSON.stringify( order));
            changeCounter();
            return;
        }
    }
    order.push(parseInt(id));
    order.push(1);
    localStr.setItem("orders",  JSON.stringify( order));
    if (window.location.hash == '#backetPage'){
        insertBasket(scRender.container, scRender.db, order);
    }
    changeCounter();
}

function delOrder(target) {
    let id = target.parentElement.firstChild.id;
    for (let i = 0; i < order.length; i+=2){
        if (order[i] == id){
            if(order[i+1] == 1){
                order.splice(i, 2)
                localStr.setItem("orders", JSON.stringify( order));
                changeCounter();
                target.parentElement.parentElement.removeChild(target.parentElement)
            }
            else{
                order[i+1]--;                
                if (target.parentElement.childNodes[1].className == 'counterOrdered'){
                    target.parentElement.childNodes[1].innerHTML = order[i+1];
                }
                localStr.setItem("orders", JSON.stringify( order));
                changeCounter();
                return;
            }
        }
    }
}

function checkFeels() {
    let textArea = document.getElementsByClassName('inputArea')
    let valid=true;
    let phone=/^\+380\d{9}$/;
    let mail=/^[^@.]{1,}@[^@.]{1,}.[^@.]{1,}$/;
    let address=/^г.\W{1,}, ул.\W{1,}/
    let name=/^\W{1,}$/;
    let toPay=["наличные","Наличные","карта","Карта"];

    if(!phone.test(textArea[0].value)){
        valid = false
        textArea[0].style.outline = '3px solid rgba(216, 47, 47, 0.808)';
    }  
    else{textArea[0].style.outline = 'none'}

    if(textArea[1].value != '' && !mail.test(textArea[1].value)){
        valid = false
        textArea[1].style.outline = '3px solid rgba(216, 47, 47, 0.808)';
    }
    else{textArea[1].style.outline = 'none'}

    if(!address.test(textArea[3].value)){
        valid = false
        textArea[3].style.outline = '3px solid rgba(216, 47, 47, 0.808)';
    }
    else{textArea[3].style.outline = 'none'}

    if(!name.test(textArea[2].value)){
        valid = false
        textArea[2].style.outline = '3px solid rgba(216, 47, 47, 0.808)';
    }
    else{textArea[2].style.outline = 'none'}

    if(!toPay.includes(textArea[4].value)){
        valid = false
        textArea[4].style.outline = '3px solid rgba(216, 47, 47, 0.808)';
    }
    else{textArea[4].style.outline = 'none'}
    return valid;
}

let endOrder = {}
let help = ['phone','mail', 'address', 'name', 'toPay' ]

async function pushOrder(target) {
    if(checkFeels() == true){
        for (let i = 0; i < help.length; i++) {
            endOrder[help[i]] = document.getElementById(i+'text').value
        }
        endOrder['orderArr'] = order   
        console.log(endOrder) 
        let data = await postOrder(endOrder) 
        console.log(data)  
        localStr.setItem("orders",  JSON.stringify([]))
        order = []
        changeCounter()
        window.location.hash = ''
    }
}

window.onhashchange = function (){location.reload()}