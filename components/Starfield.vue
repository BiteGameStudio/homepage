<!-- Starfield.vue -->
<template>
  <div class="starfield" ref="starfield"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const starfield = ref(null);

const generateStarfield = () => {
  const starCount = 200; // Number of stars
  const starfieldDiv = starfield.value;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Random position within the viewport
    const x = Math.random() * 100; // Percentage
    const y = Math.random() * 100; // Percentage
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;

    // Random twinkle duration between 2s and 5s
    star.style.animationDuration = `${(Math.random() * 30 + 2)}s`;

    starfieldDiv.appendChild(star);
  }
};

// Lifecycle hook to generate stars on mount
onMounted(() => {
  generateStarfield();
});
</script>

<style  >

.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black; /* Set background to black */

  z-index: 1; /* Ensure it's behind other elements */
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;

  background: #00FF00;
  border-radius: 50%;
  animation: twinkle 2s infinite;
  z-index: 100;

}

/* Twinkle Animation */
@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.2; }
}
</style>
