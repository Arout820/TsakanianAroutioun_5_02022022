// récupération du fetch dans une variable produits
const productsFetch = fetch('http://localhost:3000/api/products');

// appel de l'api pour récuper les produits dans la page accueil
productsFetch
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((value) => {
    for (const i in value) {
      console.log(value[i]);

      // créations des élements pour le html
      let items = document.querySelector('#items');
      const link = document.createElement('a');
      const article = document.createElement('article');
      const image = document.createElement('img');
      const title = document.createElement('h3');
      const description = document.createElement('p');

      // ajout des éléments dans le html
      items.appendChild(link).appendChild(article);
      article.append(image, title, description);

      // ajout des classes
      title.classList.add('productName');
      description.classList.add('productDescription');

      // création du produit avec l'api
      title.innerText = value[i].name;
      description.innerText = value[i].description;
      image.setAttribute('src', value[i].imageUrl);
      image.setAttribute('alt', value[i].altTxt);

      // création d'une variable dans l'url pour la redirecation sur la page produit
      let redirect = `product.html?id=${value[i]._id}`;
      link.setAttribute('href', redirect);
    }
  })
  .catch((error) => {
    console.log(error);
  });
