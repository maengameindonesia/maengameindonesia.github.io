// Store the selected game globally so submitForm() can access it
let selectedGame = null;

document.addEventListener("DOMContentLoaded", () => {
  const gameList = document.getElementById("game-list");
  const gameTitle = document.getElementById("game-title");
  const gameImage = document.getElementById("game-image");
  const gameDescription = document.getElementById("game-description");
  const gameRewards = document.getElementById("game-rewards");

  fetch("data.json")
    .then((response) => response.json())
    .then((games) => {
      // Home page game list
      if (gameList) {
        games.forEach((game) => {
          let totalEarning = 0;
          let currency = '';

          if (Array.isArray(game.rewards) && game.rewards.length > 0) {
            totalEarning = game.rewards.reduce((sum, r) => sum + r.number, 0);
            currency = game.rewards[0].currency || '';
          }

          const card = document.createElement("div");
          card.className = "game-card";
          card.innerHTML = `
            <a href="game-detail.html?id=${game.id}">
              <img src="${game.image}" alt="${game.title}" class="game-image"/>
            </a>
            <div class="game-title">${game.title}</div>
            
            <div class="max-earning">Dapatkan hingga ${currency}${new Intl.NumberFormat('en-US').format(totalEarning)}</div>

            <button class="play-button" onclick="location.href='game-detail.html?id=${game.id}'">
              Lebih detil dan mainkan
            </button>
          `;
          gameList.appendChild(card);
        });
      }

      // === Detail page ===
      const params = new URLSearchParams(window.location.search);
      const gameId = params.get('id');

      if (gameId && gameTitle && gameDescription && gameRewards) {
        selectedGame = games.find(g => g.id === gameId);
        if (selectedGame) {
          gameTitle.textContent = selectedGame.title;
          if (gameImage) gameImage.src = selectedGame.image;
          gameDescription.textContent = selectedGame.description;

          let totalEarning = 0;
          let currency = '';
          if (Array.isArray(selectedGame.rewards) && selectedGame.rewards.length > 0) {
            totalEarning = selectedGame.rewards.reduce((sum, r) => sum + r.number, 0);
            currency = selectedGame.rewards[0].currency || '';
          }

          document.getElementById("game-id").textContent = selectedGame.id;
          document.getElementById("dead-line").textContent = selectedGame.deadline;
          
          // document.getElementById("total-earning").textContent = `${currency}${totalEarning.toFixed(0)}`;
          document.getElementById("total-earning").textContent = `${currency}${new Intl.NumberFormat('en-US').format(totalEarning)}`;


          selectedGame.rewards.forEach(reward => {
            const li = document.createElement('li');
            li.textContent = `${reward.currency}${new Intl.NumberFormat('en-US').format(reward.number)} <----> ${reward.level}`;
            gameRewards.appendChild(li);
          });
        }
      }
      // === End of Detail page ===
      
    });
});
