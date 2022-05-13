$(document).ready(async () => {
  let brandDB = await fetchDrink();
  let coinDB = await fetchCoin();
  renderTable(brandDB, coinDB);
});

function fetchDrink() {
  if (!localStorage.getItem("brand")) {
    return $.getJSON("../json/brand.json", (data) => {
      localStorage.setItem("brand", JSON.stringify(data));
    });
  }
  return JSON.parse(localStorage.getItem("brand"));
}

function fetchCoin() {
  if (!localStorage.getItem("coin")) {
    return $.getJSON("../json/coin.json", (data) => {
      localStorage.setItem("coin", JSON.stringify(data));
    });
  }
  return JSON.parse(localStorage.getItem("coin"));
}

function renderTable(brand, coin) {
  for (let i = 0; i < brand.length; i++) {
    let row = $("tbody")[0].insertRow(i);
    row.insertCell(0).innerHTML = i + 1;
    row.insertCell(1).innerHTML = brand[i].brand;
    row.insertCell(2).innerHTML =
      "RM " + (Math.round(brand[i].price) / 100).toFixed(2);
    brand[i].stock > 0
      ? (row.insertCell(3).innerHTML = "In stock")
      : (row.insertCell(3).innerHTML = "No stock");
    row.insertCell(
      4
    ).innerHTML = `<button id="brand-btn-${i}" class='buy-btn' disabled=true onclick="buy(${i})"></button>`;
  }
  allBrand = brand;
  allCoin = coin;
}

let allBrand;
let allCoin;
let totalCoinInserted = 0;

// user control
function insert(event) {
  //clear any previous error msg
  $("#invalidMsg").text("-");

  //add coin to machine (limited to 30)
  coinInserted = event.target.id;
  if (allCoin[coinInserted].stock < 30) {
    allCoin[coinInserted].stock++;
    totalCoinInserted += parseFloat(event.target.value);
  } else {
    $("#invalidMsg").text("Max capacity, insert other coin type");
  }

  //display total
  $("#inserted").html(`RM ${(Math.round(totalCoinInserted) / 100).toFixed(2)}`);
  displayAvail();

  //allow termination
  if (totalCoinInserted > 0) {
    $("#terminate-btn").prop("disabled", false);
  }

  localStorage.setItem("coin", JSON.stringify(allCoin));
}

function displayAvail() {
  //check money sufficiency & stock
  for (let i = 0; i < allBrand.length; i++) {
    if (totalCoinInserted >= allBrand[i].price && allBrand[i].stock > 0) {
      $(`#brand-btn-${i}`).prop("disabled", false);
    } else $(`#brand-btn-${i}`).prop("disabled", true);
  }
}

function flashInvalid() {
  $("#invalidMsg").text("Invalid coin");
}

let changeAmount; //so that buy(), change() & terminate() can access

function buy(id) {
  //calculate & deposit change
  changeAmount = totalCoinInserted - allBrand[id].price;
  change();

  //minus drinks stock
  allBrand[id].stock--; // wont be negative cz the buy button is disabled when no stock
  if (allBrand[id].stock < 1) {
    $("tbody")[0].rows[id].cells[3].innerHTML = "no stock";
  }
  localStorage.setItem("brand", JSON.stringify(allBrand));

  //refresh transaction
  totalCoinInserted = 0;
  $("#inserted").text(`RM ${totalCoinInserted}`);
  displayAvail();
}

let depositedChange = ""; // make it a string, so that each coin can be displayed rather than the total

function change() {
  while (changeAmount >= 100 && allCoin[0].stock > 0) {
    changeAmount -= 100;
    depositedChange += "RM1 <br>";
    allCoin[0].stock--;
  }
  while (changeAmount >= 50 && allCoin[1].stock > 0) {
    changeAmount -= 50;
    depositedChange += "50sen <br>";
    allCoin[1].stock--;
  }
  while (changeAmount >= 20 && allCoin[2].stock > 0) {
    changeAmount -= 20;
    depositedChange += "20sen <br>";
    allCoin[2].stock--;
  }
  while (changeAmount >= 10 && allCoin[3].stock > 0) {
    changeAmount -= 10;
    depositedChange += "10sen <br>";
    allCoin[3].stock--;
  }
  $("#deposit-change").html(`${depositedChange}`);

  //not enough change msg
  if (changeAmount > 0) {
    $("#insufficient-change").text(
      "* Sorry, machine doesn't have enough change"
    );
  }
  setInterval(() => $("#insufficient-change").text(""), 5000);
  if (depositedChange !== "") {
    $("#collect-change-btn").prop("disabled", false);
  }
  $("#terminate-btn").prop("disabled", true);
  localStorage.setItem("coin", JSON.stringify(allCoin));
}

function terminate() {
  changeAmount = totalCoinInserted;
  change();
  totalCoinInserted = 0;
  $("#inserted").text(`RM ${totalCoinInserted}`);
  displayAvail();
}

function collectChange() {
  $("#deposit-change").empty();
  depositedChange = "";
  $("#collect-change-btn").prop("disabled", true);
}

// Just like regular vending machine that cannot prevent customer from using it as coin/note changer
// there's a capacity limit of coin & drinks stored in the machine
// coin & brand stock will be stored locally
// totalCoinInserted wont remain after each refresh, but will be inserted directly into DB
// uncollected coin in each transaction will be accumulated but wont remain after each refresh
