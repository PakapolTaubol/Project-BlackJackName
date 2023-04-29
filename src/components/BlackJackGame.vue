<script setup>
import { ref, watch, onMounted } from "vue";
import getFunction from "../composable/getFunction.js";

const deck = getFunction.buildDeck();
const isBusted = ref(false);
const isStayed = ref(false);
const result = ref('')

const dealerFaceDownCard = ref([])
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
    getFunction.startGameBlackJack(deck, player.value, dealer.value)
    dealerFaceDownCard.value = dealer.value.array.shift()
});

watch(() => player.value.point, (newPoint) => {
    if (newPoint > 21) {
        isBusted.value = true;
        result.value = 'Bust'
    }
});

watch(() => result.value, (newResult) => {
    switch (newResult) {
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
    <div class="w-screen h-screen bg-gray-600">
        <div class="flex justify-center flex-col w-auto h-auto">
            <div>
                <p>{{ player.point }}</p>
                <p>{{ dealer.point }}</p>
            </div>

            <!-- Dealer -->
            <div class="flex justify-center">
                <div ref="DealerCard" class="inline-flex w-auto h-auto">
                    <img v-if="!(isBusted && isStayed)" :src="dealerFaceDownCard" class="h-auto w-40" />
                    <img v-else :src="dealerFaceDownCard" class="h-auto w-40" />
                    <img v-for="card in dealer.array" :src="card" class="h-auto w-40" />
                </div>
            </div>

            <!-- Button -->
            <div class="flex justify-center">
                <button type="button" @click="getFunction.drawCard(deck, player)" :disabled="isBusted || isStayed">
                    <p class="text-2xl mx-10">HIT</p>
                </button>
                <button type="button" @click="toStaying" :disabled="isBusted || isStayed">
                    <p class="text-2xl mx-10">STAY</p>
                </button>
            </div>

            <!-- Player -->
            <div class="flex justify-center">
                <div ref="PlayerCard" class="inline-flex w-auto h-auto">
                    <img v-for="card in player.array" :src="card" class="h-auto w-40" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
