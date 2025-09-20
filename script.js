let numPlayers = 0;
let numImposters = 0;
let imposterKnowsTheyreImposter = true;
let latestYear = 2025;

let group = {};
let cardData = {};
let civillianCard = {};
let imposterCard = null;

let impostersIndexes = [];

document.getElementById("decrease-players").addEventListener("click", () => {
    let currentValue = parseInt(document.getElementById("num-players").value);
    if (currentValue > 3) {
        document.getElementById("num-players").value = currentValue - 1;
    }
});

document.getElementById("increase-players").addEventListener("click", () => {
    let currentValue = parseInt(document.getElementById("num-players").value);
    document.getElementById("num-players").value = currentValue + 1;
});

document.getElementById("decrease-imposters").addEventListener("click", () => {
    let currentValue = parseInt(document.getElementById("num-imposters").value);
    if (currentValue > 1) {
        document.getElementById("num-imposters").value = currentValue - 1;
    }
});

document.getElementById("increase-imposters").addEventListener("click", () => {
    let currentValue = parseInt(document.getElementById("num-imposters").value);
    document.getElementById("num-imposters").value = currentValue + 1;
});

document.getElementById("imposter-knows").addEventListener("click", () => {
    if (document.getElementById("imposter-knows").textContent === "Yes") {
        document.getElementById("imposter-knows").textContent = "No";
    } else {
        document.getElementById("imposter-knows").textContent = "Yes";
    }
});

document.getElementById("start-button").addEventListener("click", () => {
    numPlayers = parseInt(document.getElementById("num-players").value);
    numImposters = parseInt(document.getElementById("num-imposters").value);
    imposterKnowsTheyreImposter = document.getElementById("imposter-knows").textContent === "Yes";
    latestYear = parseInt(document.getElementById("latest-year").value);

    if (numImposters >= numPlayers) {
        alert("Number of imposters must be less than number of players.");
        return;
    }

    if (numPlayers/numImposters <= 2) {
        alert("There must be at least 2 civillians per imposter.");
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
    document.getElementById("instructions1-text").innerText = `You are Player ${(index % numPlayers) + 1}. When you're ready, click "Show Card".`;
    document.getElementById("title-screen").style.display = "none";
    document.getElementById("instruction-screen2").style.display = "none";
    document.getElementById("passing-phone-screen").style.display = "none";
    document.getElementById("instruction-screen1").style.display = "block";
}

function showCard() {

    if (impostersIndexes.includes(index)) {
        if (!imposterKnowsTheyreImposter) {
            document.getElementById("card-title").innerHTML= `<a class="civillian">Your</a> <a class="imposter">Card</a>`;
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
            document.getElementById("suggestions").innerHTML = `Your aim is to convince everyone that you are NOT the <a class="imposter">imposter</a>. You may have a different card to the <a class="civillian">civillians</a>, but you may also have the same card as the <a class="civillian">civillians</a>. Try to blend in and avoid suspicion!`;
            document.getElementById("card").style.display = "block";
        } else {
            if (impostersIndexes.length > 1) {
                document.getElementById("card-title").innerHTML= `You are an <a class="imposter">Imposter</a>`;
            } else {
                document.getElementById("card-title").innerHTML= `You are the <a class="imposter">Imposter</a>`;
            }
            document.getElementById("card-icon").src = "images/MysteryCard.png";
            document.getElementById("card-name").innerHTML = `<strong>No card</strong>`;
            document.getElementById("rarity-type").innerText = `No rarity - No type`;
            document.getElementById("rarity-type").style.color = "#961d1d";
            document.getElementById("elixir").innerText = `0 Elixir`;

            if (impostersIndexes.length > 1) {
                document.getElementById("suggestions").innerHTML = `Your aim is to convince everyone that you are NOT an <a class="imposter">imposter</a>. You do not know what the <a class="civillian">civillian'</a> card is, so try to avoid suspicion and figure out the <a class="civillian">civillian's</a> card!`;
            } else {
                document.getElementById("suggestions").innerHTML = `Your aim is to convince everyone that you are NOT the <a class="imposter">imposter</a>. You do not know what the <a class="civillian">civillians'</a> card is, so try to avoid suspicion and figure out the <a class="civillian">civillian's</a> card!`;
            }
            document.getElementById("card-title").style.display = "block";
            document.getElementById("card").style.display = "block";
        }
    } else {           
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
            document.getElementById("card-title").innerHTML= `<a class="civillian">Your</a> <a class="imposter">Card</a>`;     
            if (impostersIndexes.length > 1) {
                document.getElementById("suggestions").innerHTML = `Your aim is to convince everyone that you are NOT an <a class="imposter">imposter</a>. You may have a different card to the <a class="civillian">civillians</a>, but you may also have the same card as the <a class="civillian">civillians</a>. Try to blend in and avoid suspicion!`;
            } else {
                document.getElementById("suggestions").innerHTML = `Your aim is to convince everyone that you are NOT the <a class="imposter">imposter</a>. You may have a different card to the <a class="civillian">civillians</a>, but you may also have the same card as the <a class="civillian">civillians</a>. Try to blend in and avoid suspicion!`;
            }
        } else {
            document.getElementById("card-title").innerHTML = 
            `You are a <a class="civillian">Civillian</a>`;
            if (impostersIndexes.length > 1) {
                document.getElementById("suggestions").innerHTML = `Your aim is to find out who the <a class="imposter">imposters</a> are. Make sure to avoid letting the <a class="imposter">imposters</a> figure out your card!`;
            } else {
                document.getElementById("suggestions").innerHTML = `Your aim is to find out who the <a class="imposter">imposter</a> is. Make sure to avoid letting the <a class="imposter">imposter</a> figure out your card!`;
        }
        document.getElementById("card").style.display = "block";
    }
}


    setTimeout(() => {
        document.getElementById("instruction-screen1").style.display = "none";
        document.getElementById("instruction-screen2").style.display = "none";
        document.getElementById("card-screen").style.display = "block";
    }, 30);
}

function showInstructions2() {
    document.getElementById("instructions2-text").innerText = `You are Player ${(index % numPlayers) + 1}. To view your card again, click "Show Card". Before you pass the phone to the next player, click "Next".`;
    document.getElementById("card-screen").style.display = "none";
    document.getElementById("instruction-screen2").style.display = "block";
}

function showPassingPhoneScreen() {
    if (((index % numPlayers) + 1) === 1) {
        document.getElementById("passing-phone-title").innerText = `Pass the phone to Player ${(index % numPlayers) + 1} \n (the host)`;
    } else {
        document.getElementById("passing-phone-title").innerText = `Pass the phone to Player ${(index % numPlayers) + 1}`;
    }
    document.getElementById("passing-phone-next").innerText = `Next`;

    document.getElementById("card-screen").style.display = "none";
    document.getElementById("instruction-screen2").style.display = "none";
    document.getElementById("passing-phone-next").style.display = "none";
    document.getElementById("passing-phone-screen").style.display = "block";

    setTimeout(() => {
        document.getElementById("passing-phone-next").style.display = "block";
    },  2500);
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
    showPassingPhoneScreen();
});

document.getElementById("passing-phone-next").addEventListener("click", () => {
    if (index >= numPlayers) {
        alert("All players have seen their cards. The game is ready to start!");
        document.getElementById("passing-phone-next").style.display = "none";
    } else {
        showInstructions1();
    }
});
