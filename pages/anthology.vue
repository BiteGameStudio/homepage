<template>

  <Starfield />
  <button class="skip-button" @click="skipToArcade">[S]kip</button>
  <div v-if="!started" class="start-screen">

    <button class="start-button" @click="startExperience">1 UP</button>
  </div>




</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Starfield from "~/components/Starfield.vue";

const started = ref(false);
const ready = ref(false);
const skip = ref(false);
const text = "Are you ready player one?";
const typedText = ref("");
const typingSpeed = 150;
let typingIndex = 0;
let autoNextPageTimeout;

const startExperience = () => {
  started.value = true;

  window.addEventListener('keydown', handleKeyPress);
};

const showArcadeContainer = () => {
  ready.value = true;
  typeText();
  startAutoNextPageTimer();
};

const typeText = () => {
  if (typingIndex < text.length) {
    typedText.value += text[typingIndex];
    playTypingSound();
    typingIndex++;
    setTimeout(typeText, typingSpeed);
  }
};

const playTypingSound = () => {
  const typingSound = document.getElementById('typingSound');
  typingSound.currentTime = 0;
  typingSound.play().catch((error) => {
    console.error('Typing sound play failed:', error);
  });
};

const handleKeyPress = (event) => {
  if (event.key.toLowerCase() === 's') {
    skipToArcade();
  } else if (event.key === 'Enter' && ready.value) {
    goToNextPage();
  }
};

const skipToArcade = () => {
  skip.value = true;

  // Stop the crawl animation
  if (crawlElement.value) {
    crawlElement.value.style.animation = 'none';
  }
  showArcadeContainer();
};

const startAutoNextPageTimer = () => {
  //autoNextPageTimeout = setTimeout(goToNextPage, 60000); // 10 seconds
};

const goToNextPage = () => {
  clearTimeout(autoNextPageTimeout);
  // Replace with actual navigation logic
  console.log('Navigating to the next page...');
};


onMounted(() => {
  // Event listener for the end of the crawl animation
  if (crawlElement.value) {
    crawlElement.value.addEventListener('animationend', onCrawlAnimationEnd);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
  clearTimeout(autoNextPageTimeout);

});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #000; /* Ensure the background is black */
  font-family: 'Press Start 2P', monospace;
  color: #00ff00;
}


.start-screen,

.arcade-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000; /* Ensure background is black */
}


.start-button {
  position: absolute;
  z-index: 1;
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 20px 40px;
  font-family: 'Press Start 2P', monospace;
  font-size: 1.5em;
  cursor: pointer;
  text-transform: uppercase;
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.start-button:hover {
  background-color: #00ff00;
  color: #000;
}

.arcade-container h2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  font-family: 'Press Start 2P', monospace;
  font-size: 2em;
  color: #00ff00;
  text-shadow: 0px 0px 10px #00ff00;
  animation: flicker-text 2s infinite alternate;
}

@keyframes flicker-text {
  0% {
    opacity: 1;
    text-shadow: 0px 0px 10px #00ff00;
  }
  50% {
    opacity: 0.6;
    text-shadow: none;
  }
  100% {
    opacity: 1;
    text-shadow: 0px 0px 10px #00ff00;
  }
}

.skip-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  text-transform: uppercase;
}

.skip-button:hover {
  background-color: #00ff00;
  color: #000;
}

</style>
