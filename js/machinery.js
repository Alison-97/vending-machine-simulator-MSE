//to clear local storage
//window.localStorage.clear();

async function refresh() {
  let brandDB = await fetchDrink();
  let coinDB = await fetchCoin();
  renderTable(brandDB, coinDB);
}
refresh();

function fetchDrink() {
  if (!localStorage.getItem("brand")) {
    return $.getJSON("./json/brand.json", (data) => {
      localStorage.setItem("brand", JSON.stringify(data));
    });
  }
  return JSON.parse(localStorage.getItem("brand"));
}

function fetchCoin() {
  if (!localStorage.getItem("coin")) {
    return $.getJSON("./json/coin.json", (data) => {
      localStorage.setItem("coin", JSON.stringify(data));
    });
  }
  return JSON.parse(localStorage.getItem("coin"));
}

let allBrand, allCoin;

function renderTable(brand, coin) {
  $("tbody").html("");
  for (let i = 0; i < brand.length; i++) {
    let row = $("#brand-table tbody")[0].insertRow(i);
    row.insertCell(0).innerHTML = brand[i].brand;
    row.insertCell(1).innerHTML = `
    <button class="icon" onclick="minusPrice(${i})">-</button> 
      RM ${(Math.round(brand[i].price) / 100).toFixed(2)} 
    <button class="icon" onclick="addPrice(${i})">+</button>
    `;
    row.insertCell(2).innerHTML = `
    <button class="icon" onclick="minusBrand(${i})">-</button> 
    ${brand[i].stock}
    <button class="icon" onclick="addBrand(${i})">+</button> 
    `;
    row.insertCell(
      3
    ).innerHTML = `<button class='btn btn-primary' onclick="remove(${i})"> Remove </button>`;
  }

  for (let i = 0; i < coin.length; i++) {
    let row = $("#coin-table tbody")[0].insertRow(i);
    row.insertCell(0).innerHTML = `RM ${(
      Math.round(coin[i].value) / 100
    ).toFixed(2)}`;
    row.insertCell(1).innerHTML = `
      <button class="icon" onclick="minusCoin(${i})">-</button> 
      ${coin[i].stock}
      <button class="icon" onclick="addCoin(${i})">+</button> 
      `;
  }

  allBrand = brand;
  allCoin = coin;
}

function renderAndSetItem() {
  renderTable(allBrand, allCoin);
  localStorage.setItem("brand", JSON.stringify(allBrand));
  localStorage.setItem("coin", JSON.stringify(allCoin));
}

function minusPrice(id) {
  if (allBrand[id].price > 0) {
    allBrand[id].price -= 10;
  }
  renderAndSetItem();
}

function addPrice(id) {
  if (allBrand[id].price < 200) {
    allBrand[id].price += 10;
  }
  renderAndSetItem();
}

function minusBrand(id) {
  if (allBrand[id].stock > 0) {
    allBrand[id].stock--;
  }
  renderAndSetItem();
}

function addBrand(id) {
  if (allBrand[id].stock < 20) {
    allBrand[id].stock++;
  }
  renderAndSetItem();
}

function remove(id) {
  allBrand.splice(id, 1);
  renderAndSetItem();
}

function minusCoin(id) {
  if (allCoin[id].stock > 0) {
    allCoin[id].stock--;
  }
  renderAndSetItem();
}

function addCoin(id) {
  if (allCoin[id].stock < 30) {
    allCoin[id].stock++;
  }
  renderAndSetItem();
}

function restore() {
  $.getJSON("../json/brand.json", (data) => {
    localStorage.setItem("brand", JSON.stringify(data));
  });

  $.getJSON("../json/coin.json", (data) => {
    localStorage.setItem("coin", JSON.stringify(data));
  });
  setTimeout(refresh, 100);
}

function addDrinks() {
  $("#add-drinks-box").css("visibility", "visible");
}

function closeBox() {
  $("#add-drinks-box").css("visibility", "hidden");
}

function submitInfo() {
  console.log("submit");
  let brandName = $("#brand").val();
  let price = $("#price").val() * 100;
  let stock = $("#stock").val();
  let newBrand = {
    brand: brandName,
    price: price,
    stock: stock,
  };
  allBrand.push(newBrand);
  renderAndSetItem();
  closeBox();
}
