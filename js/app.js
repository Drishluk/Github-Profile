class githubSearch {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  getColorName() {
    const colorNum = Math.floor(Math.random() * (4 - 1) + 1);
    return colors[colorNum - 1];
  }

  async getUser(username) {
    try {
      const { data } = await axios(this.apiUrl + username);
      this.createUserCard(data);
      this.getRepos(username);
    } catch (err) {
      if (err.response.status == 404) {
        this.createErrorCard('No profile with this username');
      }
    }
  }

  async getRepos(username) {
    try {
      const { data } = await axios(this.apiUrl + username + '/repos?sort=created');
      this.addReposToCard(data);
    } catch (err) {
      this.createErrorCard('Problem fetching repos');
    }
  }

  createUserCard(user) {
    const userID = user.name ? `<h2>${user.name}</h2>` : '';
    const userlogin = user.login ? `<h2>${user.login}</h2>` : '';
    const userBio = user.bio ? `<p>${user.bio}</p>` : '';
    const color = this.getColorName();
    const cardHTML = `
                  <div class="card ${color.name}">
                      <div>
                          <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
                      </div>
                      <div class="user-info">
                      <div class="user-name">
                          ${userID} ${userlogin}
                      </div>
      
                      ${userBio}
                      
                      <ul>
                          <li>${user.followers} <strong>Followers</strong></li>
                          <li>${user.following} <strong>Following</strong></li>
                          <li>${user.public_repos} <strong>Repos</strong></li>
                      </ul>
                      <div id="repos"></div>
                      </div>
                  </div>
                  `;
    main.innerHTML = cardHTML;
  }

  createErrorCard(msg) {
    const cardHTML = `
                  <div class="card">
                      <h1>${msg}</h1>
                  </div>
                  `;
    main.innerHTML = cardHTML;
  }

  addReposToCard(repos) {
    const reposEl = document.getElementById('repos');
    repos.slice(0, 5).forEach((repo) => {
      const repoEl = document.createElement('a');
      repoEl.classList.add('repo');
      repoEl.href = repo.html_url;
      repoEl.target = '_blank';
      repoEl.innerText = repo.name;
      reposEl.appendChild(repoEl);
    });
  }
}

const APIURL = 'https://api.github.com/users/';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const colors = [
  {
    name: 'orange',
    color: '#FC4100',
  },
  {
    name: 'yellow',
    color: '#FFC55A',
  },
  {
    name: 'cyan',
    color: '#57A6A1',
  },
  {
    name: 'lightblue',
    color: '#4793AF',
  },
];

const githubSearchApp = new githubSearch(APIURL);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    githubSearchApp.getUser(user);
    search.value = '';
  }
});