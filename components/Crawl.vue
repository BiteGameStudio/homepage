<template>
  <div id="crawl">

    <!-- Controls -->
    <div class="controls">
      <button @click="play" :disabled="isCrawling">Start Crawl</button>
      <button @click="skipCrawl" :disabled="!isCrawling">Skip</button>
    </div>

    <!-- Crawl Container -->
    <div class="crawl-container">
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
          <h1>Welcome to the arcade anthology.</h1>
        </div>
      </div>
    </div>

    <!-- Audio Elements -->
<!--    <audio class="intro" id="CataclysmicShadows">-->
<!--      <source src="/m/Cataclysmic-Shadows.mp3" type="audio/mpeg" />-->
<!--      Your browser does not support the audio element.-->
<!--    </audio>-->

<!--    <audio class="intro" id="CelestialCollapse">-->
<!--      <source src="/m/Celestial-Collapse.mp3" type="audio/mpeg" />-->
<!--      Your browser does not support the audio element.-->
<!--    </audio>-->

    <audio class="intro" id="CelestialFracture">
      <source src="/m/Celestial-Fracture.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <!-- Typing sound effect -->
    <audio id="typingSound">
      <source src="/s/typing.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";


const crawlElement = ref(null);
const isCrawling = ref(false);


  // Play all intro audio elements
function play(){
  const el = document.querySelector('.crawl');
  el.classList.add('go');
  const audioElements = document.querySelectorAll('audio.intro');
  audioElements.forEach((audio) => {
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  });

}



// Function to stop audio and skip crawl
// const skipCrawl = () => {
//   if (!isCrawling.value) return; // Nothing to skip
//   isCrawling.value = false;
//
//   // Pause and reset all audio elements
//   const audioElements = document.querySelectorAll('audio');
//   audioElements.forEach((audio) => {
//     audio.pause();
//     audio.currentTime = 0;
//   });
//
//   // Stop the crawl animation and set to final state
//   if (crawlElement.value) {
//     crawlElement.value.style.animation = 'none';
//     crawlElement.value.style.transform = 'rotateX(25deg) translateY(-150vh) translateZ(-2000px)';
//     crawlElement.value.style.opacity = '0';
//   }
// };
//


// Handle crawl animation end
// const onCrawlAnimationEnd = () => {
//   if (isCrawling.value) { // If not skipped
//     console.log("Crawl ended naturally.");
//     isCrawling.value = false;
//     // Wait 1 second after the crawl ends
//     setTimeout(() => {
//       showArcadeContainer();
//     }, 1000);
//   }
// };
const onCrawlAnimationStart = () => {
  console.log("Crawl animation has started.");
  // Add any additional logic you want to execute when the animation starts
};
const onCrawlAnimationEnd = () => {
  console.log("Crawl animation has ended.");
  // Add any additional logic you want to execute when the animation starts
};


onMounted(() => {

  if (crawlElement.value) {
    crawlElement.value.addEventListener('animationstart', onCrawlAnimationStart);
    crawlElement.value.addEventListener('animationend', onCrawlAnimationEnd);
  }
});

onBeforeUnmount(() => {
  skipCrawl(); // Existing cleanup function
  if (crawlElement.value) {
    crawlElement.value.removeEventListener('animationstart', onCrawlAnimationStart);
    crawlElement.value.removeEventListener('animationend', onCrawlAnimationEnd);
  }
});


// Lifecycle hooks
onMounted(() => {

  // if (crawlElement.value) {
  //   crawlElement.value.addEventListener('animationend', onCrawlAnimationEnd);
  // }
});

onBeforeUnmount(() => {
  // skipCrawl(); // Ensure audio is stopped and animation is reset
  // if (crawlElement.value) {
  //   crawlElement.value.removeEventListener('animationend', onCrawlAnimationEnd);
  // }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

h1 {
  line-height: 2;
}

#crawl{
  font-family: 'Press Start 2P', monospace;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top:0;
  left:0;
  z-index:100;
}

/* Controls (Start and Skip buttons) */
.controls {
  position: absolute;
  top: 20px;
  width: 100%;
  text-align: center;
  z-index: 2; /* Above starfield and crawl */
}

.controls button {
  padding: 10px 20px;
  font-size: 0.8em;
  background-color: rgba(0, 0, 0, 0.7);
  color: #00ff00;
  border: 2px solid #00ff00;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.controls button:hover {
  opacity: 1;
}

.controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Container that sets the perspective */
.crawl-container {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  width:   100vw ;


  z-index: 1000;

  transform: perspective(300px) rotateX(25deg);
  transform-origin: 50% 100%;
}

/* The crawl element */
.crawl {
  position: absolute;
  top: 100%;
  width: 100vw;
  text-align: center;

  color: #00ff00;
  z-index: 1;


  animation: crawl 240s linear forwards; /* Duration set to 120s */
}
@keyframes crawl {
  0% {
    top: 100%;

  }
  100% {
    top: -1000%;

  }
}


.crawl-text {
  width: 100%;
  margin: 0 auto;

  line-height: 1.5em;
  text-transform: uppercase;
  color: #00ff00;



}

.crawl-text h1 {
  font-size: 4vw;
  margin-bottom: 10vh;
  text-align: center;
}

.crawl-text p {
  font-size: 3vw;
  line-height: 2;
  padding: 0 10vw;
  color: #00ff00;
  text-align: justify;


}
</style>
