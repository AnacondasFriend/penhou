let productsContainer = document.querySelector(".productsContainer");
let body = document.querySelector('body')
let slider = document.querySelector('.slider')
const productsList = new Map();

const xhr = new XMLHttpRequest();
const parser = new DOMParser();




class Product{
  constructor(name, description, price, dimensions, instock, imgs, idNum){
    this.name = name;
    this.description = description;
    this.price = price;
    this.dimensions = dimensions;
    this.instock = instock;
    this.imgs = imgs;
    this.idNum = idNum;
  }
  firstImageForContainer(){
    return this.imgs[0];
  }
  getId(){
    return this.idNum;
  }
  createDivInContainer(){
    let imgsElem = ``;
    for(let image of this.imgs){
      imgsElem += `<div class='productViews'><img src=${image}></img></div> `;
    }
      let elem = `<div class='fullProduct'>
      <div class='deleteInfo'><img src="svgIcons/x-icon.svg" width='30px' height='30px'></img></div>
      <div class='informationAboutProduct'>
        <div class='productImages'><div class='mainImage'><img src=${this.imgs[0]}></img></div>${imgsElem} </div>
        <div class='allDescription'>
          <h1 class=productName>${this.name}</h1>
          <p>Описание товара: ${this.description}</p>
          <p>Размеры: ${this.dimensions}</p>
          <p>В наличии: ${this.instock}</p>
        </div>
        </div>
      </div>`
      productsContainer.insertAdjacentHTML("beforeend", elem);
      let deleteButton = document.querySelector('.deleteInfo');
      let fullProduct = document.querySelector('.fullProduct');
      deleteButton.addEventListener('click', ()=>{productsContainer.removeChild(fullProduct)});
      let productImages = document.querySelector('.productImages')
      let bigImage = document.querySelector('.mainImage');
      let littleImages= document.querySelectorAll('.productViews');
      for(let i=0; i<littleImages.length; i++){
        let image=littleImages[i];
        //console.log(image);        
        let imageHref= image.firstChild.getAttribute('src');

        image.addEventListener('click', ()=>{
          productImages.removeChild(bigImage);
          productImages.insertAdjacentHTML('afterbegin', `<div class='mainImage'><img src=${imageHref}></img></div>`)
          bigImage = document.querySelector('.mainImage');
        })
      }
      }

  }


let idNum = 0;
function uploadProductsFromXML(category){
  category = category.children;
  for(i=0; i<category.length; i++){
    let theCat = category[i];
    let products = category[i].getElementsByTagName('product');
    let productsThisCategory = [];
    for(j=0; j<products.length; j++){
      let name = products[j].querySelector('name').textContent;
      let description = products[j].querySelector('description').textContent; 
      let price = products[j].querySelector('price').textContent;
      let dimensions = products[j].querySelector('dimensions').textContent;
      let instock = products[j].querySelector('instock').textContent;
      let images = products[j].querySelector('imgs').children;
      let imgsHref = [];
      for(k=0; k<images.length; k++){
        let img = images[k].textContent;
        imgsHref.push(img);
      };
      idNum++;
      let productClass = new Product(name,description,price,dimensions,instock,imgsHref, idNum);
      productsThisCategory.push(productClass); //добавляем массив с массивами в этой категории
    }
    productsList.set(theCat, productsThisCategory); //добавляем в именнованный масив категория=продукты этой категории
  }
}


function uploadImagesForCategory(){
  for(let cat of productsList.keys()){
    productsContainer.insertAdjacentHTML('beforeend', `<div class = 'category'><h1>${cat.getAttribute('alt')}</h1></div>`);
    let theCat = productsContainer.lastChild; //сюда вставляем
    for(let product of productsList.get(cat)){
      let elemHref = product.firstImageForContainer();
      img =  `<div class = 'fatherImg' id=${product.getId()}><img src= ${elemHref}></img></div>`;
      theCat.insertAdjacentHTML('beforeend', img)
      let theId = document.getElementById(`${product.getId()}`);
      theId.addEventListener("click", ()=>{
        product.createDivInContainer()
      });
    
    }
  }
}



xhr.open("get", "productsv2.xml");
xhr.send();
xhr.onreadystatechange = () => {

  if (xhr.status != 200) {
    // обработать ошибку
    alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    
  } else {
    //вывести результат
    //alert(xhr.responseText ); 
    if (xhr.readyState===4) {
      const xmlDOM = parser.parseFromString(xhr.response, 'text/xml');
    const categories = xmlDOM.childNodes[0];
    uploadProductsFromXML(categories);
    uploadImagesForCategory()
}
  };

}




