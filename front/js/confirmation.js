// Recuperation et affichage du numéro de commande sur la page confirmation

let orderId = document.querySelector("#orderId");
let url = new URL(document.URL);
orderId.innerText = url.searchParams.get("orderId");
localStorage.setItem("product", JSON.stringify(new Array));