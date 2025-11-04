<template>
  <div class="homepage">
    <Starfield />

    <div class="content-wrapper">
      <div class="terminal-container">
        <div class="terminal-header">
          <span class="terminal-title">HELIOSPHERE MAINTENANCE TERMINAL</span>
          <span class="terminal-status">[ ACTIVE ]</span>
        </div>

        <div class="game-title">
          <h1 class="glitch-text">NIGHTSHIFT</h1>
        </div>

        <div class="game-info">
          <p class="tagline">ORBITAL DEBRIS CLEARANCE PROTOCOL</p>
          <p class="subtext">The hyperspace lanes won't clean themselves</p>
        </div>

        <div class="action-container">
          <NuxtLink to="/anthology/asteroids" class="play-button">
            <span class="bracket">[</span> BEGIN SHIFT <span class="bracket">]</span>
          </NuxtLink>
        </div>

        <div class="footer-info">
          <p class="small-text">Bite Game Studio • 2024</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Starfield from "~/components/Starfield.vue";
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.homepage {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 800px;
  padding: 20px;
}

.terminal-container {
  background: rgba(0, 20, 0, 0.85);
  border: 2px solid #00ff00;
  box-shadow:
    0 0 20px rgba(0, 255, 0, 0.3),
    inset 0 0 60px rgba(0, 255, 0, 0.05);
  padding: 30px;
  font-family: 'Press Start 2P', monospace;
  color: #00ff00;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #00ff00;
  margin-bottom: 40px;
  font-size: 0.6em;
  flex-wrap: wrap;
  gap: 10px;
}

.terminal-title {
  opacity: 0.8;
}

.terminal-status {
  animation: pulse 2s infinite;
}

.game-title {
  text-align: center;
  margin: 60px 0 40px 0;
}

.glitch-text {
  font-size: 3em;
  letter-spacing: 0.1em;
  text-shadow:
    0 0 10px #00ff00,
    0 0 20px #00ff00,
    0 0 30px #00ff00;
  animation: flicker 4s infinite alternate;
  margin: 0;
}

.game-info {
  text-align: center;
  margin: 40px 0;
}

.tagline {
  font-size: 0.9em;
  margin: 0 0 20px 0;
  letter-spacing: 0.05em;
}

.subtext {
  font-size: 0.6em;
  opacity: 0.7;
  margin: 0;
  font-style: italic;
}

.action-container {
  text-align: center;
  margin: 60px 0 40px 0;
}

.play-button {
  display: inline-block;
  background: transparent;
  border: 3px solid #00ff00;
  color: #00ff00;
  padding: 20px 40px;
  font-family: 'Press Start 2P', monospace;
  font-size: 1.1em;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.play-button:hover {
  background-color: #00ff00;
  color: #000;
  box-shadow:
    0 0 20px rgba(0, 255, 0, 0.8),
    0 0 30px rgba(0, 255, 0, 0.6);
  transform: scale(1.05);
}

.play-button .bracket {
  font-size: 1.2em;
}

.footer-info {
  text-align: center;
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 255, 0, 0.3);
}

.small-text {
  font-size: 0.5em;
  opacity: 0.5;
  margin: 0;
}

@keyframes flicker {
  0%, 100% {
    opacity: 1;
    text-shadow:
      0 0 10px #00ff00,
      0 0 20px #00ff00,
      0 0 30px #00ff00;
  }
  50% {
    opacity: 0.85;
    text-shadow:
      0 0 5px #00ff00,
      0 0 10px #00ff00;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Responsive design */
@media (max-width: 768px) {
  .terminal-container {
    padding: 20px;
  }

  .glitch-text {
    font-size: 2em;
  }

  .tagline {
    font-size: 0.7em;
  }

  .play-button {
    padding: 15px 30px;
    font-size: 0.9em;
  }

  .terminal-header {
    font-size: 0.5em;
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .glitch-text {
    font-size: 1.5em;
  }

  .tagline {
    font-size: 0.6em;
  }

  .subtext {
    font-size: 0.5em;
  }

  .play-button {
    padding: 12px 24px;
    font-size: 0.7em;
  }
}
</style>