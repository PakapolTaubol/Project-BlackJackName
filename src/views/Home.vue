<script setup>
import { ref } from 'vue'

const music = ref('/src/assets/sound/musicHome.mp3')
const playSound = ref(true)

</script>
 
<template>
    <div class="w-screen h-screen bg-[url('/src/assets/background/Home.webp')] bg-cover bg-center">
        <audio :src="music" autoplay v-if="playSound"></audio>
        <div class="h-screen flex justify-center items-center">
            <RouterLink to="BlackJack">
                <div class="text-4xl text-white">
                    Play Black Jack
                </div>
            </RouterLink>
        </div>
    </div>
</template>
 
<style scoped></style>
