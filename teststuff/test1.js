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
    if (card.year && card.type) {
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
    let troop = document.getElementById("Type").value;
    let year = document.getElementById("Year").value;

    getCurrentCard().type = troop;
    getCurrentCard().year = year;

    while (true) {
        currentIndex++;
        if (!cardHasDetails(getCurrentCard())) {
            break;
        }
    }
    displayCurrentCard();
});

document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({"items": allCards}, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "groupsTest1.json";
    a.click();
    URL.revokeObjectURL(url);
});