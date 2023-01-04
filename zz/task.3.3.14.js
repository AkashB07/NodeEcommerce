


const cart_items = document.querySelector('#cart .cart-items');
const totalPrice = document.getElementById('total-value');




const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click',(e)=>{

    if (e.target.className=='shop-item-button'){
        const id = e.target.parentNode.parentNode.id
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
        let total_cart_price = document.querySelector('#total-value').innerText;
        if (document.querySelector(`#in-cart-${id}`)){
            alert('This item is already added to the cart');
            return
        }
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${id}`);
        total_cart_price = parseFloat(total_cart_price) + parseFloat(price)
        total_cart_price = total_cart_price.toFixed(2)
        document.querySelector('#total-value').innerText = `${total_cart_price}`;
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${img_src}" alt="">
            <span>${name}</span>
    </span>
    <span class='cart-price cart-column'>${price}</span>
    <span class='cart-quantity cart-column'>
        <input type="text" value="1">
        <button>REMOVE</button>
    </span>`
        cart_items.appendChild(cart_item)

        const container = document.getElementById('container');
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
        container.appendChild(notification);
        setTimeout(()=>{
            notification.remove();
        },2500)
    }
    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        const cartContainer = document.getElementById('cart');
        cartContainer.innerHTML ='';
        getCartDetails();
    }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }
    if (e.target.className=='purchase-btn'){
        if (parseInt(document.querySelector('.cart-number').innerText) === 0){
            alert('You have Nothing in Cart , Add some products to purchase !');
            return
        }
        alert('Thanks for the purchase')
        cart_items.innerHTML = ""
        document.querySelector('.cart-number').innerText = 0
        document.querySelector('#total-value').innerText = `0`;
    }

    if (e.target.innerText=='REMOVE'){
        let total_cart_price = document.querySelector('#total-value').innerText;
        total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1
        document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
        e.target.parentNode.parentNode.remove()
    }
})

const pagination = document.getElementById("container");
const products = document.getElementById("merch");
// const cartItems = document.getAnimations("cart")

window.addEventListener("DOMContentLoaded", () => {
    const objUrlParams = new URLSearchParams(window.location.search);
    const page  = objUrlParams.get("page") || 1;
    axios.get(`http://localhost:3000/products?page=${page}`)
    .then(({data: {products, ...pageData}}) => {
        listProducts(products)
        showPagination(pageData);
       })
       .catch((err) => console.log(err));
        
       axios.get('http://localhost:3000/cart')
       .then((res) => {
        res.data.products.forEach((p) => {
            addProductToCart(p)
        }
        )})
       .catch((err) => console.log(err));
    });

function listProducts(productsData)
{
    // console.log(productsData)
    products.innerHTML ='';
    productsData.forEach((product) => {
        console.log(product)
        const prod = document.createElement("div");
        prod.className = "product";
        prod.id =`product${product.id}`;
        prod.innerHTML = `
        
           <img src=${product.imageUrl}/>
       
        <div class="product-info">
           <div  class="product-top-row">
              <h3 class="product-name">${product.title}</h3>
             </div>
            <div class="product-bottom-row">
                 <p class="product-price">$${product.price}</p>
                 <button class ="add-to-cart" onClick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>`;

        products.appendChild(prod);
    });
}

function addProductToCart({
    id,
    title,
    imageUrl,
    price,
    cartItem: {quantity},
})
{
    console.log(id,
        title,
        imageUrl,
        price,
        quantity)
    const itemId =`cartitem-${id}`;
    const item = document.getElementById(itemId);

    if(item){
        item.querySelector(".cartitem-qty").value = quantity;
    }
    else{
        const newItem = document.getElementById("cart");
        console.log(newItem)
        newItem.className = "cartitem";
        newItem.id = itemId;

        newItem.innerHTML += `<img src=${imageUrl}/>`;
        newItem.innerHTML += `<p class='cartitem-name'>${title}</p>`
        newItem.innerHTML += `<input class = 'cartitem-qty' type='number' value=${quantity}>`
        newItem.innerHTML += `<p class='cartitem-price'>${price}</p>`

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.addEventListener("click", ()=>{
            const total = totalPrice.innerText;
            let qty = newItem.querySelector(".cartitem-qty").value;
            totalPrice.innerText = parseInt(total) - parseInt(price) * parseInt(qty);
            newItem.remove(); 
        })
        newItem.appendChild(removeBtn);
        cart_items.appendChild(newItem);
    }

    const total = totalPrice.innerText;
    totalPrice.innerText = parseInt(total) + parseInt(price);
}

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}){
    pagination.innerHTML ='';
    if(hasPreviousPage)
    {
        const btn2 = document.createElement("button");
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', () => getProducts(previousPage))
        pagination.appendChild(btn2)
    }

    const btn1 = document.createElement("button");
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click', () => getProducts(currentPage))
    pagination.appendChild(btn1)

    if(hasNextPage)
    {
        const btn3 = document.createElement("button");
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => getProducts(nextPage))
        pagination.appendChild(btn3)
    }
}

function getProducts(page){
    axios
    .get(`http://localhost:3000/products?page=${page}`)
    .then(({data: {products, ...pageData}}) => {
        listProducts(products);
        showPagination(pageData);
    })
    .catch((err) => console.log(err))
}

function emptyCart(){
    cartItems.innerHTML = "";
}



function addToCart(productId)
{
    console.log(productId)
    axios.post('http://localhost:3000/cart', {productId: productId})
    .then(response => {
        if(response.status === 200)
        {
            console.log(response);
            notifyUsers(response.data.message);
        }
        else
        {
            throw new Error();
        }
    })
    .catch((err)=>
    {
        console.log(err);
        notifyUsers(err);
    })
}

function getCartDetails()
{
    axios.get('http://localhost:3000/cart')
    .then(response => {
        if(response.status === 200)
        {
            response.data.products.forEach(product => {
                const cartContainer = document.getElementById('cart');
                cartContainer.innerHTML =cartContainer.innerHTML +
                `<li>${product.title} - ${product.cartItem.quantity} - ${product.price}`
            })
            document.querySelector('#cart').style = "display:block;"
        }
        else{
            throw new Error('Something went wrong')
        }
    })
    .catch(error => {
        notifyUsers(error);
    })
    
}

function notifyUsers(message)
{
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500) 
}