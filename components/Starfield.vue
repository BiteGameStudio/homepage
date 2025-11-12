<!-- Starfield.vue -->
<template>
  <div class="starfield" ref="starfield"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const starfield = ref(null);

const generateStarfield = () => {
  const starCount = 100; // Reduced for calmer feel
  const starfieldDiv = starfield.value;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Random position within the viewport
    const x = Math.random() * 100; // Percentage
    const y = Math.random() * 100; // Percentage
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;

    // Slower, calmer twinkle
    star.style.animationDuration = `${(Math.random() * 4 + 3)}s`;

    starfieldDiv.appendChild(star);
  }
};

// Lifecycle hook to generate stars on mount
onMounted(() => {
  generateStarfield();
});
</script>

<style scoped>

.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: 1;
}

/* Subtle CRT scanline effect */
.starfield::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 255, 0, 0.02) 50%,
    transparent 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 2;
}

/* Subtle CRT glow */
.starfield::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.star {
  position: absolute;
  width: 1.5px;
  height: 1.5px;
  background: #00FF00;
  border-radius: 50%;
  animation: twinkle 3s infinite;
  z-index: 100;
  opacity: 0.6;
}

/* Calmer twinkle animation */
@keyframes twinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.2; }
}
</style>
