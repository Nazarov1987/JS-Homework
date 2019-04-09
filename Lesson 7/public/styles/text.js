const APP_URL = "http://localhost:3000";

Vue.component('product-cart-component', { //компонент корзина
    props: ['basket_bought']
    , template: `
<div>	
<section class="shoppingGridRow" v-for="item in basket_bought">
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
     <button @click="handleDeleteClick(item)">x</button>
  </div>
</section>
</div>
`,
	methods: {
    handleDeleteClick(item) {
    this.$emit('ondelete', item);
    }
  }
});

const app = new Vue({
	el: "#app",
	data: {
	products : [],
	basketBought : [],
	searchQuery: "",
    display: "none",
    displayTwo: "block",
	total: 0,
	},
	mounted(){
		fetch(`${APP_URL}/products`)//отправка запроса на сервер, извлечение продуктов
		  .then((response) => response.json())
		  .then((items) => {
			this.products = items;
		}),
        fetch(`${APP_URL}/cart`)
         .then((response) => response.json())
         .then((result) => {
          this.basketBought = result.items;
          this.total = result.total; 
        });
	},
    
	methods:{
        buyClick(item) {
            const cartItem = this.basketBought.find(cartItem => cartItem.id === item.id);
            if (cartItem) { //товар в карзине уже есть	
                fetch(`${APP_URL}/cart/${item.id}`, {
                method: "PATCH",
		        headers: {"Content-Type": "application/json"}, 
		        body: JSON.stringify({quantity: cartItem.quantity + 1}),
		        }).then((response) => response.json())
                  .then((result) => {
                  const itemIdx = this.basketBought.findIndex(cartItem => cartItem.id === item.id);
                  this.basketBought[itemIdx] = result;
                  Vue.set(this.basketBought, itemIdx, result.item);
		          this.total = result.total;
                  });
            } else {
                fetch(`${APP_URL}/cart`, { //добавление товара в корзину
                method: "POST",
		        headers: {"Content-Type": "application/json"},
		        body: JSON.stringify({...item, quantity: 1}),
		        }) .then((response) => response.json())
                   .then((result) => {
                   this.basketBought.push(result.item);
		           this.total = result.total;
                   if (this.basketBought.length == 0) {
                   this.display = "block";
                   this.displayTwo = "none";
                   }
                })
		      }
	    },
        
		handleDeleteClick(item) {
            if(item.quantity > 1) {
                fetch(`${APP_URL}/cart/${item.id}`, {
                method: "PATCH",
		        headers: {"Content-Type": "application/json"}, 
		        body: JSON.stringify({quantity: item.quantity - 1}),
		        }).then((response) => response.json())
                  .then((result) => {
                   const itemIdx = this.basketBought.findIndex(cartItem => cartItem.id === item.id);
                   this.basketBought[itemIdx] = result;
                   Vue.set(this.basketBought, itemIdx, result.item);
		           this.total = result.total;
                   });
            }else {
                fetch(`${APP_URL}/cart/${item.id}`, {
                method: 'DELETE',
                }).then(() => {
                this.basketBought = this.basketBought.filter((cartItem) => cartItem.id !== item.id);
                })
		     }
        },
        
        goToCardClick() { //переход в корзину
            $bodySite = document.getElementById("bodySite");    
	        $bodySite.style.display = "none";
            $basket = document.getElementById("basket");    
	        $basket.style.display = "block";
        },

		cleanClick(){ //очитска корзины
            fetch(`${APP_URL}/cart`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.splice([{}]),
            }).then(() => { 
                this.basketBought.splice(0,this.basketBought.length);    
                })
            this.display = "block";
            this.displayTwo = "none"; 	
		},
	},
})



