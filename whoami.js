let year = parseInt(document.getElementById("year").value);
let arena = parseInt(document.getElementById("arena").value);
const allCards = [];
const visitedIndexes = new Set();
let completeGame = false;
const arenas = {
    18: "Silent Sanctuary",
    17: "Royal Crypt",
    16: "Executioner's Kitchen",
    15: "Miner's Mine",
    14: "Serenity Peak",
    13: "Rascal's Hideout",
    12: "Spooky Town",
    11: "Electro Valley",
    10: "Hog Mountain",
    9: "Jungle Arena",
    8: "Frozen Peak",
    7: "Royal Arena",
    6: "P.E.K.K.A's Playhouse",
    5: "Builder's Workshop",
    4: "Spell Valley",
    3: "Barbarian Bowl",
    2: "Bone Pit",
    1: "Goblin Stadium",
    0: "Training Camp"
};


document.getElementById("year").addEventListener("change", (event) => {
    year = parseInt(event.target.value);
    if (year < 2023) {
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
    document.getElementById("card-arena").textContent = `${arenas[card.arena]} (${card.arena})`;
    document.getElementById("card-year").textContent = `${card.year}`;
    document.getElementById("game-screen").style.display = "block";
    if (card.name === "Mirror") {
        document.getElementById("card-elixir").textContent = `? elixir`;
    } else {
        document.getElementById("card-elixir").textContent = `${card.elixirCost} elixir`;
    }
    document.getElementById("cards-left").textContent = `${allCards.length - visitedIndexes.size} cards left`;
}



document.getElementById("next-card").addEventListener("click", nextCard);

const keys = ["n", "N", " ", "Enter", "ArrowRight"];
document.addEventListener("keydown", (event) => {
    if (keys.includes(event.key) && document.getElementById("game-screen").style.display === "block") {
        nextCard();
    }
});