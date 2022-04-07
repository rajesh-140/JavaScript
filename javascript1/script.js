import "./styles.css";
import axios from "axios";

/*
- filter records based on name [ array filter ] ✔️
    - show number of records found ✔️
    - 0 records found if none✔️
- display the avg age of the person who are displayed [ array reduce ]✔️
- add a button/radio to filter by male, female✔️
- select dropdown, choose sort [ by age, by name, ]🕕
- filter between two dates, with a date picker.🕕
*/

const btn = document.getElementById("btn");
const load = document.getElementById("loading");
const searchBar = document.getElementById("searchbar");
const male = document.getElementById("male");
const female = document.getElementById("female");
const reset = document.getElementById("reset");
const ageavg = document.getElementById("ageavg");
const applybtn = document.getElementById("applybtn");
const totalno = document.getElementById("totalno");
const select = document.querySelector("select");

let results = [];
let resultsFound = 0;

// const name = document.getElementById("name");
// const email = document.getElementById("email");
// const dob = document.getElementById("dob");



const debounce = (func, wait) => {  
  let debounceTimer  
  return function() {  
      const context = this  
      const args = arguments  
          clearTimeout(debounceTimer)  
              debounceTimer  
          = setTimeout(() => func.apply(context, args), wait)  
  }  
}  




function loadUsers() {
  let createUsers = function (path) {
    axios
      .get(path)
      .then(function (response) {
        console.log(response);
        results = response.data.results;
        console.log(results);

        results.forEach((user) => {
          displayusers(user);
        });
      })

      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});
  };
  createUsers("https://randomuser.me/api/?results=25");
}

loadUsers();

function createUserElements(element) {
  return document.createElement(element);
}

function append(parent, element) {
  return parent.append(element);
}

function displayusers(user) {
  let list = createUserElements("list"),
    img = createUserElements("img"),
    p = createUserElements("p"),
    p1 = createUserElements("p1"),
    div = createUserElements("div");

  list.className = "list";

  img.src = user.picture.large;
  p.innerHTML = `${user.name.first} ${user.name.last}`;
  p1.innerHTML = `${user.email}`;
  div.innerHTML = `${user.dob.age} ${user.dob.date}`;

  append(list, img);
  append(list, p);
  append(list, p1);
  append(list, div);
  append(document.querySelector(".card"), list);
}

btn.addEventListener("click", function () {
  load.innerText = "loading.....";

  setTimeout(function () {
    loadUsers();
    load.innerText = " ";
  }, 2000);
});

function removeAllUsers() {
  let a = document.getElementsByClassName("list");
  console.log(a);
  while (a.length > 0) {
    a[0].parentNode.removeChild(a[0]);
  }
}

searchBar.addEventListener("keyup", debounce((e) => {
  const value = e.target.value.toLowerCase();
  console.log(e.target.value);
  const searchedUsers = results.filter(
    (user) =>
      user.name.first.toLowerCase().includes(value.toLowerCase()) ||
      user.name.last.toLowerCase().includes(value.toLowerCase())
  );

  totalno.innerText = ` ${searchedUsers.length} results found`;
  console.log(searchedUsers);

  removeAllUsers();
  searchedUsers.forEach((user) => {
    displayusers(user);
  });
}, 2000));

male.addEventListener("click", function () {
  const filteredmale = results.filter((user) => user.gender === "male");

  console.log(filteredmale);

  totalno.innerText = ` ${filteredmale.length} results found`;

  removeAllUsers();
  filteredmale.forEach((user) => {
    displayusers(user);
    avg_age(filteredmale);
  });
});

female.addEventListener("click", function () {
  const filteredusers = results.filter((user) => user.gender === "female");
  console.log(filteredusers);
  totalno.innerText = `  ${filteredusers.length}  results found`;
  console.log(filteredusers.length);

  removeAllUsers();
  filteredusers.forEach((user) => {
    displayusers(user);
    avg_age(filteredusers);
  });
});

applybtn.addEventListener("click", function () {
  const filteredage = results.filter(
    (user) =>
      user.dob.date >= document.getElementById("fromdate").value &&
      user.dob.date <= document.getElementById("todate").value
  );

  console.log(filteredage);

  totalno.innerText = ` ${filteredage.length} results found`;

  removeAllUsers();
  filteredage.forEach((user) => {
    displayusers(user);
  });
});

function agesort() {
  let agesort = results.sort((a, b) => a.dob.age - b.dob.age);

  console.log(agesort);

  removeAllUsers();
  agesort.forEach((user) => {
    displayusers(user);
  });
}

function namesort() {
  let namesort = results.sort((a, b) => {
    let name_a = a.name.first.toLowerCase(),
      name_b = b.name.first.toLowerCase();

    if (name_a < name_b) {
      return -1;
    }
    if (name_a > name_b) {
      return 1;
    }
    return 0;
  });

  console.log(namesort);

  removeAllUsers();
  namesort.forEach((user) => {
    displayusers(user);
  });
}

function countrysort() {
  let countrysort = results.sort((a, b) => {
    let country_a = a.location.country.toLowerCase(),
      country_b = b.location.country.toLowerCase();

    if (country_a < country_b) {
      return -1;
    }
    if (country_a > country_b) {
      return 1;
    }
    return 0;
  });

  console.log(countrysort);

  removeAllUsers();
  countrysort.forEach((user) => {
    displayusers(user);
  });
}

select.addEventListener("change", (e) => {
  // if (select.options[1]) {
  //   namesort();
  // } else if (select.options[2]) {
  //   agesort();
  // }
  let value = e.target.value;
  if (value === "name") {
    namesort();
  } else if (value === "age") {
    agesort();
  } else if (value === "country") {
    countrysort();
  }
});

reset.addEventListener("click", function () {
  totalno.innerText = "";
  ageavg.innerText = "";
  document.getElementById("fromdate").value = "dd-mm-yyyy";
  document.getElementById("todate").value = "dd-mm-yyyy";
  select.value = "--Sort by--";
  male.checked = false;
  female.checked = false;

  removeAllUsers();

  results.forEach((user) => {
    displayusers(user);
  });
});

function avg_age(array) {
  const agearray = array.map((index) => index.dob.age);

  const arraylength = agearray.length;
  const sumOfAge = agearray.reduce((pv, cv) => pv + cv, 0);
  console.log(sumOfAge);
  const avgage = Math.floor(sumOfAge / arraylength);

  console.log(avgage);
  ageavg.innerText = ` ${avgage} is the average age`;
}
