<script setup>
import { onMounted, ref } from "vue";
import settingIcon from "./components/icons/SystemUiconsSettings.vue";

const bg_blur = ref(true);
const close_BG = () => {
  bg_blur.value = false;
  onOff.value = true
};

const hitButtonPressed = ref(true);

let deck = [], dealerArr = [], playerArr = [], firstCard = [];
const playerPoint = ref(0), playerCountAce = ref(0), playerScore = ref(0);
const dealerPoint = ref(0), dealerCountAce = ref(0), dealerScore = ref(0);
const numRound = ref(1), textPopup = ref(""), openSetting = ref(false);


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
      deck.push(point + "-" + type);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
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
  if (playerArr.length <= 5 && playerPoint.value < 21) {
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
    while (dealerPoint.value < 17 && dealerArr.length <= 4) {
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
  const codeCard = deck.shift(); // 6-T
  const srcCard = `./cards/${codeCard}.png`; // getPicture
  arr.push(srcCard);
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
  if (deck.length <= 26) {
    deck = [];
    buildDeck();
    shuffleDeck();
  }
}

function resetEveryThing() {
  playerArr = [];
  dealerArr = [];
  firstCard = [];
  playerPoint.value = 0;
  dealerPoint.value = 0;
  textPopup.value = "";
}

function MenuOpen() {
  openSetting.value = !openSetting.value;
}

const onOff = ref(true);
const music = new Audio('/music/bg_music.mp3')
const playPauseSong = () => {
  onOff.value = !onOff.value
}

const quit = () => {
  bg_blur.value = true;
  openSetting.value = false;
  hitButtonPressed.value = true;
  newGame();
  numRound.value = 0;
  playerScore.value = 0;
  dealerScore.value = 0;
  onOff.value = false;
}
</script>

<template>
  <div class="w-screen h-screen">
    <!-- BG main -->
    <div class="bg-bottom bg-cover bg-no-repeat w-full h-full bg-[url('/src/assets/background.png')]">
      <!-- BG start game -->
      <label class="absolute w-screen h-screen bg-bottom bg-cover bg-no-repeat bg-[url('/src/assets/bg-blur.jpg')]"
        @click="close_BG" v-show="bg_blur" for="my-modal-4">
        <h1
          class="w-full flex justify-center mt-9 font-sans font-extrabold text-9xl tracking-wider text-white max-md:text-6xl">
          BLACKJACK
        </h1>
        <h4
          class="w-full font-sans font-semibold text-3xl flex justify-center text-end mt-64 text-gray-300 blink max-md:text-2xl">
          click to start
        </h4>
      </label>

      <!-- navbar -->
      <div>
        <div
          class="w-96 fixed text-white h-screen z-50 top-0 right-0 bg-black overflow-hidden float-right ease-in duration-300 max-md:w-64"
          :class="[openSetting ? 'right-0' : 'right-[-100%]']">
          <!-- bar -->
          <div>
            <ul>
              <!--link bar -->
              <li class="pb-16 mt-3">
                <a class="absolute left-5 text-5xl hover:text-slate-400" href="javascript:void(0)" @click="MenuOpen">×</a>
              </li>
              <li>
                <img class="w-24 m-auto" src="/src/assets/img/back_card.png" />
              </li>
              <li>
                <a class="pt-8 text-center text-6xl text-slate-200 block hover:text-zinc-400 cursor-pointer  max-md:text-3xl"
                  @click="MenuOpen">RESUME</a>
              </li>
              <li>
                <label
                  class="pt-8 text-center text-6xl text-slate-200 block hover:text-zinc-400 cursor-pointer max-md:text-3xl"
                  for="my-modal-4">RULE</label>
              </li>
              <li>
                <a class="pt-8 text-center text-6xl text-slate-200 block hover:text-zinc-400 cursor-pointer max-md:text-3xl"
                  @click="quit">QUIT</a>
              </li>
            </ul>
          </div>

          <!-- play music -->
          <div class="flex pr-2 pt-36 justify-center flex-row">
            <p class="text-4xl pr-3 -top-1.5 max-md:text-2xl max-md:top-1.5">music :</p>
            <!-- stop start music -->
            <button class="text-4xl pl-5 -top-1.5 cursor-pointer max-md:text-xl max-md:mt-1"
              :class="onOff ? ['text-orange-400', music.play()] : [' text-white', music.pause()]"
              @click="playPauseSong">{{ onOff ? 'On' : 'Off'
              }}</button>
          </div>
        </div>

        <!-- close bar -->
        <button id="setting"
          class="absolute block text-7xl cursor-pointer text-white hover:text-slate-400 float-right right-3 top-3 max-md:text-6xl max-md:mt-5"
          @click="MenuOpen">
          <settingIcon />
        </button>
      </div>

      <!-- Rule -->
      <div>
        <!-- button text to open -->
        <input type="checkbox" id="my-modal-4" class="modal-toggle" />
        <label for="my-modal-4" class="modal cursor-pointer">
          <label class="modal-box relative mt-5 text-white opacity-95 bg-stone-900">
            <h1 class="text-3xl text-center font-bold">Rule</h1>
            <h3 class="py-2 text-xl font-bold text-amber-600">กฎการเล่น BlackJack</h3>
            <p class="py-2 text-sm">เกมนี้คือเกม <span class="text-rose-600 font-bold">BlackJack</span> หรือ 21
              เป้าหมายของเราในการเล่น คือ ผู้เล่น <span class="green"> (Player)</span> เอาชนะเจ้ามือ <span
                class="red">(Dealer) </span>
              การเล่นคือ <span class="red"> Dealer</span> จะจั่วไพ่ให้คนละ 2 ใบ โดยที่ไพ่ของ <span class="green">Player
              </span> จะหงายทั้ง 2 ใบ แต่
              <span class="red"> Dealer</span> จะคว่ำไพ่ตัวเองลง 1 ใบ เกมนี้เล่นกับจิตวิทยา จะชนะ <span
                class="red">Dealer</span> ได้ต้องแต้มให้เยอะกว่า หรือ ลุ้นให้ <span class="red">Dealer</span>
              แต้มเกิน 21
            </p>

            <h3 class="py-2 text-xl font-bold text-amber-600">อธิบายการเล่น</h3>
            <ol class="list-disc px-4 text-sm">
              <li> <span class="text-green-500">HIT</span> เป็นการขอไพ่เพิ่มจากทาง <span class="red">Dealer</span>
                โดยจะนับแต้มไพ่ที่เพิ่มเข้ามาปกติ โดยเราต้องระวังไม่ให้แต้มเราเกิน
                21 ไม่งั้นจะเป็นการ BUST หรือแต้มเสียและทันที
              </li>
              <li><span class="text-red-500">STAY</span> เหมือนการกดยืนยันไพ่เพื่อวัดผลแพ้ชนะกับ <span
                  class="red">Dealer</span> โดย <span class="red">Dealer</span>
                จะเริ่มจั่วไพ่ของตนเองถ้าหากตนเองแต้มน้อยกว่า 17 แต่ถ้า <span class="red">Dealer</span> มีแต้มที่ 17-21
                <span class="red">Dealer</span>
                จะไม่มีการจั่วไพ่เพิ่ม
              </li>
            </ol>

            <h3 class="py-2 text-xl font-bold text-amber-600">การนับแต้ม</h3>
            <ol class="list-disc px-4 text-sm">
              <li>ไพ่เลข ตั้งแต่ 2-10 แต้มจะนับตามเลข</li>
              <li>ไพ่หน้าคน J, Q, K จะนับ 10 แต้มเท่ากันหมด</li>
              <li>ไพ่ A หรือ Ace เป็นไพ่ที่ทำให้ได้เปรียบมากที่สุด เพราะจะเป็นได้ทั้ง 1 แต้มหรือ 11 แต้มก็ได้
                โดยถ้าหากผลรวมของแต้มไม่เกิน 21 ไพ่ A จะมีค่า 11 แต้ม แต่ถ้าหากเกิน 21 ไพ่ A จะลดค่าตัวเองเหลือแค่ 1
                แต้ม
              </li>
            </ol>

            <h3 class="py-2 text-xl font-bold text-amber-600">การดำเนินเกม</h3>
            <p class="py-2 text-sm">วางเดิมพัน -> เจ้ามือแจกไพ่ -> ผู้เล่นเล่นไพ่ในมือ -> เจ้ามือเล่นไพ่ในมือ ->
              วัดผลการเดิมพัน</p>
          </label>
        </label>
      </div>

      <!-- Score -->
      <div class="flex justify-center items-center text-stone-900" v-show="!bg_blur">
        <div class="relative flex justify-center ">
          <div class="totalScore z-10 relative flex items-center justify-center ">
            <span class="pt-8 text-lg max-md:text-sm"> Round: {{ numRound }} </span>
          </div>
          <div class="absolute top-0 m-auto z-30 round">
            <span class="compare flex justify-center items-center w-60 text-2xl font-bold ">
              <span class="text-teal-300 mr-4">{{ playerScore }}</span> -
              <span class="text-rose-600 ml-4">{{ dealerScore }} </span>
            </span>
          </div>
          <div class="player absolute m-auto z-20 flex items-center top-0 bx6 justify-around">
            <div class="flex text-xl max-md:text-base">PLAYER: {{ playerPoint }}</div>s
            <div class="flex w-16"></div>
            <div class="flex text-xl max-md:text-base">
              DEALER: <span v-show="!hitButtonPressed">{{ dealerPoint }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Dealer -->
      <div class="w-full pt-6">
        <div class="flex justify-center space-x-5" ref="imgCardDealer">
          <img v-if="hitButtonPressed" src="./assets/img/back_card.png" class="w-32" />
          <img v-else :src="firstCard" class="w-32" />
          <img v-for="card in dealerArr" :src="card" class="w-32" />
          <!-- popup -->
          <div v-show="!hitButtonPressed && !bg_blur"
            class="popStatus absolute border-solid bg-slate-700 px-24 py-4 text-3xl">
            {{ textPopup }}
          </div>
        </div>
      </div>
      <h1 class="flex justify-center text-white font-bold text-xl py-4"></h1>

      <!-- Button -->
      <div class="w-full flex justify-center space-x-8 h-8">
        <button type="button"
          class="px-6 bg-green-500 hover:bg-green-600 active:bg-green-800 text-white font-bold text-lg text-center rounded-lg"
          @click="hit" :disabled="!hitButtonPressed">
          HIT
        </button>
        <button type="button"
          class="px-6 bg-red-500 hover:bg-red-600 active:bg-red-800 text-white font-bold text-lg text-center rounded-lg"
          @click="stay" :disabled="!hitButtonPressed">
          STAY
        </button>
      </div>
      <div v-if="!hitButtonPressed" class="flex justify-center mt-5">
        <button type="button"
          class="px-6 py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white font-bold text-lg text-center rounded-lg "
          @click="newGame">
          New Game
        </button>
      </div>

      <!-- Player -->
      <div class="w-full">
        <h1 class="flex justify-center text-white font-bold text-xl py-4"></h1>
        <div class="flex justify-center space-x-5" ref="imgCardPlayer">
          <img v-for="card in playerArr" :src="card" class="w-32" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@600&display=swap%27');

.rule {
  left: 30%;
  top: 14%;
}

.compare {
  height: 40px;
}

.totalScore {
  width: 220px;
  height: 75px;
  background: linear-gradient(120deg, #00e8fd, #027fbe);
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
}


.player {
  width: 600px;
  height: 40px;
  background: linear-gradient(120deg, #19f0b0, #0fee98);
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}

@media screen and (max-width:60rem) {
  .player {
    width: 500px;
    height: 30px;
  }

  .totalScore {
    width: 175px;
    height: 55px;
  }

  .compare {
    width: 200px;
    height: 30px;
  }
}

.round {
  background: linear-gradient(120deg, #015b40, #023f28);
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}

.popStatus {
  margin-top: 200px;
}

.red {
  color: rgb(211, 34, 34)
}

.green {
  color: rgb(39, 211, 39);
}

.blink {
  animation: blink 2s infinite;
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
