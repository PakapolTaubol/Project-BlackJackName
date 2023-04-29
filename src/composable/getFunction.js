function buildDeck() {
    const deck = [];
    const points = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const types = ['C', 'D', 'H', 'S'];
    for (const type of types) {
        for (const point of points) {
            deck.push(`${point}-${type}`);
        }
    }
    for (let i = 0; i < deck.length; i++) {
        const j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function startGameBlackJack(deck, player, dealer, firstCard) {
    drawCard(deck, firstCard);
    drawCard(deck, dealer);
    for (let i = 0; i < 2; i++) {
        drawCard(deck, player);
    }
}

function drawCard(deck, user) {
    const codeCard = deck.shift(); // 6-T
    const srcCard = `./cards/${codeCard}.png`;
    user.array.push(srcCard);
    let point = codeCard.split("-")[0]; // "6-T" >> ["6", "T"] >> 6
    if (point === "A") {
        point = user.point + 11 > 21 ? 1 : (user.ace++, 11);
    } else {
        point = isNaN(point) ? 10 : parseInt(point);
    }
    if (user.ace === 1 && user.point + point > 21) {
        user.ace--;
        point -= 10;
    }
    user.point += point;
}

function hit(deck, user) {
    drawCard(deck, user);
}

function stay(deck, user) {
    hitButtonPressed.value = false;
    if (textPopup.value !== "Player BUST" && dealerPoint.value < 17) {
        while (dealerPoint.value < 17 && dealerArr.value.length <= 4) {
            drawCard(dealerArr, dealerPoint, dealerCountAce);
        }
        if (dealerPoint.value > 21) {
            textPopup.value = "Win";
            playerScore.value++;
        }
    }
}

function newGame() {
    hitButtonPressed.value = true;
    numRound.value++;
    resetEveryThing();
    // startGame();
    if (deck.value.length <= 26) {
        deck.value = [];
        buildDeck();
        shuffleDeck();
    }
}

function resetEveryThing() {
    player.array = [];
    dealerArr.value = [];
    firstCard.value = [];
    player.point = 0;
    dealerPoint.value = 0;
    textPopup.value = "";
}

export default {
    buildDeck,
    startGameBlackJack,
    hit,
    stay,
    drawCard,
    newGame,
    resetEveryThing
};