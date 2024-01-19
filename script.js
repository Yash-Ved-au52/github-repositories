let currentPage = 1;
const perPageOptions = [10, 25, 50, 100];
let perPage = perPageOptions[0];

function fetchRepositories() {
    const username = document.getElementById('username').value;
    const repositoriesContainer = document.getElementById('repositories-container');
    const loader = document.getElementById('loader');

    if(!username) 
    {
        alert('Please enter a valid Github username');
        return;
    }

    loader.style.display = 'block';

    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(repositories => {
            displayRepositories(repositories);
            displayPagination();
            loader.style.display = 'none';
        })
        .catch(error =>{
            console.error('Error fetching repositories', error);
            repositoriesContainer.innerHTML = '<p>Error fetching repositories</p>';
            loader.style.display = 'none';
        });
}
function displayRepositories(repositories) 
{
    const repositoriesContainer = document.getElementById('repositories-container');
    const repoDetailsContainer = document.getElementById('repo-details-container');
    repositoriesContainer.innerHTML = ''; // Clear previous content
    repoDetailsContainer.innerHTML = '';

    if(repositories.length === 0) 
    {
        repositoriesContainer.innerHTML = '<p>No repositories found</p>';
        return;
    }

    // Display owner details at the top
    const ownerDetails = document.createElement('div');
    ownerDetails.className = 'owner-details';
    ownerDetails.innerHTML = `
        <img src="${repositories[0].owner.avatar_url}" alt="Owner Avatar">
        <div class="owner-info">
        <h2>${repositories[0].owner.login}</h2>
        <p> ${repositories[0].owner.location || ''}</p>
        <p>URL: <a href="${repositories[0].owner.html_url}" target="_blank">${repositories[0].owner.html_url}</a></p>
        </div>`;

    repoDetailsContainer.appendChild(ownerDetails);

    repositories.forEach((repo, index) => {
        // Create a card for each repository
        const repoCard = document.createElement('div');
        repoCard.className = 'card';
        repoCard.innerHTML = `<div class="card-body">
                                <h3>${repo.name}</h3>
                                <p>${repo.description || 'No description available'}</p>
                                <p>Language: ${repo.language || 'Not specified'}</p>
                              </div>`;

        repositoriesContainer.appendChild(repoCard);
    });
}




function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(1000 / perPage);
    const maxDisplayPages = 9;

    const startPage = Math.max(1, currentPage - Math.floor(maxDisplayPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayPages - 1);

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.addEventListener('click', () => {
        if(currentPage > 1) 
        {
            currentPage--;
            fetchRepositories();
        }
    });
    paginationContainer.appendChild(prevButton);

    for(let i = startPage; i <= endPage; i++) 
    {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchRepositories();
        });

        if(i === currentPage) 
        {
            pageButton.classList.add('active');
        }

        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.addEventListener('click', () => {
        if(currentPage < totalPages)
        {
            currentPage++;
            fetchRepositories();
        }
    });
    paginationContainer.appendChild(nextButton);
}


