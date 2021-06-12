const container = document.querySelector(".container");

const requestAllCountry = new XMLHttpRequest();
requestAllCountry.open("GET", "https://restcountries.eu/rest/v2/all");
requestAllCountry.send();
requestAllCountry.onload = function () {
  const countries = JSON.parse(this.responseText);

  const allCountries = [];
  allCountries.push(countries);

  var options = [];

  allCountries[0].forEach((item) => {
    options.push({
      id: item["alpha3Code"],
      title: item["name"],
    });
  });

  new TomSelect("#select-junk", {
    maxItems: null,
    maxOptions: 300,
    valueField: "id",
    labelField: "title",
    searchField: "title",
    sortField: "title",
    options: options,
    create: true,
  });

  const btn = document.querySelector(".get-btn");

  btn.addEventListener("click", function () {
    var select = document.getElementById("select-junk");
    let selectedOptions = [...select.options]
      .filter((option) => option.selected)
      .map((option) => option.value);

    //clear the DOM from all the child nodes of the previous API call to make DOM clear for new api call
    while (container.firstChild) {
      container.firstChild.remove();
    }
    getCountryData(selectedOptions);
  });
};

const getCountryData = function (countries) {
  console.log(countries);

  countries.forEach((countryCode) => {
    const request = new XMLHttpRequest();
    request.open(
      "GET",
      `https://restcountries.eu/rest/v2/alpha?codes=${countryCode}`
    );
    request.send();
    request.addEventListener("load", function () {
      const [data] = JSON.parse(this.responseText);
      const html = `
        <article class="country">
          <img class="country__img" src="${data.flag}" width=300 height=200/>
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>
        `;

      container.insertAdjacentHTML("beforeend", html);
      container.style.opacity = 1;
    });
  });
  //
};
