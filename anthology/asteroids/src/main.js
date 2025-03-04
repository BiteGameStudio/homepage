// src/main.js
// Define globals
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const storyTextDiv = document.getElementById('storyText');
const storyInstructionsDiv = document.getElementById('storyInstructions');

const ambientSound = document.getElementById('ambientSound');
const laserSound = document.getElementById('laserSound');
const bridgeSound = document.getElementById('shipBridgeSound');
const explosionSound = document.getElementById('explosionSound');
const shipExplosionSound = document.getElementById('shipExplosionSound');
const enemyLaserSound = document.getElementById('enemyLaserSound');
const smartBombSound = document.getElementById('smartBombSound');

// Define color constants globally
const CRT_GREEN = '#00FF00';
const CRT_RED = '#FF0000';
const CRT_PURPLE = '#FF00FF';
const CRT_AMBER = '#FFBF00';
const CRT_BLUE = '#00BFFF';
const CRT_YELLOW = '#FFFF00';

// Game class
class Game {
    constructor(player1Ship, config) {
        this.config = config;
        canvas.width = this.config.game.canvasWidth;
        canvas.height = this.config.game.canvasHeight;

        this.player1 = player1Ship;
        this.canvas = canvas;
        this.ctx = ctx;
        this.storyTextDiv = storyTextDiv;
        this.storyInstructionsDiv = storyInstructionsDiv;

        this.ambientSound = ambientSound;
        this.laserSound = laserSound;
        this.bridgeSound = bridgeSound;
        this.explosionSound = explosionSound;
        this.shipExplosionSound = shipExplosionSound;
        this.enemyLaserSound = enemyLaserSound;
        this.smartBombSound = smartBombSound;

        this.asteroids = [];
        this.bullets = [];
        this.enemyShips = [];
        this.explosions = [];
        this.blobs = [];
        this.smartBombs = [];
        this.empBlasts = []; // New array for EMP blasts

        this.inStoryMode = true;
        this.currentStoryPage = 0;
        this.shipDestroyed = false;

        this.init();
    }

    init() {
        this.shipDestroyed = false;
        this.createAsteroids(this.config.game.initialRound);
        if (this.config.game.initialRound >= this.config.blobs.startRound) {
            this.createBlobs(this.config.game.initialRound % 2);
        }
        if (this.config.game.initialRound >= this.config.enemyShips.startRound) {
            this.createEnemyShips(this.config.game.initialRound % 2);
        }
        this.inStoryMode = true;
        this.currentStoryPage = 0;
        this.displayStory();
    }

    createAsteroids(num) {
        const asteroidCount = num * this.config.asteroids.baseCountPerLevel;
        for (let i = 0; i < asteroidCount; i++) {
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (this.distanceBetweenPoints(this.player1.x, this.player1.y, x, y) < 100);

            let color = this.config.colors.crtGreen;
            if (num >= this.config.enemyShips.startRound && Math.random() < this.config.asteroids.redAsteroidChance) {
                color = this.config.colors.crtRed;
            } else if (Math.random() < this.config.asteroids.blueAsteroidChance) {
                color = this.config.colors.crtBlue;
            }

            this.asteroids.push(new Asteroid(x, y, this.config.asteroids.initialRadius, 1, color, this.config));
        }
    }

    createBlobs(num) {
        for (let i = 0; i < num; i++) {
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (this.distanceBetweenPoints(this.player1.x, this.player1.y, x, y) < 100);
            this.blobs.push(new Blob(x, y, null, this.config));
        }
    }

    createEnemyShips(num) {
        const enemyCount = Math.min(num, this.config.enemyShips.maxCount);
        for (let i = 0; i < enemyCount; i++) {
            if (this.enemyShips.length >= this.config.enemyShips.maxCount) break;
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (this.distanceBetweenPoints(this.player1.x, this.player1.y, x, y) < 150);
            this.enemyShips.push(new EnemyShip(x, y, this.config));
        }
    }

    displayStory() {
        if (this.currentStoryPage === 0) {
            this.storyTextDiv.innerHTML = '';
            this.storyTextDiv.style.display = 'block';
            this.storyInstructionsDiv.style.display = 'block';
        }
        if (stories[this.config.game.initialRound - 1] && stories[this.config.game.initialRound - 1][this.currentStoryPage]) {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = stories[this.config.game.initialRound - 1][this.currentStoryPage];
            this.storyTextDiv.appendChild(lineDiv);
            this.currentStoryPage++;
        } else {
            this.inStoryMode = false;
            this.storyTextDiv.style.display = 'none';
            this.storyInstructionsDiv.style.display = 'none';
            this.canvas.style.display = 'block';
            this.ambientSound.currentTime = 0;
            this.ambientSound.play().catch(error => console.error("Ambient sound playback failed:", error));
        }
    }

    loop() {
        if (!this.inStoryMode) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    update() {
        this.player1.update();

        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.life > this.config.bullets.maxLife) this.bullets.splice(index, 1);
        });

        this.asteroids.forEach(asteroid => asteroid.update(this.player1));
        this.blobs.forEach(blob => blob.update());
        this.enemyShips.forEach(enemyShip => enemyShip.update(this.player1));

        this.enemyShips.forEach(enemyShip => {
            enemyShip.enemyBullets.forEach((enemyBullet, index) => {
                enemyBullet.update();
                if (enemyBullet.life > this.config.enemyBullets.maxLife) enemyShip.enemyBullets.splice(index, 1);
            });
        });
        this.asteroids.forEach(asteroid => {
            asteroid.bullets.forEach((bullet, index) => {
                bullet.update();
                if (bullet.life > this.config.enemyBullets.maxLife) asteroid.bullets.splice(index, 1);
            });
        });

        this.explosions.forEach((explosion, index) => {
            explosion.update();
            if (explosion.life > this.config.particles.maxLife) this.explosions.splice(index, 1);
        });

        this.smartBombs.forEach((smartBomb, sbIndex) => {
            smartBomb.update();
            this.asteroids.forEach((asteroid, aIndex) => {
                if (this.distanceBetweenPoints(smartBomb.x, smartBomb.y, asteroid.x, asteroid.y) < smartBomb.radius + asteroid.radius) {
                    this.handleAsteroidDestruction(aIndex);
                }
            });
            this.enemyShips.forEach((enemyShip, esIndex) => {
                if (this.distanceBetweenPoints(smartBomb.x, smartBomb.y, enemyShip.x, enemyShip.y) < smartBomb.radius + enemyShip.radius) {
                    this.handleEnemyShipDestruction(esIndex, enemyShip.x, enemyShip.y);
                }
            });
            this.blobs.forEach((blob, bIndex) => {
                if (this.distanceBetweenPoints(smartBomb.x, smartBomb.y, blob.x, blob.y) < smartBomb.radius + blob.radius) {
                    this.blobs.splice(bIndex, 1);
                    this.createExplosion(blob.x, blob.y, blob.radius, '#00FF00');
                }
            });
            if (!smartBomb.active) this.smartBombs.splice(sbIndex, 1);
        });

        // Update EMP blasts
        this.empBlasts.forEach((empBlast, ebIndex) => {
            empBlast.update();
            if (!empBlast.active) {
                this.empBlasts.splice(ebIndex, 1);
            }
            if (this.player1.alive) {
                const distance = this.distanceBetweenPoints(this.player1.x, this.player1.y, empBlast.x, empBlast.y);
                console.log(`EMPBlast check: Distance ${distance.toFixed(1)}, EMP Radius ${empBlast.radius.toFixed(1)}, Max Radius ${empBlast.maxRadius}`);
                if (distance < empBlast.radius) {
                    const maxDistance = empBlast.maxRadius;
                    const distanceFactor = Math.max(0, 1 - (distance / maxDistance));
                    let baseDrain, minDrain;
                    if (empBlast.level === 1) {
                        baseDrain = 99;
                        minDrain = 30;
                    } else if (empBlast.level === 3) {
                        baseDrain = 40;
                        minDrain = 10;
                    } else {
                        baseDrain = 69.5;
                        minDrain = 20;
                    }
                    const drainPercentage = minDrain + (baseDrain - minDrain) * distanceFactor;
                    const energyDrain = (drainPercentage / 100) * this.player1.maxEnergy;
                    this.player1.energy = Math.max(0, this.player1.energy - energyDrain);
                    console.log(`EMPBlast hit! Drained ${energyDrain.toFixed(1)} energy (Distance: ${distance.toFixed(1)}, Level: ${empBlast.level}, Factor: ${distanceFactor.toFixed(2)})`);
                    empBlast.active = false; // One-time hit
                }
            }
        });

        // Collision detection with shield protection
        if (this.player1.alive && !this.player1.shieldActive) {
            this.asteroids.forEach((asteroid, aIndex) => {
                if (this.distanceBetweenPoints(this.player1.x, this.player1.y, asteroid.x, asteroid.y) < this.player1.radius + asteroid.radius) {
                    this.handleShipDestruction();
                }
            });

            this.blobs.forEach((blob, bIndex) => {
                if (this.distanceBetweenPoints(this.player1.x, this.player1.y, blob.x, blob.y) < this.player1.radius + blob.radius) {
                    this.handleShipDestruction();
                }
            });

            this.enemyShips.forEach((enemyShip, esIndex) => {
                if (this.distanceBetweenPoints(this.player1.x, this.player1.y, enemyShip.x, enemyShip.y) < this.player1.radius + enemyShip.radius) {
                    this.handleShipDestruction();
                    this.enemyShips.splice(esIndex, 1);
                }
            });

            this.enemyShips.forEach(enemyShip => {
                enemyShip.enemyBullets.forEach((enemyBullet, ebIndex) => {
                    if (this.distanceBetweenPoints(this.player1.x, this.player1.y, enemyBullet.x, enemyBullet.y) < this.player1.radius + enemyBullet.radius) {
                        this.handleShipDestruction();
                        enemyShip.enemyBullets.splice(ebIndex, 1);
                    }
                });
            });

            this.asteroids.forEach(asteroid => {
                asteroid.bullets.forEach((bullet, bIndex) => {
                    if (this.distanceBetweenPoints(this.player1.x, this.player1.y, bullet.x, bullet.y) < this.player1.radius + bullet.radius) {
                        this.handleShipDestruction();
                        asteroid.bullets.splice(bIndex, 1);
                    }
                });
            });
        }

        // Player bullets vs. asteroids with EMP effect
        this.bullets.forEach((bullet, bIndex) => {
            this.asteroids.forEach((asteroid, aIndex) => {
                if (this.distanceBetweenPoints(bullet.x, bullet.y, asteroid.x, asteroid.y) < bullet.radius + asteroid.radius) {
                    this.bullets.splice(bIndex, 1);
                    this.handleAsteroidDestruction(aIndex);
                    return;
                }
            });
        });

        // Player bullets vs. enemy ships
        this.bullets.forEach((bullet, bIndex) => {
            this.enemyShips.forEach((enemyShip, esIndex) => {
                if (this.distanceBetweenPoints(bullet.x, bullet.y, enemyShip.x, enemyShip.y) < bullet.radius + enemyShip.radius) {
                    this.bullets.splice(bIndex, 1);
                    this.handleEnemyShipDestruction(esIndex, enemyShip.x, enemyShip.y);
                    return;
                }
            });
        });

        if (this.asteroids.length === 0 && this.explosions.length === 0 && this.enemyShips.length === 0 && !this.shipDestroyed) {
            this.ambientSound.pause();
            this.config.game.initialRound++;
            if (this.config.game.initialRound > stories.length) {
                this.config.game.initialRound = 1;
            }
            this.inStoryMode = true;
            this.currentStoryPage = 0;
            this.storyTextDiv.style.display = 'block';
            this.canvas.style.display = 'none';
            this.displayStory();
            this.createAsteroids(this.config.game.initialRound);
            if (this.config.game.initialRound >= this.config.enemyShips.startRound) {
                this.createEnemyShips(this.config.game.initialRound % 2);
            }
            if (this.config.game.initialRound >= this.config.blobs.startRound) {
                this.createBlobs(this.config.game.initialRound % 2);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.config.colors.crtGreen;
        this.ctx.font = '20px Courier New';
        this.ctx.fillText('Level: ' + this.config.game.initialRound, 20, 30);
        this.player1.draw();
        this.bullets.forEach(bullet => bullet.draw());
        this.asteroids.forEach(asteroid => {
            asteroid.bullets.forEach(bullet => bullet.draw());
            asteroid.draw();
        });
        this.enemyShips.forEach(enemyShip => {
            enemyShip.enemyBullets.forEach(bullet => bullet.draw());
            enemyShip.draw();
        });
        this.blobs.forEach(blob => blob.draw());
        this.explosions.forEach(explosion => explosion.draw());
        this.smartBombs.forEach(smartBomb => smartBomb.draw());
        this.empBlasts.forEach(empBlast => empBlast.draw()); // Draw EMP blasts
    }

    distanceBetweenPoints(x1, y1, x2, y2) {
        return Math.hypot(x1 - x2, y1 - y2);
    }

    createExplosion(x, y, radius, color = this.config.colors.crtGreen) {
        let numParticles = 20;
        let colors = [color, '#00CC00', '#009900'];
        for (let i = 0; i < numParticles; i++) {
            let particleColor = colors[Math.floor(Math.random() * colors.length)];
            this.explosions.push(new Particle(x, y, particleColor, this.config));
        }
    }

    handleShipDestruction() {
        this.player1.alive = false;
        this.shipDestroyed = true;
        this.ambientSound.pause();
        this.shipExplosionSound.currentTime = 0;
        this.shipExplosionSound.play().catch(error => console.error("Ship explosion sound playback failed:", error));
        this.createExplosion(this.player1.x, this.player1.y, this.config.ship.radius, this.config.colors.crtAmber);
        setTimeout(() => this.resetGame(), 5000);
    }

    handleAsteroidDestruction(aIndex) {
        const asteroid = this.asteroids[aIndex];
        this.explosionSound.currentTime = 0;
        this.explosionSound.play().catch(error => console.error("Explosion sound playback failed:", error));
        this.createExplosion(asteroid.x, asteroid.y, asteroid.radius, asteroid.color);
        if (asteroid.shouldTriggerEMP()) {
            this.empBlasts.push(new EMPBlast(asteroid.x, asteroid.y, asteroid.level, this.config));
        }
        if (asteroid.level < this.config.asteroids.maxLevels) {
            let newRadius = asteroid.radius / 2;
            for (let i = 0; i < 2; i++) {
                this.asteroids.push(new Asteroid(asteroid.x, asteroid.y, newRadius, asteroid.level + 1, asteroid.color, this.config));
            }
        }
        this.asteroids.splice(aIndex, 1);
    }

    handleEnemyShipDestruction(esIndex, x, y) {
        this.enemyShips.splice(esIndex, 1);
        this.createExplosion(x, y, this.config.enemyShips.radius, this.config.colors.crtRed);
        this.explosionSound.currentTime = 0;
        this.explosionSound.play().catch(error => console.error("Explosion sound playback failed:", error));
    }

    resetGame() {
        this.player1 = new Ship(this.config);
        this.shipDestroyed = false;
        this.asteroids = [];
        this.bullets = [];
        this.enemyShips = [];
        this.explosions = [];
        this.blobs = [];
        this.smartBombs = [];
        this.empBlasts = []; // Reset EMP blasts
        this.config.game.initialRound = 1;
        this.inStoryMode = true;
        this.currentStoryPage = 0;
        this.storyTextDiv.style.display = 'block';
        this.canvas.style.display = 'none';
        this.displayStory();
        this.createAsteroids(this.config.game.initialRound);
    }

    playBridgeSound() {
        if (!this.bridgeSound.playing && !this.bridgeSound.paused) return;
        if (this.bridgeSound.paused) {
            this.bridgeSound.currentTime = 0;
            this.bridgeSound.play().catch(error => console.error("Bridge sound playback failed:", error));
        }
    }

    stopBridgeSound() {
        this.bridgeSound.pause();
    }
}

function startGame(config) {
    const player1 = new Ship(config);
    const g = new Game(player1, config);
    const keys = {};

    document.addEventListener('keydown', function(e) {
        keys[e.key] = true;
        if (g.inStoryMode) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                g.displayStory();
            }
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                g.inStoryMode = false;
                g.storyTextDiv.style.display = 'none';
                g.storyInstructionsDiv.style.display = 'none';
                g.canvas.style.display = 'block';
                g.ambientSound.currentTime = 0;
                g.ambientSound.play().catch(error => console.error("Ambient sound playback failed:", error));
            }
        } else if (g.player1.alive) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                if (g.player1.energy >= 0) {
                    g.bullets.push(new Bullet(g.player1.x, g.player1.y, g.player1.angle, config));
                    g.player1.energy -= config.ship.energy.bulletCost;
                    g.laserSound.currentTime = 0;
                    g.laserSound.play().catch(error => console.error("Laser sound playback failed:", error));
                }
            }
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                if (g.player1.energy >= config.ship.energy.max) {
                    g.smartBombs.push(new SmartBomb(g.player1.x, g.player1.y, config));
                    g.player1.energy = 0;
                    g.smartBombSound.currentTime = 0;
                    g.smartBombSound.play().catch(error => console.error("Smart Bomb sound playback failed:", error));
                } else {
                    console.log("Smart Bomb not ready. Energy at " + Math.floor(g.player1.energy) + "%");
                }
            }
            if (e.key.toLowerCase() === 'p') {
                e.preventDefault();
                g.player1.toggleShield();
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (g.bridgeSound.paused) {
                    g.bridgeSound.currentTime = 0;
                    g.bridgeSound.play().catch(error => console.error("Bridge sound playback failed:", error));
                }
            }
            if (e.key === 'ArrowUp') g.player1.thrusters = true;
            if (e.key === 'ArrowLeft') g.player1.rotation = -0.05;
            if (e.key === 'ArrowRight') g.player1.rotation = 0.05;
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.key)) e.preventDefault();
        }
    });

    document.addEventListener('keyup', function(e) {
        keys[e.key] = false;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            g.player1.rotation = 0;
            g.stopBridgeSound();
        }
        if (e.key === 'ArrowUp') g.player1.thrusters = false;
    });

    function animationloop() {
        g.loop();
    }
    animationloop();
}