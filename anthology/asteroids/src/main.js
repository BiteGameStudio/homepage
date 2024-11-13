// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const storyTextDiv = document.getElementById('storyText');
const storyInstructionsDiv = document.getElementById('storyInstructions'); // Added instructions div

// Get audio elements
const ambientSound = document.getElementById('ambientSound');
const laserSound = document.getElementById('laserSound');
const bridgeSound = document.getElementById('shipBridgeSound');
const explosionSound = document.getElementById('explosionSound');
const shipExplosionSound = document.getElementById('shipExplosionSound');
const enemyLaserSound = document.getElementById('enemyLaserSound'); // Optional
const smartBombSound = document.getElementById('smartBombSound'); // New sound for Smart Bomb

// Color constants
const CRT_GREEN = '#00FF00';
const CRT_RED = '#FF0000'; // Bright red color
const CRT_PURPLE = '#FF00FF'; // Purple for enemy bullets
const CRT_AMBER = '#FFBF00';
const CRT_BLUE = '#00BFFF';
const CRT_YELLOW = '#FFFF00'; // Added for Smart Bomb effect

// Game variables

let round = 1;
const blobStartRound = 6; // Configure the round to start blobs
const enemyShipStartRound = 3; // Configure the round to start enemy ships
const enemyBaseStartRound = 1; // Configure the round to start enemy bases
const maxEnemyShips = 5; // Maximum number of enemy ships allowed



// Define the Game class
class Game {
    player1 = null
    player2=null
    constructor( player1Ship, player2Ship ) {

        this.player1 = player1Ship;
        this.player2 = player2Ship;

        // Get canvas and context
        this.canvas = canvas;
        this.ctx = ctx;
        this.storyTextDiv = storyTextDiv;
        this.storyInstructionsDiv = storyInstructionsDiv;

        // Get audio elements
        this.ambientSound = ambientSound;
        this.laserSound = laserSound;
        this.bridgeSound = bridgeSound;
        this.explosionSound = explosionSound;
        this.shipExplosionSound = shipExplosionSound;
        this.enemyLaserSound = enemyLaserSound;
        this.smartBombSound = smartBombSound;

        // Color constants
        this.CRT_GREEN = CRT_GREEN;
        this.CRT_RED = CRT_RED;
        this.CRT_PURPLE = CRT_PURPLE;
        this.CRT_AMBER = CRT_AMBER;
        this.CRT_BLUE = CRT_BLUE;
        this.CRT_YELLOW = CRT_YELLOW;

        // Game variables
        this.ship = this.player1 ;
        this.asteroids = [];
        this.bullets = [];
        this.enemyShips = [];

        this.explosions = [];
        this.blobs = [];
        this.smartBombs = [];

        this.inStoryMode = true;
        this.currentStoryPage = 0;
        this.shipDestroyed = false;

        // Initialize game
        this.init();
    }

    init() {

        this.shipDestroyed = false;

        // Create initial asteroids and blobs
        this.createAsteroids(round);
        if (round >= blobStartRound) {
            this.createBlobs(round % 2);
        }

        // Create enemy ships if the round is greater than or equal to the start round
        if (round >= enemyShipStartRound) {
            this.createEnemyShips(round % 2);
        }

        // Display the story
        this.inStoryMode = true;
        this.currentStoryPage = 0;
        this.displayStory();
    }

    createAsteroids(num) {
        for (let i = 0; i < num; i++) {
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (this.distanceBetweenPoints(this.ship.x, this.ship.y, x, y) < 100);

            // Determine asteroid color
            let color = this.CRT_GREEN; // Default color
            const redAsteroidChance = 0.01; // 1% chance for red asteroid
            const blueAsteroidChance = 0.5; // 1% chance for red asteroid
            if (round >= enemyBaseStartRound && Math.random() < redAsteroidChance) {
                color = this.CRT_RED;
            }

            if (  Math.random() < blueAsteroidChance) {
                color = this.CRT_BLUE;
            }

            this.asteroids.push(new Asteroid(x, y, 50, 1, color));
        }
    }

    createBlobs(num) {
        for (let i = 0; i < num; i++) {
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (this.distanceBetweenPoints(this.ship.x, this.ship.y, x, y) < 100);
            this.blobs.push(new Blob(x, y, 15));
        }
    }

    createEnemyShips(num) {
        for (let i = 0; i < num; i++) {
            if (this.enemyShips.length >= maxEnemyShips) break;
            let x, y;
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            } while (this.distanceBetweenPoints(this.ship.x, this.ship.y, x, y) < 150);
            this.enemyShips.push(new EnemyShip(x, y));
        }
    }

    displayStory() {
        if (this.currentStoryPage === 0) {
            this.storyTextDiv.innerHTML = ''; // Clear previous story content
            this.storyTextDiv.style.display = 'block'; // Ensure story text is visible
            this.storyInstructionsDiv.style.display = 'block'; // Show instructions
        }

        if (stories[round - 1] && stories[round - 1][this.currentStoryPage]) {
            // Create a new div for the story line
            const lineDiv = document.createElement('div');
            lineDiv.textContent = stories[round - 1][this.currentStoryPage];
            this.storyTextDiv.appendChild(lineDiv);
            this.currentStoryPage++;
        } else {
            // No more story pages, start the round
            this.inStoryMode = false;
            this.storyTextDiv.style.display = 'none';
            this.storyInstructionsDiv.style.display = 'none'; // Hide instructions
            this.canvas.style.display = 'block';

            // Play ambient sound
            this.ambientSound.currentTime = 0;
            this.ambientSound.play().catch(error => {
                console.error("Ambient sound playback failed:", error);
            });
        }
    }

    loop() {
        if (!this.inStoryMode) {
            // Update
            this.update();

            // Draw
            this.draw();
        }

        // Loop
        requestAnimationFrame(this.loop.bind(this));
    }

    update() {
        this.ship.update();



        // Bullets
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.life > bullet.maxLife) {
                this.bullets.splice(index, 1);
            }
        });

        // Asteroids
        this.asteroids.forEach((asteroid) => {
            asteroid.update(this.ship);
        });

        // Blobs
        this.blobs.forEach((blob) => {
            blob.update();
        });

        // Enemy Ships
        this.enemyShips.forEach((enemyShip) => {
            enemyShip.update( this.ship );
        });

        // Enemy Bullets
        this.enemyShips.forEach( (enemyShip, i) =>{
            enemyShip.enemyBullets.forEach((enemyBullet, index) => {
                enemyBullet.update();
                if (enemyBullet.life > enemyBullet.maxLife) {
                    enemyShip.enemyBullets.splice(index, 1);
                }
            });

        })



        // Explosions
        this.explosions.forEach((explosion, index) => {
            explosion.update();
            if (explosion.life > explosion.maxLife) {
                this.explosions.splice(index, 1);
            }
        });

        // Update Smart Bombs
        this.smartBombs.forEach((smartBomb, sbIndex) => {
            smartBomb.update();

            // Check for collisions with asteroids
            this.asteroids.forEach((asteroid, aIndex) => {
                if (this.distanceBetweenPoints(smartBomb.x, smartBomb.y, asteroid.x, asteroid.y) < smartBomb.radius + asteroid.radius) {
                    // Simulate asteroid being shot
                    this.handleAsteroidDestruction(aIndex);
                }
            });

            // Check for collisions with enemy ships
            this.enemyShips.forEach((enemyShip, esIndex) => {
                if (this.distanceBetweenPoints(smartBomb.x, smartBomb.y, enemyShip.x, enemyShip.y) < smartBomb.radius + enemyShip.radius) {
                    // Simulate enemy ship being shot
                    this.handleEnemyShipDestruction(esIndex, enemyShip.x, enemyShip.y);
                }
            });

            // Check for collisions with blobs
            this.blobs.forEach((blob, bIndex) => {
                if (this.distanceBetweenPoints(smartBomb.x, smartBomb.y, blob.x, blob.y) < smartBomb.radius + blob.radius) {
                    // Remove the blob
                    this.blobs.splice(bIndex, 1);
                    // Create explosion effect
                    this.createExplosion(blob.x, blob.y, blob.radius, '#00FF00');
                }
            });

            // Remove Smart Bomb if it's no longer active
            if (!smartBomb.active) {
                this.smartBombs.splice(sbIndex, 1);
            }
        });

        // Collision detection
        if (this.ship.alive) {
            // Ship collision with asteroids
            this.asteroids.forEach((asteroid, aIndex) => {
                if (
                    this.distanceBetweenPoints(this.ship.x, this.ship.y, asteroid.x, asteroid.y) <
                    this.ship.radius + asteroid.radius
                ) {
                    this.handleShipDestruction();
                }
            });

            // Ship collision with blobs
            this.blobs.forEach((blob) => {
                if (
                    this.distanceBetweenPoints(this.ship.x, this.ship.y, blob.x, blob.y) <
                    this.ship.radius + blob.radius
                ) {
                    this.handleShipDestruction();
                }
            });

            // Ship collision with enemy bullets

            this.enemyShips.forEach( (enemyShip, i) =>{

                enemyShip.enemyBullets.forEach((enemyBullet, ebIndex) => {
                    if (
                        this.distanceBetweenPoints(this.ship.x, this.ship.y, enemyBullet.x, enemyBullet.y) <
                        this.ship.radius + enemyBullet.radius
                    ) {
                        // Destroy the ship
                        this.handleShipDestruction();

                        // Remove the enemy bullet
                        enemyShip.enemyBullets.splice(ebIndex, 1);
                    }
                });
            })


            // Ship collision with enemy ships
            this.enemyShips.forEach((enemyShip, esIndex) => {
                if (
                    this.distanceBetweenPoints(this.ship.x, this.ship.y, enemyShip.x, enemyShip.y) <
                    this.ship.radius + enemyShip.radius
                ) {
                    this.handleShipDestruction();

                    // Remove the enemy ship upon collision
                    this.enemyShips.splice(esIndex, 1);
                }
            });
        }

        // Bullets and asteroids collision
        this.bullets.forEach((bullet, bIndex) => {
            this.asteroids.forEach((asteroid, aIndex) => {
                if (
                    this.distanceBetweenPoints(bullet.x, bullet.y, asteroid.x, asteroid.y) <
                    asteroid.radius
                ) {
                    this.bullets.splice(bIndex, 1);
                    this.handleAsteroidDestruction(aIndex);
                }
            });
        });

        // Bullets and enemy ships collision
        this.bullets.forEach((bullet, bIndex) => {
            this.enemyShips.forEach((enemyShip, esIndex) => {
                if (
                    this.distanceBetweenPoints(bullet.x, bullet.y, enemyShip.x, enemyShip.y) <
                    bullet.radius + enemyShip.radius
                ) {
                    this.bullets.splice(bIndex, 1);
                    this.handleEnemyShipDestruction(esIndex, enemyShip.x, enemyShip.y);
                }
            });
        });

        // Check if all asteroids and enemy ships are destroyed
        if (this.asteroids.length === 0 && this.explosions.length === 0 && this.enemyShips.length === 0 && !this.shipDestroyed) {
            // Stop ambient sound
            this.ambientSound.pause();

            round++;
            if (round > stories.length) {
                round = 1; // Reset to round 1 if stories are exhausted
            }
            this.inStoryMode = true;
            this.currentStoryPage = 0;
            this.storyTextDiv.style.display = 'block';
            this.canvas.style.display = 'none';
            this.displayStory();
            this.createAsteroids(round);
            if (round >= enemyShipStartRound) {
                this.createEnemyShips(round % 2);
            }
            if (round >= blobStartRound) {
                this.createBlobs(round % 2);
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw round number
        this.ctx.fillStyle = this.CRT_GREEN;
        this.ctx.font = '20px Courier New';
        this.ctx.fillText('Level: ' + round, 20, 30);

        // Draw ship
        this.ship.draw();

        // Draw bullets
        this.bullets.forEach((bullet) => {
            bullet.draw();
        });


        // Draw asteroid bullets
        this.asteroids.forEach( (asteroid, i) => {
            asteroid.bullets.forEach((bullet) => {
                bullet.draw();
            });
        });

        // Draw enemy bullets
        this.enemyShips.forEach( (enemyShip, i) => {
            enemyShip.enemyBullets.forEach((enemyBullet) => {
                enemyBullet.draw();
            });
        });

        // Draw asteroids
        this.asteroids.forEach((asteroid) => {
            asteroid.draw();
        });

        // Draw enemy ships
        this.enemyShips.forEach((enemyShip) => {
            enemyShip.draw();
        });

        // Draw blobs
        this.blobs.forEach((blob) => {
            blob.draw();
        });

        // Draw explosions
        this.explosions.forEach((explosion) => {
            explosion.draw();
        });

        // Draw Smart Bombs
        this.smartBombs.forEach((smartBomb) => {
            smartBomb.draw();
        });
    }




    distanceBetweenPoints(x1, y1, x2, y2) {
        return Math.hypot(x1 - x2, y1 - y2);
    }

    createExplosion(x, y, radius, color = this.CRT_GREEN) {
        let numParticles = 20;
        let colors = [color, '#00CC00', '#009900'];
        for (let i = 0; i < numParticles; i++) {
            let particleColor = colors[Math.floor(Math.random() * colors.length)];
            this.explosions.push(new Particle(x, y, particleColor));
        }
    }

    handleShipDestruction() {
        this.ship.alive = false;
        this.shipDestroyed = true;

        // Stop ambient sound
        this.ambientSound.pause();

        // Play ship explosion sound
        this.shipExplosionSound.currentTime = 0;
        this.shipExplosionSound.play().catch(error => {
            console.error("Ship explosion sound playback failed:", error);
        });

        // Create explosion at ship's position
        this.createExplosion(this.ship.x, this.ship.y, this.ship.radius, this.CRT_AMBER);

        // Set timeout to reset the game after 5 seconds
        setTimeout(() => {
            this.resetGame();
        }, 5000);
    }

    handleAsteroidDestruction(aIndex) {
        const asteroid = this.asteroids[aIndex];

        // Play explosion sound
        this.explosionSound.currentTime = 0;
        this.explosionSound.play().catch(error => {
            console.error("Explosion sound playback failed:", error);
        });

        // Create explosion
        this.createExplosion(asteroid.x, asteroid.y, asteroid.radius, asteroid.color);

        // Split asteroid
        if (asteroid.level < 3) {
            let newRadius = asteroid.radius / 2;
            for (let i = 0; i < 2; i++) {
                this.asteroids.push(
                    new Asteroid(asteroid.x, asteroid.y, newRadius, asteroid.level + 1, asteroid.color)
                );
            }
        }

        this.asteroids.splice(aIndex, 1);
    }

    handleEnemyShipDestruction(esIndex, x, y) {
        // Remove the enemy ship from the array
        this.enemyShips.splice(esIndex, 1);

        // Create explosion at the enemy ship's position with a different color
        this.createExplosion(x, y, 20, this.CRT_RED);

        // Play explosion sound
        this.explosionSound.currentTime = 0;
        this.explosionSound.play().catch(error => {
            console.error("Explosion sound playback failed:", error);
        });
    }

    resetGame() {
        this.ship = new Ship();
        this.shipDestroyed = false;
        this.asteroids = [];
        this.bullets = [];
        this.enemyShips = [];

        this.explosions = [];
        this.blobs = [];
        this.smartBombs = [];
        round = 1;
        this.inStoryMode = true;
        this.currentStoryPage = 0;
        this.storyTextDiv.style.display = 'block';
        this.canvas.style.display = 'none';
        this.displayStory();
        this.createAsteroids(round);
        if (round >= enemyShipStartRound) {
            this.createEnemyShips(round % 2);
        }
        if (round >= blobStartRound) {
            this.createBlobs(round % 2);
        }
    }

    playBridgeSound() {
        if (!this.bridgeSound.playing && !this.bridgeSound.paused) return;
        if (this.bridgeSound.paused) {
            this.bridgeSound.currentTime = 0;
            this.bridgeSound.play().catch(error => {
                console.error("Bridge sound playback failed:", error);
            });
        }
    }

    stopBridgeSound() {
        this.bridgeSound.pause();
    }
}


const player1  = new Ship( canvas);
const g = new Game( player1);

const keys={}

// Event listeners for key input
document.addEventListener('keydown', function(e) {
    keys[e.key] = true;



        if (g.inStoryMode) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault(); // Prevent default scrolling behavior
                g.displayStory();
            }

            if (e.key.toLowerCase() === 's') {
                e.preventDefault(); // Prevent default behavior
                // Skip the story and start the round
                g.inStoryMode = false;
                g.storyTextDiv.style.display = 'none';
                g.storyInstructionsDiv.style.display = 'none';
                g.canvas.style.display = 'block';

                // Play ambient sound
                g.ambientSound.currentTime = 0;
                g.ambientSound.play().catch(error => {
                    console.error("Ambient sound playback failed:", error);
                });
            }
        } else if (g.ship.alive) {
            // Shoot bullet
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault(); // Prevent default scrolling behavior

                if (g.ship.energy >= 0) {

                    g.bullets.push(new Bullet(g.ship.x, g.ship.y, g.ship.angle));
                    g.ship.energy = g.ship.energy  - 2; // Deplete energy

                    // Play laser sound
                    g.laserSound.currentTime = 0;
                    g.laserSound.play().catch(error => {
                        console.error("Laser sound playback failed:", error);
                    });
                }
            }

            // Activate Smart Bomb when 'S' is pressed and energy is full
            if (e.key.toLowerCase() === 's') {
                e.preventDefault(); // Prevent default behavior
                if (g.ship.energy >= g.ship.maxEnergy) {
                    // Activate Smart Bomb
                    g.smartBombs.push(new SmartBomb(g.ship.x, g.ship.y));
                    g.ship.energy = 0; // Deplete energy

                    // Play Smart Bomb activation sound
                    g.smartBombSound.currentTime = 0;
                    g.smartBombSound.play().catch(error => {
                        console.error("Smart Bomb sound playback failed:", error);
                    });
                } else {
                    // Optional: Provide feedback if energy is insufficient
                    console.log("Smart Bomb not ready. Energy at " + Math.floor(g.ship.energy) + "%");
                }
            }

            // Play ship bridge sound only when rotating
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                // To prevent multiple sounds from overlapping, check if the sound is already playing
                if (g.bridgeSound.paused) {
                    g.bridgeSound.currentTime = 0;
                    g.bridgeSound.play().catch(error => {
                        console.error("Bridge sound playback failed:", error);
                    });
                }
            }



                if (e.key === 'ArrowUp') {
                    g.ship.thrusters = true

                }
                if (e.key === 'ArrowLeft') {
                    g.ship.rotation = -0.05;
                    g.playBridgeSound();
                }

                    if (e.key === 'ArrowRight') {
                    g.ship.rotation = 0.05;
                    g.playBridgeSound();
                }



            // Prevent default behavior for arrow keys
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.key)) {
                e.preventDefault();
            }
        }


});

document.addEventListener('keyup', function(e) {
    keys[e.key] = false;

        // Stop bridge sound when arrow keys are released
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            g.ship.rotation = 0
            g.bridgeSound.pause();
            g.stopBridgeSound();
        }

    if (e.key === 'ArrowUp') {
        g.ship.thrusters = false

    }

});




// Start the animation loop
function animationloop(){
    g.loop();
}

// Kick off the animation loop
animationloop();
