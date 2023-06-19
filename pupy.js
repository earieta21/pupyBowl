const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = '2302-ACC-ET-WEB-PT-D';
const APIURL =`https://fsa-puppy-bowl.herokuapp.com/api/${2302-ACC-ET-WEB-PT-D}/`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + 'players');
    if (!response.ok) {
      throw new Error('Failed to fetch players');
    }
    const players = await response.json();
    return players;
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
    return [];
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + `players/${playerId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch player #${playerId}`);
    }
    const player = await response.json();
    return player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    return null;
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL + 'players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    if (!response.ok) {
      throw new Error('Failed to add player');
    }
    const newPlayer = await response.json();
    return newPlayer;
  } catch (err) {
    console.error('Oops, something went wrong with adding that player!', err);
    return null;
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + `players/${playerId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to remove player #${playerId}`);
    }
    return true;
  } catch (err) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    return false;
  }
};

const renderAllPlayers = (playerList) => {
  try {
    playerContainer.innerHTML = '';
    playerList.forEach((player) => {
      const playerCard = document.createElement('div');
      playerCard.classList.add('player-card');
      playerCard.innerHTML = `
        <h3>${player.name}</h3>
        <p>Age: ${player.age}</p>
        <p>Breed: ${player.breed}</p>
        <button class="details-button" data-player-id="${player.id}">See details</button>
        <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
      `;
      playerContainer.appendChild(playerCard);
    });

    const detailsButtons = document.querySelectorAll('.details-button');
    const removeButtons = document.querySelectorAll('.remove-button');

    detailsButtons.forEach((button) => {
      button.addEventListener('click', async (e) => {
        const playerId = e.target.dataset.playerId;
        const player = await fetchSinglePlayer(playerId);
        if (player) {
          // Handle displaying player details (e.g., show in a modal)
          console.log('Player details:', player);
        }
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener('click', async (e) => {
        const playerId = e.target.dataset.playerId;
        const removed = await removePlayer(playerId);
        if (removed) {
          // Remove player card from the DOM
          e.target.parentNode.remove();
        }
      });
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};

const renderNewPlayerForm = () => {
  try {
    const form = document.createElement('form');
    form.innerHTML = `
      <input type="text" id="name-input" placeholder="Name" required>
      <input type="number" id="age-input" placeholder="Age" required>
      <input type="text" id="breed-input" placeholder="Breed" required>
      <button type="submit">Add Player</button>
    `;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name-input');
      const ageInput = document.getElementById('age-input');
      const breedInput = document.getElementById('breed-input');

      const newPlayer = {
        name: nameInput.value,
        age: parseInt(ageInput.value),
        breed: breedInput.value,
      };

      const addedPlayer = await addNewPlayer(newPlayer);
      if (addedPlayer) {
        nameInput.value = '';
        ageInput.value = '';
        breedInput.value = '';
        const updatedPlayers = await fetchAllPlayers();
        renderAllPlayers(updatedPlayers);
      }
    });

    newPlayerFormContainer.appendChild(form);
  } catch (err) {
    console.error('Uh oh, trouble rendering the new player form!', err);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();
