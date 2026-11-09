
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");

// Получаем корзину из localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Сохраняем корзину
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Отрисовываем товары
function renderCart() {
  const cart = getCart();

  cartItems.replaceChildren();

  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    // Позиция корзины — собственный компонент вместо Bootstrap-карточки.
    const cartItem = document.createElement("article");
    cartItem.className = "cart-item";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.title;
    image.className = "cart-item__image";

    const info = document.createElement("div");
    info.className = "cart-item__info";

    const title = document.createElement("h2");
    title.className = "cart-item__title";
    title.textContent = item.title;

    const price = document.createElement("p");
    price.className = "cart-item__unit-price";
    price.textContent = `${item.price} ₽ за штуку`;

    info.append(title, price);

    const quantityColumn = document.createElement("div");
    quantityColumn.className = "cart-item__quantity";

    const decreaseButton = document.createElement("button");
    decreaseButton.className = "button button--icon";
    decreaseButton.type = "button";
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", `Уменьшить количество: ${item.title}`);

    const quantity = document.createElement("span");
    quantity.className = "cart-item__count";
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.className = "button button--icon";
    increaseButton.type = "button";
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Увеличить количество: ${item.title}`);

    decreaseButton.addEventListener("click", () => {
      const updatedCart = getCart();
      const product = updatedCart.find((product) => product.id === item.id);

      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        const index = updatedCart.findIndex(
          (product) => product.id === item.id
        );
        updatedCart.splice(index, 1);
      }

      saveCart(updatedCart);
      renderCart();
    });

    increaseButton.addEventListener("click", () => {
      const updatedCart = getCart();
      const product = updatedCart.find((product) => product.id === item.id);

      product.quantity += 1;

      saveCart(updatedCart);
      renderCart();
    });

    quantityColumn.append(decreaseButton, quantity, increaseButton);

    const totalColumn = document.createElement("div");
    totalColumn.className = "cart-item__total";

    const itemPrice = document.createElement("p");
    itemPrice.className = "cart-item__sum";
    itemPrice.textContent = `${itemTotal} ₽`;

    const removeButton = document.createElement("button");
    removeButton.className = "button button--danger-outline";
    removeButton.type = "button";
    removeButton.textContent = "Удалить";
    removeButton.setAttribute("aria-label", `Удалить из корзины: ${item.title}`);

    removeButton.addEventListener("click", () => {
      const updatedCart = getCart().filter(
        (product) => product.id !== item.id
      );

      saveCart(updatedCart);
      renderCart();
    });

    totalColumn.append(itemPrice, removeButton);

    cartItem.append(image, info, quantityColumn, totalColumn);

    cartItems.append(cartItem);
  });

  // Обновляем итоговую сумму и состояние корзины
  cartTotal.textContent = total.toLocaleString("ru-RU");
  cartEmpty.hidden = cart.length > 0;
  cartSummary.hidden = cart.length === 0;
}

// Очищаем корзину целиком
clearCartButton.addEventListener("click", () => {
  saveCart([]);
  renderCart();
});

// Показываем корзину при открытии страницы
renderCart();



const orderForm = document.querySelector("#order-form");
const orderMessage = document.querySelector("#order-message");

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cart = getCart();

  if (cart.length === 0) {
    orderMessage.textContent = "Добавьте товары в корзину.";
    return;
  }

  if (!orderForm.checkValidity()) {
    orderForm.reportValidity();
    return;
  }

  const customerName = document
    .querySelector("#customer-name")
    .value
    .trim();

  orderMessage.textContent =
    `Спасибо, ${customerName}! Заказ успешно оформлен.`;

  saveCart([]);
  renderCart();
  orderForm.reset();
});

