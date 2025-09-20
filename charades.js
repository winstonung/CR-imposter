let year = parseInt(document.getElementById("year").value);
let arena = parseInt(document.getElementById("arena").value);
const allCards = [];
const visitedIndexes = new Set();
let completeGame = false;


document.getElementById("year").addEventListener("change", (event) => {
    year = parseInt(event.target.value);
    if (year < 2025) {
        document.getElementById("arena-label").style.display = "none";
        document.getElementById("arena").style.display = "none";
    } else {
        document.getElementById("arena-label").style.display = "inline";
        document.getElementById("arena").style.display = "inline";
    }
});

document.getElementById("arena").addEventListener("change", (event) => {
    arena = parseInt(event.target.value);
});

document.getElementById("start").addEventListener("click", () => {
    fetch('allcards.json')
        .then(response => response.json())
        .then(data => {
            data.items.forEach(card => {
                if (card.year <= year && card.arena <= arena) {
                    allCards.push(card);
                }
            });
            startGame();
        });
});

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    nextCard();
}
function nextCard() {
    if (allCards.length === 0) {
        alert("No cards available for the selected year and arena.");
        return;
    }
    let card;

    while (true) {
        if (visitedIndexes.size === allCards.length) {
            completeGame = true;
            break;
        }
        const randomIndex = Math.floor(Math.random() * allCards.length);
        if (visitedIndexes.has(randomIndex)) continue;
        card = allCards[randomIndex];
        if (card.year <= year && card.arena <= arena) {
            visitedIndexes.add(randomIndex);
            console.log(visitedIndexes);
            break;
        }
    }

    if (completeGame) {
        alert("All cards have been shown! Game over.");
        document.getElementById("game-screen").style.display = "none";
        document.getElementById("start-screen").style.display = "block";
        visitedIndexes.clear();
        completeGame = false;
        return;
    }

    let colour = "";
        switch (card.rarity) {
            case "common":
                colour = "#888888";
                break;
            case "rare":
                colour = "#f2a843";
                break;
            case "epic":
                colour = "#a421ad";
                break;
            case "legendary":
                colour = "#73cbfa";
                break;
            case "champion":
                colour = "#f6c543";
                break;
            default:
                colour = "#ffffff";
        }
    document.getElementById("card-image").src = card.iconUrls.medium;
    document.getElementById("card-name").textContent = card.name;
    document.getElementById("card-rarity-type").textContent = `${card.rarity} ${card.type}`;
    document.getElementById("card-rarity-type").style.color = colour;
    document.getElementById("card-arena").textContent = `Arena ${card.arena}`;
    document.getElementById("card-year").textContent = `${card.year}`;
    document.getElementById("game-screen").style.display = "block";
    if (card.name === "Mirror") {
        document.getElementById("card-elixir").textContent = `? elixir`;
    } else {
        document.getElementById("card-elixir").textContent = `${card.elixirCost} elixir`;
    }
}



document.getElementById("next-card").addEventListener("click", nextCard);