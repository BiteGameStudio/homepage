<template>
  <!-- Start Screen -->
  <div v-if="!started" class="start-screen">
    <div class="starfield"></div>
    <button class="start-button" @click="startExperience">Start</button>
  </div>

  <!-- Crawl Container -->
  <div class="crawl-container" v-show="!ready && started">
    <div class="starfield"></div>
    <div class="crawl" ref="crawlElement">
      <div class="crawl-text">
        <h1>Welcome to The Arcade Anthology</h1>
        <p>
          Bite Game Studio invites you to step into a universe where shadows stretch across starlit worlds,
          and the line between hero and villain blurs. Prepare to plunge into a galaxy teetering on the edge of crisis,
          where mysteries lurk behind every pixel, and the stakes are far higher than mere survival.
        </p>
        <p>
          In this world of retro-fuelled adventure, you won’t just play the game; you’ll piece together the story hidden
          within each level, each encounter, and each choice. What is the crisis engulfing the galaxy?
          A shadowy presence looms large, its influence felt but never seen,
          as civilizations crumble and uncharted territories turn hostile.
        </p>
        <p>
          <strong>Who or what is the presence?</strong><br>
          <strong>Why are entire planets falling silent?</strong><br>
          <strong>Is there anyone left to trust, or are alliances as fragile as the stars themselves?</strong>
        </p>
        <p>
          The answers lie hidden within the very games you'll play in the anthology, from pixelated labyrinths
          to cosmic shootouts, each piece a chapter in this epic space opera. Every level, every retro-styled
          challenge is a clue, each layer another hint, as you decode the path of Invictus and uncover what lies
          beyond the known universe.
        </p>
        <p>
          Are you ready to dive into a story woven through nostalgia and built on mystery? Are you prepared to
          face the unknown, to challenge the galaxy’s most enigmatic force, and to make the choices that might
          determine the fate of entire worlds?
        </p>
        <p>
          <strong>Click Start</strong>—because the galaxy needs answers, and only you can uncover the truth.
        </p>
        <p>Welcome to <strong>The Arcade Anthology</strong>.</p>
      </div>
    </div>
    <button class="skip-button" @click="skipToArcade">[S]kip</button>
  </div>

  <!-- Arcade Container -->
  <div v-if="ready" class="arcade-container">
    <div class="starfield"></div>
    <h2>{{ typedText }}</h2>
  </div>

  <!-- Audio elements -->
  <audio id="CataclysmicShadows">
    <source src="/m/Cataclysmic-Shadows.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <audio id="CelestialCollapse">
    <source src="/m/Celestial-Collapse.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <audio id="CelestialFracture">
    <source src="/m/Celestial-Fracture.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <!-- Typing sound effect -->
  <audio id="typingSound">
    <source src="/s/typing.mp3" type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const started = ref(false);
const ready = ref(false);
const skip = ref(false);
const text = "Are you ready player one?";
const typedText = ref("");
const typingSpeed = 150;
let typingIndex = 0;
let autoNextPageTimeout;
const crawlElement = ref(null);

const startExperience = () => {
  started.value = true;
  playAudioSequence();
  window.addEventListener('keydown', handleKeyPress);
};

const playAudioSequence = async () => {
  const audioFiles = ['CataclysmicShadows', 'CelestialCollapse', 'CelestialFracture'];
  for (const id of audioFiles) {
    if (skip.value) break; // Stop if skipped
    const audio = document.getElementById(id);
    audio.currentTime = 0;
    await audio.play().catch((error) => {
      console.error('Audio play failed:', error);
    });
    await new Promise((resolve) => {
      const onEnded = () => {
        audio.removeEventListener('ended', onEnded);
        resolve();
      };
      audio.addEventListener('ended', onEnded);

      // If skipped, resolve immediately
      const checkSkip = setInterval(() => {
        if (skip.value) {
          clearInterval(checkSkip);
          audio.pause();
          audio.removeEventListener('ended', onEnded);
          resolve();
        }
      }, 100);
    });
  }
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
  document.querySelectorAll('audio').forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  // Stop the crawl animation
  if (crawlElement.value) {
    crawlElement.value.style.animation = 'none';
  }
  showArcadeContainer();
};

const startAutoNextPageTimer = () => {
  autoNextPageTimeout = setTimeout(goToNextPage, 10000); // 10 seconds
};

const goToNextPage = () => {
  clearTimeout(autoNextPageTimeout);
  // Replace with actual navigation logic
  console.log('Navigating to the next page...');
};

const onCrawlAnimationEnd = () => {
  if (!skip.value) {
    // Wait 1 second after the crawl ends
    setTimeout(() => {
      showArcadeContainer();
    }, 1000);
  }
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
  if (crawlElement.value) {
    crawlElement.value.removeEventListener('animationend', onCrawlAnimationEnd);
  }
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
.crawl-container,
.arcade-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000; /* Ensure background is black */
}

.start-screen .starfield,
.crawl-container .starfield,
.arcade-container .starfield {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 0; /* Ensure starfield is behind content */
}

.start-button {
  position: relative;
  z-index: 1;
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 20px 40px;
  font-family: 'Press Start 2P', monospace;
  font-size: 1.5em;
  cursor: pointer;
  text-transform: uppercase;
}

.start-button:hover {
  background-color: #00ff00;
  color: #000;
}


.start-button,.arcade-container h2 {
  display: inline-block;
  width: 50%;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
}
.crawl {
  position: absolute;
  bottom: -100vh;
  width: 100%;
  text-align: center;
  animation: crawl 160s linear forwards;
  color: #00ff00;
  z-index: 1;
}

@keyframes crawl {
  0% {
    bottom: -100vh;
  }
  100% {
    bottom: 200vh;
  }
}

.crawl-text {
  display: inline-block;
  font-size: 1.5em;
  line-height: 2em;
  text-transform: uppercase;
  white-space: pre-wrap;
  width: 80%;
  font-family: 'Press Start 2P', monospace;
}

.arcade-container h2 {
  position: relative;
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
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
  font-family: 'Press Start 2P', monospace;
  cursor: pointer;
  text-transform: uppercase;
  z-index: 1;
}

.skip-button:hover {
  background-color: #00ff00;
  color: #000;
}
/* Starfield Styles */
.starfield::before,
.starfield::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background: transparent;
}

.starfield::before {
  box-shadow:
    /* Layer 1 Stars */
      5vw 10vh #00ff00,
      12vw 50vh #00ff00,
      20vw 30vh #00ff00,
      28vw 80vh #00ff00,
      35vw 20vh #00ff00,
      40vw 60vh #00ff00,
      50vw 40vh #00ff00,
      60vw 70vh #00ff00,
      68vw 15vh #00ff00,
      75vw 55vh #00ff00,
      80vw 25vh #00ff00,
      88vw 65vh #00ff00,
      95vw 35vh #00ff00,
      15vw 75vh #00ff00,
      25vw 45vh #00ff00,
      55vw 85vh #00ff00,
      65vw 95vh #00ff00,
      70vw 5vh #00ff00,
      85vw 50vh #00ff00,
      90vw 20vh #00ff00;
  animation: twinkle1 8s infinite;
}

.starfield::after {
  box-shadow:
    /* Layer 2 Stars */
      10vw 15vh #00ff00,
      18vw 55vh #00ff00,
      22vw 35vh #00ff00,
      30vw 85vh #00ff00,
      38vw 25vh #00ff00,
      45vw 65vh #00ff00,
      55vw 45vh #00ff00,
      62vw 75vh #00ff00,
      70vw 20vh #00ff00,
      78vw 60vh #00ff00,
      85vw 30vh #00ff00,
      92vw 70vh #00ff00,
      98vw 40vh #00ff00,
      20vw 80vh #00ff00,
      28vw 50vh #00ff00,
      60vw 90vh #00ff00,
      68vw 100vh #00ff00,
      75vw 10vh #00ff00,
      88vw 55vh #00ff00,
      95vw 25vh #00ff00;
  animation: twinkle2 10s infinite;
  animation-delay: 2s;
}

@keyframes twinkle1 {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

@keyframes twinkle2 {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

</style>
