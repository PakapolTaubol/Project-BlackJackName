<script setup>
import { onMounted, ref } from "vue";

const hitButtonPressed = ref(true);

const deck = ref([]), dealerArr = ref([]), playerArr = ref([]), firstCard = ref([]);
const playerPoint = ref(0), playerCountAce = ref(0), playerScore = ref(0);
const dealerPoint = ref(0), dealerCountAce = ref(0), dealerScore = ref(0);
const numRound = ref(1), textPopup = ref("")


onMounted(() => {
    buildDeck();
    shuffleDeck();
    startGame();
})

function buildDeck() {
    const points = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const types = ["C", "D", "H", "S"];
    for (const type of types) {
        for (const point of points) {
            deck.value.push(point + "-" + type);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.value.length; i++) {
        let j = Math.floor(Math.random() * deck.value.length);
        let temp = deck.value[i];
        deck.value[i] = deck.value[j];
        deck.value[j] = temp;
    }
}

function startGame() {
    drawCard(firstCard, dealerPoint, dealerCountAce);
    drawCard(dealerArr, dealerPoint, dealerCountAce);
    for (let i = 0; i < 2; i++) {
        drawCard(playerArr, playerPoint, playerCountAce);
    }
    showTextPopup();
}

function hit() {
    if (playerArr.value.length <= 5 && playerPoint.value < 21) {
        drawCard(playerArr, playerPoint, playerCountAce);
    }
    if (playerPoint.value === 21) {
        hitButtonPressed.value = false;
        textPopup.value = "Black Jack";
        playerScore.value++;
    } else if (playerPoint.value > 21) {
        hitButtonPressed.value = false;
        textPopup.value = "Player BUST";
        stay();
    }
}

function stay() {
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
    showTextPopup();
}

function drawCard(arr, yourPoint, countAce) {
    const codeCard = deck.value.shift(); // 6-T
    const srcCard = `./cards/${codeCard}.png`; // getPicture
    arr.value.push(srcCard);
    let point = codeCard.split("-")[0]; // "6-T" >> ["6", "T"] >> 6
    if (point === "A") {
        point = yourPoint.value + 11 > 21 ? 1 : (countAce.value++, 11);
    } else {
        point = isNaN(point) ? 10 : parseInt(point);
    }
    if (countAce.value === 1 && yourPoint.value + point > 21) {
        countAce.value--;
        point -= 10;
    }
    yourPoint.value += point;
}

function showTextPopup() {
    if (hitButtonPressed.value) {
        if (playerPoint.value === 21 && dealerPoint.value === 21) {
            hitButtonPressed.value = false;
            textPopup.value = "Tie Black Jack";
        } else if (playerPoint.value === 21) {
            hitButtonPressed.value = false;
            textPopup.value = "Black Jack";
            playerScore.value++;
        }
    } else if (textPopup.value !== "Win") {
        if (textPopup.value === "Player BUST") {
            dealerScore.value++;
        } else if (dealerPoint.value > playerPoint.value) {
            textPopup.value = "Lose";
            dealerScore.value++;
        } else if (dealerPoint.value < playerPoint.value) {
            textPopup.value = "Win";
            playerScore.value++;
        } else {
            textPopup.value = "Tie";
        }
    }
}

function newGame() {
    hitButtonPressed.value = true;
    numRound.value++;
    resetEveryThing();
    startGame();
    if (deck.value.length <= 26) {
        deck.value = [];
        buildDeck();
        shuffleDeck();
    }
}

function resetEveryThing() {
    playerArr.value = [];
    dealerArr.value = [];
    firstCard.value = [];
    playerPoint.value = 0;
    dealerPoint.value = 0;
    textPopup.value = "";
}
</script>

<template>
    <div>
        <div class="flex">
            <!-- Dealer -->
            <div class="flex justify-center">
                <div ref="imgCardDealer">
                    <img v-if="hitButtonPressed" src="../assets/img/back_card.png" class="h-auto w-36" />
                    <img v-else :src="firstCard" class="h-auto w-36" />
                    <img v-for="card in dealerArr" :src="card" class="h-auto w-36" />
                    <!-- popup -->
                    <div v-show="!hitButtonPressed">
                        {{ textPopup }}
                    </div>
                </div>
            </div>

            <!-- Button -->
            <div>
                <button type="button" @click="hit" :disabled="!hitButtonPressed">
                    HIT
                </button>
                <button type="button" @click="stay" :disabled="!hitButtonPressed">
                    STAY
                </button>
            </div>
            <div v-if="!hitButtonPressed">
                <button type="button" @click="newGame">
                    New Game
                </button>
            </div>

            <!-- Player -->
            <div>
                <div ref="imgCardPlayer">
                    <img v-for="card in playerArr" :src="card" class="h-auto w-36" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
