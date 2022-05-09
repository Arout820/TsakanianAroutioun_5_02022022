// recuperer l'id'dans dans l'url gràce à la méthode searchParams
let url = new URL(document.URL);
let id = url.searchParams.get('id');
// récupération du fetch dans une variable produit
const productFetch = fetch('http://localhost:3000/api/products/' + id);

// faire appel à l'api du produit demandé
productFetch
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((value) => {
    // selection de l'image du produit
    const image = document.createElement('img');
    document.querySelector('.item__img').appendChild(image);
    image.setAttribute('src', value.imageUrl);
    image.setAttribute('alt', value.altTxt);

    // affichage du nom
    const name = document.querySelector('#title');
    name.innerText = value.name;

    // affichage du prix
    const price = document.querySelector('#price');
    price.innerText = value.price;

    // affichage de la description du produit
    const description = document.querySelector('#description');
    description.innerText = value.description;

    // selection des differentes couleurs possibles
    for (i in value.colors) {
      const color = document.createElement('option');
      document.querySelector('#colors').appendChild(color);
      color.setAttribute('value', value.colors[i]);
      color.innerText = value.colors[i];
    }

    // mise en place du produit
    class Product {
      constructor(id, quantity, color) {
        this.id = id;
        this.quantity = quantity;
        this.color = color;
      }
    }

    // recuperer la quantité saisie
    let choosenQuantity = document.querySelector('#quantity').addEventListener('change', (event) => {
      choosenQuantity = event.target.value;
    });

    // recuperer la couleur saisie
    let choosenColor = document.querySelector('#colors').addEventListener('change', (event) => {
      choosenColor = event.target.value;
    });

    // ----------------------- DEBUT ajout au panier 1 ----------------------- //

    document.querySelector('#addToCart').addEventListener('click', () => {
      let storedProduct = new Product(value._id, choosenQuantity, choosenColor);
      let productQuantityInt = parseInt(storedProduct.quantity);
      storedProduct.quantity = productQuantityInt;

      let basket = JSON.parse(localStorage.getItem('product'));

      // fonction pour ajouter le produit dans le locale storage et afficher un message
      function AddProductinLocalStorage() {
        basket.push(storedProduct);
        localStorage.setItem('product', JSON.stringify(basket));
        alert(`+ ${productQuantityInt} Vous avez ${productQuantityInt} / 100 quantités de ce produit dans le panier.`);
      }

      // on regarde si le produit à envoyer a une couleur et une quantité
      if (
        storedProduct.color == '' ||
        storedProduct.color == undefined ||
        storedProduct.quantity == NaN ||
        storedProduct.quantity == 0
      ) {
        alert('Séléctionnez la couleur et la quantité de votre commande');
      }

      // si le produit est présent dans le panier, on verifie les quantités grace à l'id et à la couleur
      else if (basket) {
        let test = true;

        for (let i in basket) {
          let product = basket[i];

          if (product['id'] == value._id) {
            if (product['color'] == storedProduct.color) {
              if (product['quantity'] + productQuantityInt < 101) {
                product['quantity'] += productQuantityInt;
                localStorage.setItem('product', JSON.stringify(basket));
                alert(
                  `+ ${productQuantityInt} Vous avez ${product['quantity']} / 100 quantités de ce produit dans le panier.`
                );
                test = false;
                break;
              } else {
                alert(
                  `Vous avez déjà ${product['quantity']} / 100 quantités de ce produit dans le panier. Vous ne pouvez pas dépasser 100 produits similaires merci.`
                );
                test = false;
                break;
              }
            }
          }
        }

        if (test == true) {
          AddProductinLocalStorage();
        }
      }

      // si il n'y a aucun produit dans le panier, on ajoute
      else {
        basket = [];
        AddProductinLocalStorage();
      }

      console.log(basket);
    });

    // ----------------------- FIN ajout au panier 2 ----------------------- //
  })
  .catch((error) => {
    console.log(error);
  });
