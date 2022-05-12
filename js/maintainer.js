$(document).ready(async () => {
  let brandDB = await fetchDrink();
  let coinDB = await fetchCoin();
  makeGlobal(brandDB, coinDB);
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

function getCoinCount(event) {
  let stock = allCoin[event.target.id].stock;
  let value = parseFloat(event.target.value);
  $("#selected-coin-total").text(
    `RM ${(Math.round(stock * value) / 100).toFixed(2)}`
  );
}

let allBrand, allCoin;

function makeGlobal(brand, coin) {
  allBrand = brand;
  allCoin = coin;
}

function totalCash() {
  let totalCash = allCoin
    .map((coin) => coin.stock * coin.value)
    .reduce((a, b) => a + b);
  $("#total-cash").text(`RM ${(Math.round(totalCash) / 100).toFixed(2)}`);
}

function collectAll() {
  allCoin.forEach((coin) => (coin.stock = 0));
  localStorage.setItem("coin", JSON.stringify(allCoin));
  totalCash();
  //clear previous selected total
  $("#selected-coin-total").empty();
}

function validate() {
  if ($("#password").val() == 1234) {
    $("#result").text("Password correct");
    $("#content").css("visibility", "visible");
  } else $("#result").text("Password incorrect");
}
