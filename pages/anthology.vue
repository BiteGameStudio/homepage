<template>

  <div class="crawl-container">
    <div class="crawl">
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
  </div>

  <div v-if='ready' class="arcade-container">

    <h2>Ready Player One?</h2>
    <p><button>1 UP</button></p>
  </div>

  <audio  id="hum">
    <source src="/s/hum-1.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>
</template>
<script setup>

import { ref, onMounted } from 'vue';

const ready = ref(false);
function startExperience(){
  ready.value=true;
  const hum1 = document.getElementById('hum');
  hum1.currentTime = 0;
  hum1.play();
}
onMounted(function () {




})

</script>
<style>
/* Importing Google Fonts - Press Start 2P for a retro 80s vibe */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* Overall page styling */
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family: 'Press Start 2P', sans-serif;
  color: #00FF00; /* CRT Green */
}

/* Wrapper for crawl effect */
.crawl-container {
  position: relative;

  height: 100vh;
}

h1 {
  line-height: 1.5;
}

.crawl {
  position: absolute;
  top: 110vh; /* Start well off the screen */
  width: 100%;
  text-align: center;
  animation: crawl 50s linear forwards; /* Smoothly scroll up */
  transform-origin: bottom center;
  color: #00FF00; /* CRT Green */
}

/* Keyframes for moving top from 110vh to 0vh */
@keyframes crawl {
  0% {
    top: 110vh; /* Start below the screen */
  }
  100% {
    top: -200vh; /* Move to the top of the screen */
  }
}

/* Styling for the text inside the crawl */
.crawl-text {
  display: inline-block;
  font-size: 1em;
  line-height: 1.5em;
  text-transform: uppercase;
  white-space: pre-wrap;
  max-width: 600px;
}


/* Styling for the text inside the crawl */
.crawl-text {
  display: inline-block;
  font-size: 1em;
  line-height: 1.5em;
  text-transform: uppercase;
  white-space: pre-wrap;
  max-width: 600px;
}


/* Main container for the prompt */
.arcade-container {
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  text-align: center;
  border: 2px solid #00FF00; /* CRT Green border */
  padding: 20px 40px;
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 15px #00FF00;
  animation: flicker 1.5s infinite alternate;
}

/* Header styling */
.arcade-container h2 {
  font-size: 1.5em;
  line-height: 1.5;
  margin: 0;
  color: #FF0000; /* Red color for classic arcade game text */
  text-shadow: 0 0 5px #FF0000, 0 0 10px #FF0000;
  animation: flicker-text 2s infinite alternate;
}

/* Button styling */
.arcade-container button {
  background-color: #000;
  color: #00FF00;
  border: 2px solid #00FF00;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0px 0px 5px #00FF00;
  text-shadow: 0px 0px 5px #00FF00;
  transition: background-color 0.2s ease;
}

/* Button hover effect */
.arcade-container button:hover {
  background-color: #00FF00;
  color: #000;
  box-shadow: 0px 0px 15px #00FF00, 0px 0px 30px #00FF00;
}

/* Flicker animation for border and text */
@keyframes flicker {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

/* Flicker animation for header text */
@keyframes flicker-text {
  0% { opacity: 1; text-shadow: 0px 0px 10px #FF0000, 0px 0px 20px #FF0000; }
  50% { opacity: 0.6; text-shadow: none; }
  100% { opacity: 1; text-shadow: 0px 0px 10px #FF0000, 0px 0px 20px #FF0000; }
}
</style>

