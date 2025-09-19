let allCards = [];
// Load allcards.json
let currentIndex = -1;
fetch("allcards.json")
    .then(response => response.json())
    .then(cardsData => {
        allCards = cardsData.items;
        while (true) {
            currentIndex++;
            if (!cardHasDetails(getCurrentCard())) {
                console.log(currentIndex);
                break;
            }
        }
        displayCurrentCard();
    })
    .catch(err => console.error("Error loading allcards.json:", err));




function getCurrentCard() {
    return allCards[currentIndex];
}

function cardHasDetails(card) {
    if (card.arena >= 0) {
        return true;
    }
    return false;
}

function displayCurrentCard() {
    let card = getCurrentCard();
    document.getElementById("cardName").innerText = card.name;
    document.getElementById("cardImage").src = card.iconUrls.medium;
}

document.getElementById("save").addEventListener("click", () => {
    let arena = parseInt(document.getElementById("arena").value);

    getCurrentCard().arena = arena;

    while (true) {
        currentIndex++;
        if (!cardHasDetails(getCurrentCard())) {
            break;
        }
    }
    displayCurrentCard();
});


const arenaSelect = document.getElementById("arena");

document.addEventListener("keydown", (event) => {
    let currentIndex = arenaSelect.selectedIndex;

    if (event.key === "ArrowUp") {
        event.preventDefault();
        if (currentIndex > 0) {
            arenaSelect.selectedIndex = currentIndex - 1;
        }
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (currentIndex < arenaSelect.options.length - 1) {
            arenaSelect.selectedIndex = currentIndex + 1;
        }
    } else if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("save").click();
    }
});

document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({ "items": allCards }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "allCardsTest1.json";
    a.click();
    URL.revokeObjectURL(url);
});