    function sendRequest(url, callback) {
        const promise = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url); // настройка запроса 
            xhr.send(); // отправка запроса
            xhr.onreadystatechange = () => { // срабатывает на все изменения состояния запроса
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    resolve(callback(JSON.parse(xhr.responseText)));
                }
                else('error');
            }
        });
    }
    const $button = document.querySelector('#send');
    $button.addEventListener('click', () => {
        sendRequest('http://localhost:3000/products.json', (products) => {
            document.querySelector('#products').innerHTML = products.map(item => `<li> <img class="foto" src="${item.cover}" alt=""></li> ${item.name}, ${item.size}, ${item.material}, ${item.color}: ${item.price}; </li>`).join('');
            const summPrice = products.reduce((acc, item) => acc + item.price, 0); // подсчет суммы товаров в карзине	
            document.querySelector('#price').innerHTML = ('The sum of the goods is equal to: ' + summPrice);
        });
    });