<script setup>
import { ref, watch, onMounted } from "vue";
import getFunction from "../composable/getFunction.js";

const deck = getFunction.buildDeck();
const isBusted = ref(false);
const isStayed = ref(false);
const result = ref('')

let dealerFaceDownCard = []
const dealer = ref({
    array: [],
    point: 0,
    ace: 0,
    score: 0
});
const player = ref({
    array: [],
    point: 0,
    ace: 0,
    score: 0
});

const toStaying = () => {
    isStayed.value = true
    while (dealer.value.point < 17) {
        getFunction.drawCard(deck, dealer.value);
    }
    if (dealer.value.point > 21) {
        result.value = 'Dealer Bust'
    } else if (dealer.value.point < player.value.point) {
        result.value = 'Win'
    } else if (dealer.value.point > player.value.point) {
        result.value = 'Lose'
    } else if (dealer.value.point === player.value.point) {
        result.value = 'Tie'
    }
}

onMounted(() => {
    getFunction.startGameBlackJack(deck, player.value, dealer.value);
    dealerFaceDownCard.push(dealer.value.array.shift());
});

watch(() => player.value.point, (newPoint) => {
    if (newPoint > 21) {
        isBusted.value = true;
        result.value = 'Bust'
    } else if (newPoint === 21) {
        isBusted.value = true;
        result.value = 'BlackJack'
    }
});

watch(() => result.value, (newResult) => {
    switch (newResult) {
        case 'BlackJack': alert('BlackJack')
            break;
        case 'Bust': alert('Bust')
            break;
        case 'Dealer Bust': alert('Dealer Bust')
            break;
        case 'Win': alert('Win')
            break;
        case 'Lose': alert('Lose')
            break;
        default:
            break;
    }
})
</script>

<template>
    <div class="w-full">
        <div class="flex justify-center flex-col w-auto h-auto">
            <div class="mx-4 my-2 flex justify-between">
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    ADVICE ?
                </button>
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    SETTING
                </button>
            </div>

            <!-- Dealer -->
            <div class="flex justify-center py-2">
                <div ref="DealerCard" class="inline-flex w-auto h-auto">
                    <img v-if="!(isBusted || isStayed)" src="../assets/image/backcard.png" class="h-auto w-40" />
                    <img v-else :src="dealerFaceDownCard" class="h-auto w-40" />
                    <img v-for="card in dealer.array" :src="card" class="h-auto w-40" />
                </div>
                <p class="text-2xl text-white">{{ dealer.point }}</p>
            </div>

            <!-- CEN -->
            <div class="flex justify-center py-6">
                <!-- HIT -->
                <div class="px-2">
                    <button type="button" @click="getFunction.drawCard(deck, player)" :disabled="isBusted || isStayed"
                        class="px-2 py-2 bg-green-600 active:bg-green-900 text-white font-bold text-lg text-center rounded-lg">
                        <p class="text-2xl mx-10">HIT</p>
                    </button>
                </div>
                <div class="px-20">
                    <p class="text-white font-extrabold">BLACK JACK BY CODENAME</p>
                </div>
                <!-- STAY -->
                <div class="px-2">
                    <button type="button" @click="toStaying" :disabled="isBusted || isStayed"
                        class="px-2 py-2 bg-red-600 active:bg-red-900 text-white font-bold text-lg text-center rounded-lg">
                        <p class="text-2xl mx-10">STAY</p>
                    </button>
                </div>
            </div>

            <!-- Player -->
            <div class="flex justify-center py-2">
                <div ref="PlayerCard" class="inline-flex w-auto h-auto">
                    <img v-for="card in player.array" :src="card" class="h-auto w-40" />
                </div>
                <p class="text-2xl text-white">{{ player.point }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
