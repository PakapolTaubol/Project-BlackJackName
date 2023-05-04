<script setup>
import { ref } from 'vue'

const music = new Audio('/sound/musicHome.mp3')
const playSound = ref(true)
const musicBTN = () => {
    playSound.value = !playSound.value
}
</script>
 
<template>
    <div class="w-screen h-screen bg-[url('/src/assets/background/Home.webp')] bg-cover bg-center">
        <!-- <audio :src="music" autoplay v-if="playSound"></audio> -->
        <div class="h-screen flex justify-center items-center">
            <RouterLink to="BlackJack">
                <div class="text-4xl text-white">
                    Play Black Jack
                </div>
            </RouterLink>
            <div class="text-white">
                Music : 
                <button @click="musicBTN" :class="playSound ? music.play() : music.pause()">
                     {{ playSound ? 'On' : 'Off' }}
                </button>
            </div>
        </div>
    </div>
</template>
 
<style scoped></style>
