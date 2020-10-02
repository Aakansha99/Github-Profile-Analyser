function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

function Grading(points) {
  if (points < 2) {
    Grade = "A";
  } else if (points < 4) {
    Grade = "A+";
  } else if (points < 6) {
    Grade = "A++";
  } else if (points < 8) {
    Grade = "S";
  } else if (points < 10) {
    Grade = "S+";
  }
  return Grade;
}


function getGraph(){
  var ctx = document.getElementById('chart').getContext("2d");

var chart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Python", "JavaScript", "HTML", "CSS5", "C++"],
    datasets: [
      {
        label: "Languages You Know",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: ["red", "steelblue", "pink", "orange", "green"],
        data: [10, 20, 15, 19, 5],
      },
    ],
  },
  options: {
    responsive: false,
    legend: {
      display: true,
      labels: {
        fontColor: "black",
        boxWidth: 20,
      }
    }
  },
});
}

class finder {
  async fetchUsers(user, profileDiv, load) {
    const profile = await fetch(`https://api.github.com/users/${user}`);
    const data = await profile.json();
    console.log(data);
    document.getElementById(load).innerHTML = "";

    if (data.message) {
      profileDiv.innerHTML = `<br/><b style="color: red; font-size: 20px;">User Not Found</b>`;
    } else {
      const repositories = await fetch(data.repos_url);
      const repos = await repositories.json();

      profileDiv.innerHTML = "";

      if (data) {
        this.addUserToList(data, repos, profileDiv);
      }else{
        profileDiv.innerHTML = `<br/><b style="color: red; font-size: 20px;">No Data To Display</b>`;
      }
    }
  }

  addUserToList(data, repos,profileDiv) {

    let stars = 0;

    // defining user points on the scale of 10 //
    var points = ((data.public_repos + stars) / 2 / 50) * 10;
    var Grade = Grading(points);

    for (var i = 0; i < repos.length; i += 1) {
      stars += repos[i].watchers_count;
    }
    let profile_pic = `<img id = 'profile_pic' src = ${data.avatar_url}>`;
    let profile_name = `<div id = 'profile_name'><i><u>Name:</u></i> ${data.name}</div>`
    let profile_bio = `<div id = 'profile_bio'>~${data.bio}</div>`;
    let profile_location = `<div id = 'profile_location' class = 'item'><i><u>from</u>:</i> ${data.location}</div>`
    let profile_followers = `<div id = 'profile_followers' class = 'item'><i><u>followers</u>:</i> ${data.followers}</div>`
    let profile_following = `<div id = 'profile_following' class = 'item'><i><u>following</u>:</i> ${data.following}</div>`
    let profile_public_repos = `<div id = 'profile_public_repos' class = 'item'><i><u>Public Repos</u>:</i> ${data.public_repos}</div>`
    let profile_stars = `<div id = 'profile_stars' class = 'item'><i><u>Total Stars</u>:</i> ${stars}</div>`
    let profile_Grade = `<div id = 'profile_Grade' class = 'item'><i><u>Grade</u>:</i> ${Grade}</div>`
    let profile_URL = `<div id = 'profile_URL' class = 'item'><a href="${data.html_url}" target="_blank">${data.html_url}</a></div>`

    profileDiv.insertAdjacentHTML('beforeend', profile_pic);
    profileDiv.insertAdjacentHTML('beforeend', profile_name);
    if(data.bio)profileDiv.insertAdjacentHTML('beforeend', profile_bio);
    if(data.location)profileDiv.insertAdjacentHTML('beforeend', profile_location);
    profileDiv.insertAdjacentHTML('beforeend', profile_followers);
    profileDiv.insertAdjacentHTML('beforeend', profile_following);
    profileDiv.insertAdjacentHTML('beforeend', profile_public_repos);
    profileDiv.insertAdjacentHTML('beforeend', profile_stars);
    profileDiv.insertAdjacentHTML('beforeend', profile_Grade);
    profileDiv.insertAdjacentHTML('beforeend', profile_URL);
    getGraph();
}
}

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
var search = document.getElementById("username");
let users;


// FIlter states
async function searchUser(searchText, id, search) {
  const matchList = document.getElementById(id);
  if (searchText !== "") {
    const res = await fetch(
      `https://api.github.com/search/users?q=${searchText}`
    );
    users = await res.json();
    if (users.total_count === 0) {
      matchList.innerHTML = "";
    } else {
      let matches;
      matches = users.items.filter((user) => {
        const regex = new RegExp(`^${searchText}`, "gi");
        return user.login.match(regex);
      });

      const html = matches
        .slice(0, 5)
        .map(
          (match) => `<div class="autocomplete">
        <p style="padding-top: 15px;font-weight:600"><img class="img" src=${match.avatar_url}/> ${match.login}</p>
        </div>`
        )
        .join("");
      matchList.innerHTML = html;
      matchList.addEventListener("click", (e) => {
        search.value = e.target.textContent.trim();
        matchList.style.display = "none";
        matchList.innerHTML = "";
      });
      matchList.style.display = "block";
    }
  } else {
    matchList.innerHTML = "";
  }
}

search.addEventListener(
  "input",
  debounce(() => searchUser(search.value, "match-list", search), 600)
);

const git = new finder();

document.querySelector("#user-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const profileDiv = document.getElementById("profile");
  const username = document.querySelector("#username").value;
  git.fetchUsers(username, profileDiv, "loading");
});
