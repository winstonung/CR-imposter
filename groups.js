let data = {};
let allCards = [];

// Load groups.json
fetch("groups.json")
    .then(response => response.json())
    .then(data_ => {
        data = data_;
        renderGroups(data);
    })
    .catch(err => console.error("Error loading groups.json:", err));

// Load allcards.json
fetch("allcards.json")
    .then(response => response.json())
    .then(cardsData => {
        allCards = cardsData.items;
    })
    .catch(err => console.error("Error loading allcards.json:", err));

const overlay = document.getElementById("overlay");
const overlaySelect = document.getElementById("overlayCardSelect");
const confirmBtn = document.getElementById("overlayConfirmBtn");
const cancelBtn = document.getElementById("overlayCancelBtn");

function normalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ""); // strip punctuation, dots, spaces
}
const searchInput = document.getElementById("cardSearch");
const resultsDiv = document.getElementById("searchResults");
let newCard = null;
let currentindex = -1;
let queriedCards = [];

// show overlay
function showOverlay(cards, index) {
    currentindex = index;
    searchInput.addEventListener("input", () => {
        const query = normalize(searchInput.value);
        resultsDiv.innerHTML = ""; // clear old results
        queriedCards = [];

        if (query.length === 0) return;

        for (let key in cards) {
            const card = cards[key];
            if (normalize(card.name).includes(query)) {
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("search-card");

                cardDiv.innerHTML = `
                    <img src="${card.iconUrls.medium}" alt="${card.name}">
                    <span>${card.name}</span>
                `;

                // ✅ Make the result clickable
                cardDiv.addEventListener("click", () => {
                    clickedCardFromSearch(card);
                });

                resultsDiv.appendChild(cardDiv);
                queriedCards.push(card);
            }
        }
    });


    let selectedIndex = -1;
    // Keyboard navigation
    searchInput.addEventListener("keydown", (e) => {
        const results = resultsDiv.querySelectorAll(".search-card");
        if (!results.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % results.length;
            updateSelection(results);
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + results.length) % results.length;
            updateSelection(results);
        }
        else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex === -1) selectedIndex = 0;
            if (selectedIndex >= 0) {
                clickedCardFromSearch(queriedCards[selectedIndex]);
                selectedIndex = -1; // reset selection
            }
        }
    });

    function updateSelection(items) {
        items.forEach(item => item.classList.remove("selected"));
        if (selectedIndex >= 0) {
            items[selectedIndex].classList.add("selected");
            items[selectedIndex].scrollIntoView({ block: "nearest" });
        }
    }

    function clickedCardFromSearch(card) {

        newCard = {
            "name": card.name,
            "rarity": card.rarity,
            "type": card.type,
            "elixir": card.elixirCost,
            "iconURL": card.iconUrls.medium,
            "year": card.year
        }

        document.getElementById("cardPreview").style.display = "block";
        document.getElementById("cardPreview").src = newCard.iconURL;

        // Clear search input and results
        searchInput.value = "";
        resultsDiv.innerHTML = "";
    }
    overlay.classList.remove("hidden");
}

// hide overlay
function hideOverlay() {
    document.getElementById("cardPreview").style.display = "none";
    document.getElementById("cardPreview").src = "";
    overlay.classList.add("hidden");
}

// confirm selection
confirmBtn.addEventListener("click", () => {
    data.groups[currentindex].cards.push(newCard);
    renderGroups(data);
    newCard = null;
    currentindex = -1;
    document.getElementById("cardPreview").style.display = "none";
    document.getElementById("cardPreview").src = "";
    hideOverlay();
});

// cancel button
cancelBtn.addEventListener("click", hideOverlay);
const container = document.getElementById("groupsContainer");
const groupForm = document.getElementById("groupForm");
const submitGroupBtn = document.getElementById("submitGroupBtn");

// --- Render Groups ---
function renderGroups(data) {
    container.innerHTML = ""; // clear first
    data.groups.forEach((group, idx) => {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("group");

        const title = document.createElement("h2");
        title.textContent = group.name;
        groupDiv.appendChild(title);

        // cards
        const cardsDiv = document.createElement("div");
        cardsDiv.classList.add("cards");

        group.cards.forEach(card => {
            const cardDiv = document.createElement("div");
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
            cardDiv.classList.add("card");
            cardDiv.innerHTML = `
                <img src="${card.iconURL}" alt="${card.name}">
                <p class="two-lines"><strong>${card.name}</strong></p>
                <p style="color: ${colour}" class="two-lines">${card.rarity} ${card.type}</p>
                <p style="color: #da52f2">Elixir: ${card.elixir}</p>
                <p>${card.year}</p>
            `;
            cardsDiv.appendChild(cardDiv);
            cardDiv.addEventListener("click", () => {
                if (confirm(`Are you sure you want to remove ${card.name}?`)) {
                    data.groups[idx].cards.splice(data.groups[idx].cards.indexOf(card), 1);
                    renderGroups(data);
                }

            });
        });

        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.id = `new-card-${group.name}`;
        cardDiv.innerHTML = `
            <img src="images/add.png" alt="add">
            <p><strong>Add new card</strong></p>
        `;
        cardsDiv.appendChild(cardDiv);
        cardDiv.addEventListener("click", () => {
            showOverlay(allCards, idx);
        });

        groupDiv.appendChild(cardsDiv);

        container.appendChild(groupDiv);
    });
}

document.getElementById("submitGroupBtn").addEventListener("click", () => {
    const groupName = document.getElementById("groupName").value.trim();
    if (groupName.length === 0) {
        alert("Group name cannot be empty.");
        return;
    }
    data.groups.push({ name: groupName, cards: [] });
    document.getElementById("groupName").value = "";
    renderGroups(data);
});

// --- Export to JSON ---
document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "groups.json";
    a.click();
    URL.revokeObjectURL(url);
});


window.addEventListener("beforeunload", function (e) {
    // Show confirmation dialog
    e.preventDefault(); // some browsers require this
    e.returnValue = ""; // standard way
});
