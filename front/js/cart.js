// récupération du panier avec transformation du JSON en objet Javascript
let basket = JSON.parse(localStorage.getItem('product'));
console.log(basket);

// selection des éléments
let elementItem = document.querySelector('#cart__items');
let totalQuantity = document.querySelector('#totalQuantity');
let totalPrice = document.querySelector('#totalPrice');

// création de variables pour la quantité et le prix totale
let quantityToStore = 0;
let totalPriceToStore = 0;
let price = 0;

// affichage de certains élément visuels sur la page lorsque le panier est vide
if (basket.length < 1) {
  totalQuantity.innerText = 0;
  totalPrice.innerText = 0;
  const cartAndFormContainer = document.querySelector('#cartAndFormContainer');
  const emptyBasket = document.createElement('p');

  cartAndFormContainer.insertBefore(emptyBasket, cartAndFormContainer.children[1]);
  emptyBasket.innerText = 'Le panier est vide';
  emptyBasket.style.textAlign = 'center';
  emptyBasket.style.fontSize = '25px';
}

// ------------- Récupérations des produits dans le panier ------------- //

for (const i in basket) {
  let product = basket[i];

  // création des éléments HTML
  const article = document.createElement('article');
  const divCartItemImage = document.createElement('div');
  const image = document.createElement('img');
  const divCartItemContent = document.createElement('div');
  const divCartItemContentDescription = document.createElement('div');
  const productName = document.createElement('h2');
  const productColor = document.createElement('p');
  const productPrice = document.createElement('p');
  const divCartItemContentSettings = document.createElement('div');
  const divCartItemContentSettingsQuantity = document.createElement('div');
  const productQuantity = document.createElement('p');
  const changeProductQuantity = document.createElement('input');
  const divCartItemContentSettingsDelete = document.createElement('div');
  const deleteProduct = document.createElement('p');

  // insertion des éléments HTML
  elementItem.appendChild(article);
  article.appendChild(divCartItemImage);
  divCartItemImage.appendChild(image);
  article.appendChild(divCartItemContent);
  divCartItemContent.appendChild(divCartItemContentDescription);
  divCartItemContentDescription.appendChild(productName);
  divCartItemContentDescription.appendChild(productColor);
  divCartItemContentDescription.appendChild(productPrice);
  divCartItemContent.appendChild(divCartItemContentSettings);
  divCartItemContentSettings.appendChild(divCartItemContentSettingsQuantity);
  divCartItemContentSettingsQuantity.appendChild(productQuantity);
  divCartItemContentSettingsQuantity.appendChild(changeProductQuantity);
  divCartItemContentSettings.appendChild(divCartItemContentSettingsDelete);
  divCartItemContentSettingsDelete.appendChild(deleteProduct);

  // insertion des classes
  article.classList.add('cart__item');
  divCartItemImage.classList.add('cart__item__img');
  divCartItemContent.classList.add('cart__item__content');
  divCartItemContentDescription.classList.add('cart__item__content__description');
  divCartItemContentSettings.classList.add('cart__item__content__settings');
  divCartItemContentSettingsQuantity.classList.add('cart__item__content__settings__quantity');
  changeProductQuantity.classList.add('itemQuantity');
  divCartItemContentSettingsDelete.classList.add('cart__item__contenty__settings__delete');
  deleteProduct.classList.add('deleteItem');

  // insertion des attributs
  article.setAttribute('data-id', product['id']);
  article.setAttribute('data-color', product['color']);
  changeProductQuantity.setAttribute('type', 'number');
  changeProductQuantity.setAttribute('name', 'itemQuantity');
  changeProductQuantity.setAttribute('min', '1');
  changeProductQuantity.setAttribute('max', '100');
  changeProductQuantity.setAttribute('value', product['quantity']);

  // ajout d'élements texte
  deleteProduct.innerText = 'Supprimer';
  productColor.innerText = product['color'];
  productQuantity.innerText = 'Qté :';

  // création d'une variable id du produit
  let id = article.getAttribute('data-id');

  // récupération du fetch dans une variable produit
  const productFetch = fetch('http://localhost:3000/api/products/' + id);

  // utilisation de l'api pour récuper le nom, le prix et l'image d'un produit
  productFetch
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((value) => {
      if (id == value._id) {
        // insértion des éléments descriptives d'un produit dans le panier
        productName.innerText = value.name;
        image.setAttribute('src', value.imageUrl);
        productPrice.innerText = value.price + ' €';

        // insértion quantité totale et prix total
        price = value.price;
        quantityToStore += product['quantity'];
        totalPriceToStore += product['quantity'] * price;
        totalQuantity.innerText = quantityToStore;
        totalPrice.innerText = totalPriceToStore;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// --------------- Changement de la quantité des products --------------- //

document.querySelectorAll('.itemQuantity').forEach((item) => {
  item.addEventListener('change', (event) => {
    let articleProduct = item.closest('article');

    for (const i in basket) {
      if (articleProduct.getAttribute('data-id') == basket[i]['id']) {
        if (articleProduct.getAttribute('data-color') == basket[i]['color']) {
          let quantitySelected = parseInt(event.target.value);
          if (quantitySelected > 100) {
            alert('Vous ne pouvez pas dépasser 100 articles similaires merci');
            window.location.href = document.URL;
          } else {
            basket[i]['quantity'] = quantitySelected;
            localStorage.setItem('product', JSON.stringify(basket));
            window.location.href = document.URL;
          }
        }
      }
    }
  });
});

// ----------------- Suppression d'un produit du panier ----------------- //

document.querySelectorAll('.deleteItem').forEach((item) => {
  // changement de propriété css
  item.style.display = 'inline-block';

  // modification lors du survol
  function MouseEnter() {
    item.style.fontWeight = '600';
    item.style.cursor = 'pointer';
  }

  // modification lorsque la souris ne sourvole plus
  function MouseLeave() {
    item.style.fontWeight = '300';
    item.style.cursor = 'initial';
  }
  item.onmouseenter = MouseEnter;
  item.onmouseleave = MouseLeave;

  // suppression lorsque cliqué
  item.addEventListener('click', (event) => {
    item.style.fontWeight = '';
    let articleProduct = item.closest('article');

    for (const i in basket) {
      if (articleProduct.getAttribute('data-id') == basket[i]['id']) {
        if (articleProduct.getAttribute('data-color') == basket[i]['color']) {
          let myIndex = basket.indexOf(basket[i]);

          if (myIndex !== -1) {
            basket.splice(myIndex, 1);
          }
          alert('Vous avez supprimé le produit.');
          localStorage.setItem('product', JSON.stringify(basket));
          window.location.href = document.URL;
        }
      }
    }
  });
});

// ---------------------------- PASSER LA COMMANDE ---------------------------- //

// Déclaration de test pour la validité des éléments
let firstNameValid = false;
let lastNameValid = false;
let addressValid = false;
let cityValid = false;
let emailValid = false;

// Recuperation des élements
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const address = document.querySelector('#address');
const city = document.querySelector('#city');
const email = document.querySelector('#email');
const submit = document.querySelector('#order');

const firstNameError = document.querySelector('#firstNameErrorMsg');
const lastNameError = document.querySelector('#lastNameErrorMsg');
const addressError = document.querySelector('#addressErrorMsg');
const cityError = document.querySelector('#cityErrorMsg');
const emailError = document.querySelector('#emailErrorMsg');

// Verication instantanée si les éléments sont corrects et affichge visuel
firstName.addEventListener('change', () => {
  validationfirstName();
});

lastName.addEventListener('change', () => {
  validationlastName();
});

address.addEventListener('change', () => {
  validationaddress();
});

city.addEventListener('change', () => {
  validationcity();
});

email.addEventListener('change', () => {
  validationEmail();
});

// fonction validation du prénom
function validationfirstName() {
  let regularExpressions = /^[a-zA-Zà-œÀ-Ÿ][a-zA-Zà-œÀ-Ÿ-]{0,200}[a-zA-Zà-œÀ-Ÿ]$/g;

  if (regularExpressions.test(firstName.value)) {
    firstNameError.innerText = 'Le prénom est valide';
    firstNameValid = true;
    firstNameError.style.color = '#80ff80';
  } else {
    firstNameError.innerText = "Le prénom n'est pas valide";
    firstNameValid = false;
    firstNameError.style.color = '#fbbcbc';
  }
  return false;
}

// fonction validation du nom
function validationlastName() {
  let regularExpressions = /^[a-zA-Zà-œÀ-Ÿ][a-zA-Zà-œÀ-Ÿ-]{0,200}[a-zA-Zà-œÀ-Ÿ]$/g;

  if (regularExpressions.test(lastName.value)) {
    lastNameError.innerText = 'Le nom est valide';
    lastNameValid = true;
    lastNameError.style.color = '#80ff80';
  } else {
    lastNameError.innerText = "Le nom n'est pas valide";
    lastNameValid = false;
    lastNameError.style.color = '#fbbcbc';
  }
  return false;
}

// fonction validation de l'adresse
function validationaddress() {
  let regularExpressions = /^[0-9]{0,6}[ ][a-zA-Zà-œÀ-Ÿ -]{0,200}[a-zA-Zà-œÀ-Ÿ]$/g;

  if (regularExpressions.test(address.value)) {
    addressError.innerText = "L'adresse est valide";
    addressValid = true;
    addressError.style.color = '#80ff80';
  } else {
    addressError.innerText = "L'adresse n'est pas valide";
    addressValid = false;
    addressError.style.color = '#fbbcbc';
  }
  return false;
}

// fonction validation de la ville
function validationcity() {
  let regularExpressions = /^[a-zA-Zà-œÀ-Ÿ][a-zA-Zà-œÀ-Ÿ\- ]{1,180}[a-zA-Zà-œÀ-Ÿ]{1,180}$/g;

  if (regularExpressions.test(city.value)) {
    cityError.innerText = 'La ville est valide';
    cityValid = true;
    cityError.style.color = '#80ff80';
  } else {
    cityError.innerText = "La ville n'est pas valide";
    cityValid = false;
    cityError.style.color = '#fbbcbc';
  }
  return false;
}

// fonction validation de l'email
function validationEmail() {
  let regularExpressions = /^[a-zA-z][a-zA-z0-9.-]{2,85}@[a-zA-z0-9]{2,84}\.[a-zA-z]{2,84}$/g;

  if (regularExpressions.test(email.value)) {
    emailError.innerText = "L'adresse mail est valide";
    emailValid = true;
    emailError.style.color = '#80ff80';
  } else {
    emailError.innerText = "L'adresse mail n'est pas valide";
    emailValid = false;
    emailError.style.color = '#fbbcbc';
  }
  return false;
}

// récuperer les informations du Contact
class Contact {
  constructor(firstName, lastName, address, city, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.email = email;
  }
}

// bouton commande pour faire les tests et récupérer les informations contact et produit si test validé
submit.addEventListener('click', (event) => {
  event.preventDefault();

  if (firstNameValid !== true) {
    firstNameError.innerText = "Le prénom n'est pas valide !";
  }

  if (lastNameValid !== true) {
    lastNameError.innerText = "Le nom n'est pas valide !";
  }

  if (addressValid !== true) {
    addressError.innerText = "L'adresse n'est pas valide !";
  }

  if (cityValid !== true) {
    cityError.innerText = "La ville n'est pas valide !";
  }

  if (emailValid !== true) {
    emailError.innerText = "L'adresse mail n'est pas valide !";
  }

  if (
    firstNameValid == true &&
    lastNameValid == true &&
    addressValid == true &&
    cityValid == true &&
    emailValid == true
  ) {
    if (basket.length < 1) {
      alert("Vous n'avez rien dans le panier");
    } else {
      let contact = new Contact(firstName.value, lastName.value, address.value, city.value, email.value);

      // On ne va envoyer que les ID des produits car l'API ne prend que les ID
      let products = [];
      for (const i in basket) {
        products.push(basket[i].id);
      }

      const purchase = { products, contact };

      // envoie de donnée à l'API
      const sendPurchaseToApi = fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        body: JSON.stringify(purchase),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      sendPurchaseToApi.then(async (res) => {
        try {
          let resultat = await res.json();
          window.location = `confirmation.html?orderId=${resultat.orderId}`;
        } catch (error) {
          console.log(error);
        }
      });

      console.log(sendPurchaseToApi);
    }
  }
});
