    function sendRequest(url) {
        return fetch(url).then((response) => response.json());
    }

    const $buttonAddText = document.querySelector('#addText');
    $buttonAddText.addEventListener('click', () => {
        sendRequest('http://localhost:3000/phrase'). then((phrase) => {
        this.text = phrase.map(item => `<p> ${item.text} </p>`).join('');
        document.querySelector('#text').innerHTML =  this.text;   
	    this.filterText = this.text;
        });
    });

    const $buttonQuotes = document.querySelector('#quotes');
    $buttonQuotes.addEventListener('click', () => {	
	this.textTwo = this.filterText.replace(/\'[^EREN'T]/g, ' " ');   
    document.querySelector('#text').innerHTML = this.textTwo;
	});


