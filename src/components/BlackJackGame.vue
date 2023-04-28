<script setup>
import { watchEffect, ref, watch, onMounted } from "vue";
import getFunction from "../composable/getFunction.js";

const hitButtonPressed = ref(true);

const deck = [], firstCard = ref({ array: [] });

const player = ref({
    array: [],
    point: 0,
    ace: 0,
    score: 0
})

const dealer = ref({
    array: [],
    point: 0,
    ace: 0,
    score: 0
})

onMounted(() => {
    getFunction.buildDeck(deck)
    getFunction.shuffleDeck(deck)
    getFunction.startGameBlackJack(deck, player.value, dealer.value, firstCard.value)
})
</script>

<template>
    <div class="w-screen h-screen bg-gray-600">
        <div class="flex justify-center flex-col w-auto h-auto">
            <!-- Dealer -->
            <div class="flex justify-center">
                <div ref="DealerCard" class="inline-flex w-auto h-auto">
                    <img v-if="hitButtonPressed" src="../assets/img/back_card.png" class="h-auto w-40" />
                    <!-- <img v-else :src="firstCard" class="h-auto w-40" /> -->
                    <img v-for="card in dealer.array" :src="card" class="h-auto w-40" />
                    <!-- popup -->
                    <!-- <div v-show="!hitButtonPressed">
                        {{ textPopup }}
                    </div> -->
                </div>
            </div>

            <!-- Button -->
            <div class="flex justify-center">
                <button type="button" @click="getFunction.hit(deck, player)" :disabled="!hitButtonPressed">
                    <p class="text-2xl mx-10">HIT</p>
                </button>
                <button type="button" @click="stay" :disabled="!hitButtonPressed">
                    <p class="text-2xl mx-10">STAY</p>
                </button>
            </div>
            <!-- <div v-if="!hitButtonPressed" class="flex justify-center">
                <button type="button" @click="newGame">
                    New Game
                </button>
            </div> -->

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
