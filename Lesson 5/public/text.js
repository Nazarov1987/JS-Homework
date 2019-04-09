const app = new Vue({
	el: "#app",
	data: {
	products : [],
	basketBought : [],
    display: "none",
    displayTwo: "block",
	},
	mounted(){
		fetch("http://localhost:3000/products")//отправка запроса на сервер
		.then((response) => response.json())
		.then((items) => {
			this.products = items;
            if(this.basketBought.length == 0){
            this.display = "block";
            this.displayTwo = "none"; 
            }
		})
	},
	methods:{
		buyClick(id) {//добавление товара в корзину
    idEvent = event.target.dataset.id;
    indexProduct = this.products.findIndex(item => item.id == idEvent);
	this.basketBought.push(this.products[indexProduct].price);
        if(this.basketBought.length > 0){
        this.display = "none";
        this.displayTwo = "block"; 
            }
        },
        summaInBasket(){//подсчет суммы цены товаров в карзине
        return this.basketBought.reduce((acc, item) => acc + item, 0); 
        },
		cleanClick(){
		this.basketBought = [];
        this.display = "block";
        this.displayTwo = "none"; 
		},
    }
});


