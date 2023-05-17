/* Variabile globale utile per non dover caricare ogni volta tra una richiesta e l'altra e non
sminchiare il CSS. */
let books;

async function renderBooks(filter) {
  const booksWrapper = document.querySelector('.books')

  booksWrapper.classList += ' books__loading';
  if (!books) {
    books = await getBooks();
  }
  booksWrapper.classList.remove('books__loading');

  if (filter === 'LOW_TO_HIGH') {
    /* Questa funzione ordina confrontando due elementi alla volta in base al risultato della
    funzione di callback. Primo argomento meno il secondo per ordinare in senso crescente,
    viceversa ordina in senso decrescente. Se avessi dovuto
    ordinare stringhe si deve chiamare la funzione senza alcun argomento, solo books.sort() */
    books.sort((a,b) => (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice));
  }
  else if (filter === 'HIGH_TO_LOW') {
    /* l'OR prende il primo valore che trova true per effettuare il calcolo, da sx a dx */
    books.sort((a,b) => (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice));
  }
  else if (filter === 'RATING') {
    books.sort((a,b) => b.rating - a.rating);
  }
 
  /* Usare un array di stringhe tutto insieme (in questo caso per creare l'HTML da inserire nella pagina)
  fa si che gli elementi siano separati da una virgola. Non vogliamo ciò quindi usiamo
  il metodo join per fare in modo che il tutto sia una sola grande stringa, inserendo
  una stringa vuota come parametro (nessun carattere separatore)*/
  const booksHTML = books.map((book) => {
    /* Il metodo "toFixed" fa in modo che vengano ritornate anche 2 cifre decimali del
    numero, in quanto di base ci sono scritti interi nei dati e voglio visualizzare
    il prezzo comprensivo di zeri.*/
    return `<div class="book">
    <figure class="book__img--wrapper">
      <img class="book__img" src="${book.url}" alt="" />
    </figure>
    <div class="book__title">${book.title}</div>
    <div class="book__ratings">
      ${ratingsHTML(book.rating)}
    </div>
    <div class="book__price">
      ${priceHTML(book.originalPrice, book.salePrice)}
    </div>
  </div>`
  }).join("");
  booksWrapper.innerHTML = booksHTML;
}

function priceHTML(originalPrice, salePrice) {
  /* Se il parametro è null è falsy, quindi solo in quel caso questo if verrà superato. */
  if (!salePrice) {
    return `$${originalPrice.toFixed(2)}`
  }
  else {
    return `<span class="book__price--normal">$${originalPrice.toFixed(2)}</span>$${salePrice.toFixed(2)}`
  }
}

function ratingsHTML(rating) {
  let ratingHTML = '';

  for(let i = 0; i < Math.floor(rating); i++) {
    ratingHTML += '<i class="fas fa-star"></i>';
  }
  if (!Number.isInteger(rating)) {
    ratingHTML += '<i class="fas fa-star-half-alt"></i>'
  }
  return ratingHTML;
}


/* La funzione non funzionerebbe senza timeout perchè tenterebbe di avere
effetto su elementi HTML non ancora caricati, e lo script JS è più veloce
di HTML a prepararsi. Senza parametri, il timeout attende semplicemente
che HTLM finisca di caricare, per poi attivarsi dopo.*/
setTimeout(() => {
  renderBooks();
});

/* nel target di un event è contenuta la proprietà che ci interessa, ovvero il value, che
è una stringa con il nome che ho assegnato al value nell'HTML */
function filterBooks(event) {
  renderBooks(event.target.value);
}

// FAKE DATA
function getBooks() {
  /* Per imitare l'uso di un API verrà creata una promessa e "simulerò" un caricamento tramite timeout. */
  /* Consideriamo solo il caso in cui questa andrà a buon fine. */
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Crack the Coding Interview",
          url: "assets/crack the coding interview.png",
          originalPrice: 49.95,
          salePrice: 14.95,
          rating: 4.5,
        },
        {
          id: 2,
          title: "Atomic Habits",
          url: "assets/atomic habits.jpg",
          originalPrice: 39,
          salePrice: null,
          rating: 5,
        },
        {
          id: 3,
          title: "Deep Work",
          url: "assets/deep work.jpeg",
          originalPrice: 29,
          salePrice: 12,
          rating: 5,
        },
        {
          id: 4,
          title: "The 10X Rule",
          url: "assets/book-1.jpeg",
          originalPrice: 44,
          salePrice: 19,
          rating: 4.5,
        },
        {
          id: 5,
          title: "Be Obsessed Or Be Average",
          url: "assets/book-2.jpeg",
          originalPrice: 32,
          salePrice: 17,
          rating: 4,
        },
        {
          id: 6,
          title: "Rich Dad Poor Dad",
          url: "assets/book-3.jpeg",
          originalPrice: 70,
          salePrice: 12.5,
          rating: 5,
        },
        {
          id: 7,
          title: "Cashflow Quadrant",
          url: "assets/book-4.jpeg",
          originalPrice: 11,
          salePrice: 10,
          rating: 4,
        },
        {
          id: 8,
          title: "48 Laws of Power",
          url: "assets/book-5.jpeg",
          originalPrice: 38,
          salePrice: 17.95,
          rating: 4.5,
        },
        {
          id: 9,
          title: "The 5 Second Rule",
          url: "assets/book-6.jpeg",
          originalPrice: 35,
          salePrice: null,
          rating: 4,
        },
        {
          id: 10,
          title: "Your Next Five Moves",
          url: "assets/book-7.jpg",
          originalPrice: 40,
          salePrice: null,
          rating: 4,
        },
        {
          id: 11,
          title: "Mastery",
          url: "assets/book-8.jpeg",
          originalPrice: 30,
          salePrice: null,
          rating: 4.5,
        },
      ]);
    }, 1000);
  });
}
