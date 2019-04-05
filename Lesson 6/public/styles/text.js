Vue.component('product-item', { //компонент корзина
    props: ['item']
    , template: ` 
<section class="shoppingGridRow">
  <div class="product">
    <img class="pictureProduct" :src="item.cover" alt="">
    <div class="productDetails">
       <h2 class="productName">{{ item.name }}</h2>
       <div class="productColor">
         <span class="productParam">Color:</span> Red
       </div>
       <div class="productSize">
         <span class="productParam">Size:</span> XII
       </div>
    </div>
  </div>
  <div class="productPrice">{{ item.currency }}{{ item.price }}</div>
  <div class="productQty">
     <input type="text" v-model = "item.quantity" >
  </div>
  <div class="productShipping">FREE</div>
  <div class="productSubtotal"> {{ item.currency }}{{ item.price * item.quantity}} </div>
  <div class="productAction">
     <i class="fas fa-times-circle"></i>
  </div>
</section>
`
});

Vue.component('product-cart-component', {
    props: ['basket_bought']
    , template: `  <div><product-item v-for="item in basket_bought" :item="item"></product-item></div>`
});



const APP_URL = "http://localhost:3000";
const app = new Vue({
    el: "#app"
    , data: {
        products: []
        , basketBought: []
        , display: "none"
        , displayTwo: "block"
    , }
    , mounted() {
        fetch(`${APP_URL}/products`) //отправка запроса на сервер
            .then((response) => response.json()).then((items) => {
                this.products = items;
            })
    }
    , methods: {
        buyClick(item) {
                const cartItem = this.basketBought.find(cartItem => cartItem.id === item.id);
                if (cartItem) { //товар в карзине уже есть	
                    fetch(`${APP_URL}/cart/${item.id}`, {
                        method: "PATCH"
                        , headers: {
                            "Content-Type": "application/json"
                        }
                        , body: JSON.stringify({
                            quantity: cartItem.quantity + 1
                        })
                    , }).then((response) => response.json())
                        .then((updated) => {
                        const itemIdx = this.basketBought.findIndex(cartItem => cartItem.id === item.id);
                        this.basketBought[itemIdx] = updated;
                        Vue.set(this.basketBought, itemIdx, updated);
                    });
                }
                else {
                    fetch(`${APP_URL}/cart`, { //добавление товара в корзину
                        method: "POST"
                        , headers: {
                            "Content-Type": "application/json"
                        }
                        , body: JSON.stringify({...item, quantity: 1
                        })
                    , }).then((response) => response.json())
                        .then((created) => {
                        this.basketBought.push(created);
                        $basket = document.getElementById("basket");
                        $basket.style.display = "block";
                    })
                }
            }
            , summaInBasket() { //подсчет суммы цены товаров в карзине
                if (this.basketBought.length == 0) {
                    this.display = "block";
                    this.displayTwo = "none";
                }
                return this.basketBought.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },
        
     }
, });