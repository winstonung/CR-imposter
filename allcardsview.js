let allCards = {};
let years = {
    2016: [],
    2017: [],
    2018: [],
    2019: [],
    2020: [],
    2021: [],
    2022: [],
    2023: [],
    2024: [],
    2025: []
};
const container = document.getElementById("container");

let selectedShowUsed = document.getElementById("show-used").value;
let selectedSortBy = document.getElementById("sort-by").value;
let showYears = document.getElementById("show-years").textContent === "Yes";
let sortOrder = document.getElementById("sort-order").textContent.trim();
let highlightCards = document.getElementById("obtainable-indicator").textContent === "Yes";
let standardView = document.getElementById("standard-view").textContent === "Standard view";

document.getElementById("show-years").addEventListener("click", () => {
    if (document.getElementById("show-years").textContent === "Yes") {
        document.getElementById("show-years").textContent = "No";
    } else {
        document.getElementById("show-years").textContent = "Yes";
    }
});

document.getElementById("obtainable-indicator").addEventListener("click", () => {
    if (document.getElementById("obtainable-indicator").textContent === "Yes") {
        document.getElementById("obtainable-indicator").textContent = "No";
    } else {
        document.getElementById("obtainable-indicator").textContent = "Yes";
    }
});

document.getElementById("sort-order").addEventListener("click", (event) => {
    if (sortOrder === "Ascending") {
        sortOrder = "Descending";
        event.target.textContent = "Descending";
    } else {
        sortOrder = "Ascending";
        event.target.textContent = "Ascending";
    }
    renderGroup();
});


document.getElementById("standard-view").addEventListener("click", () => {
    if (document.getElementById("standard-view").textContent === "Standard view") {
        document.getElementById("standard-view").textContent = "Compact view";

    } else {
        document.getElementById("standard-view").textContent = "Standard view";
    }
    standardView = (document.getElementById("standard-view").textContent === "Standard view");
    renderGroup();
});

fetch("allcards.json")
    .then(response => response.json())
    .then(cardsData => {
        cardsData.items.forEach(card => {
            allCards[card.name] = card;
            allCards[card.name].inGroup = false; // Initialize inGroup property
        });

        // Wait for groups.json to load
        fetch("groups.json")
            .then(response => response.json())
            .then(data => {
                data.groups.forEach(group => {
                    group.cards.forEach(card => {
                        allCards[card.name].inGroup = true;
                    });
                });

                // Only now assign to years and render
                Object.values(allCards).forEach(card => {
                    years[card.year].push(card);
                });
                renderGroup();
            })
            .catch(err => console.error("Error loading groups.json:", err));
    })
    .catch(err => console.error("Error loading allcards.json:", err));


function renderGroup() {
    container.innerHTML = ""; // clear first
    let dataToRender;

    if (showYears) {
        dataToRender = years;
    } else {
        dataToRender = { "All Cards": Object.values(allCards) };
    }

    Object.keys(dataToRender).forEach((group) => {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("group");

        const title = document.createElement("h2");
        title.textContent = group;
        groupDiv.appendChild(title);

        // cards
        const cardsDiv = document.createElement("div");
        cardsDiv.classList.add("cards");

        sortBy(dataToRender[group], selectedSortBy);

        dataToRender[group].forEach(card => {
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
            if (standardView) {
                cardDiv.classList.add("card");
                if (card.name === "Mirror") {
                    cardDiv.innerHTML = `
                        <img src="${card.iconUrls.medium}" alt="${card.name}">
                        <p class="two-lines"><strong>${card.name}</strong></p>
                        <p style="color: ${colour}" class="two-lines">${card.rarity} ${card.type}</p>
                        <p style="color: #da52f2">Elixir: ?</p>
                    ` ;
                } else {
                    cardDiv.innerHTML = `
                        <img src="${card.iconUrls.medium}" alt="${card.name}">
                        <p class="two-lines"><strong>${card.name}</strong></p>
                        <p style="color: ${colour}" class="two-lines">${card.rarity} ${card.type}</p>
                        <p style="color: #da52f2">Elixir: ${card.elixirCost}</p>
                    `;
                }
            } else {
                cardDiv.classList.add("compact-card");
                cardDiv.innerHTML = `
                    <img src="${card.iconUrls.medium}" alt="${card.name}">
                `;
            }
            if (!showYears && standardView){
                cardDiv.insertAdjacentHTML("beforeend", `<p>${card.year}</p>`);
            }
            if (highlightCards) {
                if (allCards[card.name].inGroup) {
                    cardDiv.style.backgroundColor = "#2ecb53ff";
                } else {
                    cardDiv.style.backgroundColor = "#cb2e2eff";
                }
            }

            cardDiv.addEventListener("click", () => {
                window.open(`https://clashroyale.fandom.com/wiki/${card.name.replace(/\s+/g, "_")}`, "_blank");
            });

            if (selectedShowUsed === "all") {
                cardsDiv.appendChild(cardDiv);
            } else if (selectedShowUsed === "in-group" && card.inGroup) {
                cardsDiv.appendChild(cardDiv);
            } else if (selectedShowUsed === "not-in-group" && !card.inGroup) {
                cardsDiv.appendChild(cardDiv);
            }
        });
        groupDiv.appendChild(cardsDiv);

        container.appendChild(groupDiv);
    });
}

function sortBy(arr, order = "rarity") {
    const rarityOrder = ["common", "rare", "epic", "legendary", "champion"];
    const typeOrder = ["troop", "spell", "building"];

    let multiplier = 1;
    if (sortOrder === "Descending") {
        multiplier = -1;
    }

    // Define a single sort function
    const sortFunction = (a, b) => {
        if (order === "rarity") {
            return (rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity) ||
                a.elixirCost - b.elixirCost ||
                a.arena - b.arena ||
                Object.keys(allCards).indexOf(a.name) - Object.keys(allCards).indexOf(b.name)) * multiplier;
        };
        if (order === "name") return a.name.localeCompare(b.name) * multiplier;
        if (order === "elixir") {
            return (a.elixirCost - b.elixirCost  ||
                a.arena - b.arena ||
                rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity) ||
                Object.keys(allCards).indexOf(a.name) - Object.keys(allCards).indexOf(b.name)) * multiplier;
        }
        if (order === "arena") {
            return (a.arena - b.arena ||
                rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity) ||
                Object.keys(allCards).indexOf(a.name) - Object.keys(allCards).indexOf(b.name)) * multiplier;
        }
        return 0;
    };

    arr.sort(sortFunction);
}


document.getElementById("show-used").addEventListener("change", (event) => {
    selectedShowUsed = event.target.value;
    renderGroup();
});

document.getElementById("sort-by").addEventListener("change", (event) => {
    selectedSortBy = event.target.value;
    renderGroup();
});

document.getElementById("show-years").addEventListener("click", (event) => {
    showYears = event.target.textContent === "Yes";
    renderGroup();
});

document.getElementById("obtainable-indicator").addEventListener("click", (event) => {
    highlightCards = event.target.textContent === "Yes";
    renderGroup();
});

// const randomCard = document.getElementById("random-card");
// randomCard.addEventListener("click", () => {
//     let card = allCards[Object.keys(allCards)[Math.floor(Math.random() * Object.keys(allCards).length)]];
//     let colour = "";
//         switch (card.rarity) {
//             case "common":
//                 colour = "#888888";
//                 break;
//             case "rare":
//                 colour = "#f2a843";
//                 break;
//             case "epic":
//                 colour = "#a421ad";
//                 break;
//             case "legendary":
//                 colour = "#73cbfa";
//                 break;
//             case "champion":
//                 colour = "#f6c543";
//                 break;
//             default:
//                 colour = "#ffffff";
//         }
//     if (card.name === "Mirror") {
//         randomCard.innerHTML = `
//             <img src="${card.iconUrls.medium}" alt="${card.name}">
//             <p class="two-lines"><strong>${card.name}</strong></p>
//             <p style="color: ${colour}" class="two-lines">${card.rarity} ${card.type}</p>
//             <p style="color: #da52f2">Elixir: ?</p>
//             <p>${card.year}</p>
//         `  ;
//     } else {
//         randomCard.innerHTML = `
//             <img src="${card.iconUrls.medium}" alt="${card.name}">
//             <p class="two-lines"><strong>${card.name}</strong></p>
//             <p style="color: ${colour}" class="two-lines">${card.rarity} ${card.type}</p>
//             <p style="color: #da52f2">Elixir: ${card.elixirCost}</p>
//             <p>${card.year}</p>
//     `;
//     }
// });