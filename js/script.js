 function myFunction() {
        var element = document.body;
        element.classList.toggle("dark-mode");
    }

    function Grading(points)
    {
        if (points < 2)
        {
          Grade="A";
        }
        else if (points < 4)
        {
                Grade="A+";
        }
        else if (points < 6)
        {
                Grade="A++";
        }
        else if (points < 8)
        {
                Grade="S"
        }
        else if (points < 10)
        {
                Grade="S+";
        }
    return Grade;
    }

class finder
{
    async fetchUsers(user,c,load)
        {
            let loader = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
            document.getElementById(load).innerHTML = loader;
            const profile = await fetch(`https://api.github.com/users/${user}`)
            const data = await profile.json() ;

            document.getElementById(load).innerHTML = "";
            if(data.message)
                {
                    document.getElementById(load).innerHTML = `<br/><b style="color: red;">User Not Found</b>`;
                }
            else
                {
                    const repositories = await fetch(data.repos_url);
                    const repos = await repositories.json();

                    if (data)
                        {
                            this.deletedata(c)
                            this.addUserToList(data,repos,c)
                        }
                }
        }

    addUserToList(data,repos,c)
        {
            const list = document.querySelector(c);
            const table = document.createElement('table');
            table.className="table border table-striped mt-5";
            let stars = 0
            // defining user points on the scale of 10 //
            var points=(((data.public_repos+stars)/2)/50)*10
            var Grade = Grading(points)

            for( var i = 0;i<repos.length;i+=1)
                {
                    stars += repos[i].watchers_count
                }

        table.innerHTML = `
                <div id="class">
                <div class="user-image">
                    <img src="${data.avatar_url}" alt="" id = "profile-pic">
                </div>
                <tr>
                <td style="color:chocolate;"><b>Name :</b> ${data.name}</td>
                </tr>

                <tr>
                    <td style="color:chocolate;"><b>About:</b> ${data.bio} </td>
                </tr>
                ${ (data.blog)?`<tr><td><a style="color:chocolate;" href="${data.blog}" href="_blank"><b>Custom Site:</b> ${data.blog} </td></tr>`:"" }

                <tr>
                    <td style="color:chocolate;"><b>Location :</b> ${data.location} </td>
                </tr>

                <tr>
                    <td style="color:chocolate;"><a href="${data.html_url}?tab=followers"><b>Followers :</b> ${data.followers}</a></td>
                </tr>

                <tr>
                    <td style="color:chocolate;"><a href="${data.html_url}?tab=following"><b>Following :</b> ${data.following}</a></td>
                </tr>

                <tr>
                    <td style="color:chocolate;"><a href="${data.html_url}?tab=repositories"><b>Total Repositories :</b> ${data.public_repos}</a></td>
                </tr>

                <tr>
                    <td style="color:chocolate;"><a href="${data.html_url}?tab=stars"><b>Total Stars :</b> ${stars}</a></td>
                </tr>

                <tr>
                    <td style="color:chocolate;"><b>GitHub Grade :</b> ${Grade}</td>
                </tr

                <tr>
                    <td style="color:chocolate;"><b>Github Url :</b> <a href="${data.html_url}" target="_blank">${data.html_url}</a></td> <!--added target="_blank"-->
                </tr>
                </div>
            `;

            list.appendChild(table);
        }

    deletedata(c)
        {
            var e = document.querySelector(c);
            var child = e.lastElementChild;
            e.removeChild(child)
        }
}

const debounce = (func,delay) => {
    let timer;
    return function(...args){
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout( () => {
        func(...args)
      },delay)
} }

const search = document.getElementById('username');
const search1 = document.getElementById('username1');
let users;

// FIlter states
async function searchUser(searchText,id,search,clear){
    const matchList = document.getElementById(id);
    if(searchText !== "")
    {
        const res =  await fetch(`https://api.github.com/search/users?q=${searchText}`);
        users = await res.json();
        if(users.total_count === 0)
        {
            matchList.innerHTML = ""
        }
        else
        {
            let matches;
            matches = users.items.filter(user => {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return user.login.match(regex);
            });

            const html = matches.slice(0,6).map(match => `<div class="autocomplete">
            <p style="padding-top: 15px;font-weight:600"><img class="img" src=${match.avatar_url} alt=${match.avatar_url}/> ${match.login}</p>
            </div>`).join('');
            matchList.innerHTML = html;
            matchList.addEventListener('click', (e) => {
            search.value = e.target.textContent.trim();
            matchList.style.display = "none";
            matchList.innerHTML = ""
            })
            matchList.style.display = "block";
        }
    }
    else
    {
        matchList.innerHTML = ""
    }
    document.getElementById(clear).addEventListener('click', () => {
        matchList.innerHTML = ""
        })
}

search.addEventListener('input', debounce( () => searchUser(search.value,"match-list",search,"clear"),600));
search1.addEventListener('input', debounce( () => searchUser(search1.value,"match-list1",search1,"clear1"),600));

const git = new finder();

document.querySelector('#user-form').addEventListener('submit', (e) =>
{
    e.preventDefault();
    const c = '#user-form'
    const username = document.querySelector('#username').value
    git.fetchUsers(username,c,"loading")
});


document.querySelector('#user-form1').addEventListener('submit', (e) =>
{
    e.preventDefault();
    const c = '#user-form1'
    const username = document.querySelector('#username1').value
    git.fetchUsers(username,c,"loading1")
});

  function myFunct() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
