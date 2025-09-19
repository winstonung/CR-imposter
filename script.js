let numPlayers = 0;
let numImposters = 0;
let imposterKnowsTheyreImposter = true;
let latestYear = 2025;

let group = {};
let cardData = {};
let civillianCard = {};
let imposterCard = null;

let impostersIndexes = [];

document.getElementById("start-button").addEventListener("click", () => {
    numPlayers = parseInt(document.getElementById("num-players").value);
    numImposters = parseInt(document.getElementById("num-imposters").value);
    imposterKnowsTheyreImposter = document.getElementById("imposter-knows").checked;
    latestYear = parseInt(document.getElementById("latest-year").value);

    if (numImposters >= numPlayers) {
        alert("Number of imposters must be less than number of players.");
        return;
    }

    if (numPlayers < 3) {
        alert("Number of players must be at least 3.");
        return;
    }

    if (numImposters < 1) {
        alert("There must be at least one imposter.");
        return;
    }

    document.getElementById("title-screen").style.display = "none";
    generateGame();
});

// generate random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomFromArray(arr) {
    return arr[getRandomInt(0, arr.length)];
}

function generateGame() {
    fetch('groups.json')
        .then(response => response.json())
        .then(data => {
            while (true) {
                group = getRandomFromArray(data.groups);
                if (group.name === "champions" && latestYear < 2021) {
                    continue;
                }
                break;
            }
            cardData = data.cards;
            while (true) {
                while (true) {
                    civillianCard = getRandomFromArray(group.cards);
                    if (civillianCard.year <= latestYear) {
                        break;
                    }
                }
                if (!imposterKnowsTheyreImposter) {
                    while (true) {
                        imposterCard = getRandomFromArray(group.cards);
                        if (imposterCard.year <= latestYear) {
                            break;
                        }
                    }
                    if (imposterCard.name !== civillianCard.name) {
                        break;
                    }
                } else {
                    break;
                }
            }

            while (true) {
                let num = getRandomInt(0, numPlayers);
                console.log(num);
                if (!impostersIndexes.includes(num)) {
                    impostersIndexes.push(num);
                    if (impostersIndexes.length >= numImposters) {
                        console.log(impostersIndexes);
                        break;
                    }
                }
            }
            showInstructions1();
        });
}

index = 0;

function showInstructions1() {
    document.getElementById("title-screen").style.display = "none";
    document.getElementById("instruction-screen2").style.display = "none";
    document.getElementById("instruction-screen1").style.display = "block";
    document.getElementById("instructions1-text").innerText = `You are Player ${index + 1}. When you're ready, click "Show Card".`;
}

function showCard() {
    document.getElementById("instruction-screen1").style.display = "none";
    document.getElementById("instruction-screen2").style.display = "none";
    document.getElementById("card-screen").style.display = "block";

    if (impostersIndexes.includes(index)) {
        if (!imposterKnowsTheyreImposter) {
            document.getElementById("card-title").innerText = `Your Card`;
            document.getElementById("card").style.display = "block";
            document.getElementById("card-icon").src = imposterCard.iconURL;
            document.getElementById("card-name").innerHTML = `<strong>${imposterCard.name}</strong>`;
            document.getElementById("rarity-type").innerText = `${imposterCard.rarity} ${imposterCard.type}`;
            switch (imposterCard.rarity) {
                case "common":
                    document.getElementById("rarity-type").style.color = "#808080";
                    break;
                case "rare":
                    document.getElementById("rarity-type").style.color = "#f2a843";
                    break;
                case "epic":
                    document.getElementById("rarity-type").style.color = "#a421ad";
                    break;
                case "legendary":
                    document.getElementById("rarity-type").style.color = "#73cbfa";
                    break;
                case "champion":
                    document.getElementById("rarity-type").style.color = "#f6c543";
                    break;
                default:
                    document.getElementById("rarity-type").style.color = "#ffffff";
            }
            document.getElementById("elixir").innerText = `${imposterCard.elixir} Elixir`;
            document.getElementById("suggestions").innerText = `Your aim is to convince everyone that you are NOT the imposter. You may have a different card to the civillians, but you may also have the same card as the civillians. Try to blend in and avoid suspicion!`;
        } else {
            document.getElementById("card-title").style.display = "block";
            document.getElementById("card").style.display = "block";
            document.getElementById("card-icon").src = "images/MysteryCard.png";
            document.getElementById("card-name").innerHTML = `<strong>No card</strong>`;
            document.getElementById("rarity-type").innerText = `No rarity - No type`;
            document.getElementById("rarity-type").style.color = "#ffffff";
            document.getElementById("elixir").innerText = `0 Elixir`;

            document.getElementById("card-title").innerText = `You are the imposter!`;
            document.getElementById("suggestions").innerText = `Your aim is to convince everyone that you are NOT the imposter. You do not know what the civillian card is, so try to blend in and avoid suspicion!`;
        }
    } else {
        document.getElementById("card-title").innerText = `Your Card`;            
        document.getElementById("card").style.display = "block";
        document.getElementById("card-icon").src = civillianCard.iconURL;
        document.getElementById("card-name").innerHTML = `<strong>${civillianCard.name}</strong>`;
        document.getElementById("rarity-type").innerText = `${civillianCard.rarity} ${civillianCard.type}`;
        switch (civillianCard.rarity) {
            case "common":
                document.getElementById("rarity-type").style.color = "#808080";
                break;
            case "rare":
                document.getElementById("rarity-type").style.color = "#f2a843";
                break;
            case "epic":
                document.getElementById("rarity-type").style.color = "#a421ad";
                break;
            case "legendary":
                document.getElementById("rarity-type").style.color = "#73cbfa";
                break;
            case "champion":
                document.getElementById("rarity-type").style.color = "#f6c543";
                break;
            default:
                document.getElementById("rarity-type").style.color = "#ffffff";
        }
        document.getElementById("elixir").innerText = `${civillianCard.elixir} Elixir`;
        if (!imposterKnowsTheyreImposter) {
            document.getElementById("suggestions").innerText = `Your aim is to convince everyone that you are NOT the imposter. You may have a different card to the civillians, but you may also have the same card as the civillians. Try to blend in and avoid suspicion!`;
        } else {
            document.getElementById("suggestions").innerText = `You are a civillian. Your aim is to find out who the imposter is! Try to spot who has a different card to you, and make sure to avoid letting the imposter(s) figure out your card!`;
        }
    }
}

function showInstructions2() {
    document.getElementById("card-screen").style.display = "none";
    document.getElementById("instruction-screen2").style.display = "block";
    document.getElementById("instructions2-text").innerText = `You are Player ${index + 1}. To view your card again, click "Show Card". Before you pass the phone to the next player, click "Next".`;
}

document.getElementById("instructions1-showcard").addEventListener("click", () => {
    showCard();
});

document.getElementById("card-screen-next").addEventListener("click", () => {
    showInstructions2();
});

document.getElementById("instructions2-showcard").addEventListener("click", () => {
    showCard();
});

document.getElementById("instructions2-next").addEventListener("click", () => {
    index++;
    if (index >= numPlayers) {
        alert("All players have seen their cards. The game is ready to start!");
        document.getElementById("instructions2-showcard").style.display = "none";
    } else {
        showInstructions1();
    }
});
