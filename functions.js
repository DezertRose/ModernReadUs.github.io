function insertElementWithPlace(type, className, parent, place){
    let newEl = document.createElement(type);
    newEl.className = className;
    parent.insertAdjacentElement(place, newEl);
    return newEl;
};

function insertImg(type, className, src, parent){
    let newEl = document.createElement(type);
    newEl.className = className;
    newEl.src = src;
    parent.appendChild(newEl);
    return newEl;
};

function insertElementWithType(type, className, typeSt, parent){
    let newEl = document.createElement(type);
    newEl.className = className;
    newEl.type = typeSt;
    parent.appendChild(newEl);
    return newEl;
};

function insertElement(type, className, parent){
    let newEl = document.createElement(type);
    newEl.className = className;
    parent.appendChild(newEl);
    return newEl;
};

function insertMainData(container, db) {
   /* Акции*/
    let slides = insertElement('div', 'slideDisc', container);
    let all = insertElement('div', 'sliders', slides);
    for (let i=0; i<db.Discounts.length; i++){
        let oneSlide = insertElement('div', 'oneSlide', all);
        insertImg('img', 'slidePicture', db.Discounts[i].image, oneSlide);
        let slideBtn = insertElementWithType('input', 'action', 'button', oneSlide)
        slideBtn.value = 'Узнать больше';
        slideBtn.id=db.Discounts[i].id;
    }

    /*Заполнение главной области*/
    let top = insertElement('div', 'top', container);
    for (let l=0; l<db.Books.length; l++){
        if (db.Books[l].isTop == true){
            let oneBook = insertElement('div', 'oneBook', top);
            insertImg('img','', db.Books[l].images[0], oneBook).id=db.Books[l].id;
            let textDiv=insertElement('div', '', oneBook);
            let bookTitle = insertElement('p', 'bookTitle', textDiv)
            bookTitle.innerHTML=db.Books[l].bookTitle;
            bookTitle.id = db.Books[l].id;
            insertElement('p', 'productComponents', textDiv).innerHTML=db.Books[l].productComponents;
            insertElement('p', 'price', textDiv).innerHTML=db.Books[l].price+' UA';
            let acBtn = insertElementWithType('input', 'addOrder', 'button', oneBook)
            acBtn.value = 'Добавить в корзину';
        }
    }
}

function insertCategoriesData(container, db){
    let category = insertElement('div', 'category', container);

    for (let i = 0; i < db.Categories.length; i++){
        let categoryTitle = insertElement('h3', 'categoryTitle', category);
        categoryTitle.innerHTML=db.Categories[i].name;

        let productList = insertElement('div', 'productList', category);
        for (let j = 0; j < db.Books.length; j++){

            if (db.Books[j].categoryId == db.Categories[i].id){
                let oneBook = insertElement('div', 'oneBook', productList);
                insertImg('img', '', db.Books[j].images[0], oneBook).id=db.Books[j].id;
                let textDiv = insertElement('div', '', oneBook);
                let bookTitle = insertElement('p', 'bookTitle', textDiv)
                bookTitle.innerHTML = db.Books[j].bookTitle;
                bookTitle.id = db.Books[j].id;
                insertElement('p', 'productComponents', textDiv).innerHTML=db.Books[j].productComponents;
                insertElement('p', 'price', textDiv).innerHTML=db.Books[j].price+' UA';
                let acBtn = insertElementWithType('input', 'addOrder', 'button', oneBook)
                acBtn.value = 'В корзину';
            }
        }
        if (productList.childNodes.length == 0){
            categoryTitle.remove();
            productList.remove();
        }
    }
}

function insertOneCategoriesData(container, db, hashId){
    let category = insertElement('div', 'category', container);
    let categoryTitle = insertElement('h3', 'categoryTitle', category);
    categoryTitle.innerHTML=db.Categories[hashId].name;

    let productList = insertElement('div', 'productList', category);
    for (let j = 0; j < db.Books.length; j++){
        if (db.Books[j].categoryId == db.Categories[hashId].id){
            let oneBook = insertElement('div', 'oneBook', productList);
            insertImg('img','', db.Books[j].images[0],oneBook).id = db.Books[j].id;

            let textDiv = insertElement('div', '', oneBook);
            let bookTitle = insertElement('p', 'bookTitle', textDiv)
            bookTitle.innerHTML=db.Books[j].bookTitle;
            bookTitle.id = db.Books[j].id;
            insertElement('p', 'productComponents', textDiv).innerHTML = db.Books[j].productComponents;
            insertElement('p', 'price', textDiv).innerHTML = db.Books[j].price+' UA';
            let acBtn = insertElementWithType('input', 'addOrder', 'button', oneBook)
            acBtn.value = 'До корзини';
        }
    }
    if (productList.childNodes.length == 0){
        categoryTitle.remove();
        productList.remove();
    }
}

function insertOneBookData(container, db, hashId){
    let bookDeteils = insertElement('div', 'bookDeteils', container);
    let booksImg = insertElement('div', 'booksImg', bookDeteils);
    insertImg('img', 'booksImg', db.Books[hashId].images[0], booksImg).id = db.Books[hashId].id;
    
    let title = insertElement('p', 'bookTitle', bookDeteils)
    title.innerHTML = db.Books[hashId].bookTitle;
    title.style.color ='rgb(255, 255, 255)'

    let onePrice = insertElement('p', 'price', bookDeteils);
    onePrice.innerHTML='стоимость: '+db.Books[hashId].price+' UA';
    onePrice.style.fontSize='2.5vmax';

    let acBtn = insertElementWithType('input', 'addOrder', 'button', booksImg)
    acBtn.value = 'В корзину';
    acBtn.style.top='30vh';
    acBtn.style.left='33vw';
    acBtn.style.backgroundColor='rgba(50, 18, 109, 0.767)';

    let bookDet = insertElement('p', 'oneProductDescription', bookDeteils)
    bookDet.innerHTML=db.Books[hashId].productComponents;
    bookDet.style.color = 'rgb(255, 255, 255)'
    
    let productDesk = insertElement('p', 'oneProductPromo', bookDeteils)
    productDesk.innerHTML = db.Books[hashId].productDesk
    productDesk.style.color = 'rgb(255, 255, 255)'

}

function insertOrderData(container){
    let option = ["моб. телефон *", "Gmail", "ФИО*", "Адрес *", "Способ оплаты*"];
    let area = insertElement('div', 'area', container);
    for (let i = 0; i < option.length; i++){
        let feelName = insertElement('p', 'feelName', area)
        feelName.innerHTML = option[i];
        feelName.id = i+'name';
        insertElement('textarea', 'inputArea', area).id = i+'text';
    }

    let onCount = insertElement('div', 'onCount', container);
    let priceAll = insertElement('p', 'priceAll', onCount);
    let price = document.getElementById("priceAll").innerHTML;
    priceAll.innerHTML='Всего: '+ price +'UA';

    let PutOrder = insertElementWithType('input', 'MakeOrder', 'button', container)
    PutOrder.value = "Оформить";
}

function insertBasket(container, db, order){
    insertElement('div', 'orderBtn', container).innerHTML = 'Заказать';
    let toBuy = insertElement('div', 'toBuy', container);
    insertElement('h3', 'chosen', toBuy).innerHTML='Выбраные';

    let onCount = insertElement('div', 'onCount', toBuy);
    let priceAll=insertElement('p', '', onCount);
    priceAll.id='priceAll';
    priceAll.innerHTML='Всего: '+ 0 +' UA';

    let productList = insertElement('div', 'productList', toBuy);

    for (let i = 0; i < order.length; i = i+ 2){

        let myBook = db.Books[order[i]];
        let oneBook = insertElement('div', 'oneBook', productList);

        insertImg('img','', myBook.images[0], oneBook).id = myBook.id;
        insertElement('p', 'counterOrdered', oneBook).innerHTML = order[i+1];
        let textDiv = insertElement('div', '', oneBook);
        
        let bookTitle = insertElement('p', 'bookTitle', textDiv)
        bookTitle.innerHTML = myBook.bookTitle;
        bookTitle.id = myBook.id;

        insertElement('p', 'productComponents', textDiv).innerHTML = myBook.productComponents;
        insertElement('p', 'price', textDiv).innerHTML = myBook.price+' UA';

        let acBtn = insertElementWithType('input', 'addOrder', 'button', oneBook)
        acBtn.value = '+1'; 
        let delBtn = insertElementWithType('input', 'delOrder', 'button', oneBook)
        delBtn.value = '-1'; 
    }
}

function insertDiscountOne(container, db, hashId){
    let aboutAct = insertElement('div', 'aboutAct', container);
    insertElement('p', 'oneActionName', aboutAct).innerHTML = db.Discounts[hashId].name;
    insertElement('p', 'actionTime', aboutAct).innerHTML = 'До: '+db.Discounts[hashId].actionTime;
    insertImg('img', 'oneACtionImg', db.Discounts[hashId].image,aboutAct);
    insertElement('p', 'oneActionDescription', aboutAct).innerHTML=db.Discounts[hashId].about;
}

function onLoad() {
   let temp =  window.setInterval(       
    function name() {
        if(document.getElementsByClassName('container')[0]!== undefined){
            document.documentElementById('load').style = 'display: none;'
            window.clearInterval(temp)
        }

    }, 600)    
};



export{insertMainData, insertElement, insertImg, insertElementWithType, insertElementWithPlace,
insertCategoriesData, insertOneCategoriesData, insertOneBookData, insertBasket, insertOrderData, 
insertDiscountOne, Begin, onLoad};