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
const AMBER = '#FFBF00';
const CRT_BLUE = '#00BFFF';
const CRT_YELLOW = '#FFFF00'; // Added for Smart Bomb effect

// Game variables
let ship;
let asteroids = [];
let bullets = [];
let enemyShips = []; // Array to hold enemy ships
let enemyBullets = []; // Array to hold enemy bullets
let explosions = [];
let blobs = []; // Array to hold blobs
let smartBombs = []; // Array to hold active Smart Bombs
let keys = {};
let round = 1;
let inStoryMode = true;
let currentStoryPage = 0;
let shipDestroyed = false;
const blobStartRound = 6; // Configure the round to start blobs
const enemyShipStartRound = 3; // Configure the round to start enemy ships
const enemyBaseStartRound = 4; // Configure the round to start enemy bases
const maxEnemyShips = 5; // Maximum number of enemy ships allowed

// Story arrays







// Initialize game
function init() {
    ship = new Ship();
    shipDestroyed = false;

    // Create initial asteroids and blobs
    createAsteroids(round);
    if (round >= blobStartRound) {
        createBlobs(round % 2);
    }

    // Create enemy ships if the round is greater than or equal to the start round
    if (round >= enemyShipStartRound) {
        createEnemyShips(round % 2);
    }

    // Display the story
    inStoryMode = true;
    currentStoryPage = 0;
    displayStory();

    // Event listeners
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    // Start game loop
    gameLoop();
}

// Function to create asteroids
function createAsteroids(num) {
    for (let i = 0; i < num; i++) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (distanceBetweenPoints(ship.x, ship.y, x, y) < 100);

        // Determine asteroid color
        let color = CRT_GREEN; // Default color
        const redAsteroidChance = 0.01; // 1% chance for red asteroid
        if (round >= enemyBaseStartRound && Math.random() < redAsteroidChance) {
            color = CRT_RED;
        }

        asteroids.push(new Asteroid(x, y, 50, 1, color));
    }
}

// Function to create blobs
function createBlobs(num) {
    for (let i = 0; i < num; i++) {
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (distanceBetweenPoints(ship.x, ship.y, x, y) < 100);
        blobs.push(new Blob(x, y, 15));
    }
}

// Function to create enemy ships
function createEnemyShips(num) {
    for (let i = 0; i < num; i++) {
        if (enemyShips.length >= maxEnemyShips) break;
        let x, y;
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (distanceBetweenPoints(ship.x, ship.y, x, y) < 150);
        enemyShips.push(new EnemyShip(x, y));
    }
}

// Function to display the story
function displayStory() {
    if (currentStoryPage === 0) {
        storyTextDiv.innerHTML = ''; // Clear previous story content
        storyTextDiv.style.display = 'block'; // Ensure story text is visible
        storyInstructionsDiv.style.display = 'block'; // Show instructions
    }

    if (stories[round - 1] && stories[round - 1][currentStoryPage]) {
        // Create a new div for the story line
        const lineDiv = document.createElement('div');
        lineDiv.textContent = stories[round - 1][currentStoryPage];
        storyTextDiv.appendChild(lineDiv);
        currentStoryPage++;
    } else {
        // No more story pages, start the round
        inStoryMode = false;
        storyTextDiv.style.display = 'none';
        storyInstructionsDiv.style.display = 'none'; // Hide instructions
        canvas.style.display = 'block';

        // Play ambient sound
        ambientSound.currentTime = 0;
        ambientSound.play().catch(error => {
            console.error("Ambient sound playback failed:", error);
        });
    }
}

// Game loop
function gameLoop() {
    if (!inStoryMode) {
        // Update
        update();

        // Draw
        draw();
    }

    // Loop
    requestAnimationFrame(gameLoop);
}

function update() {
    ship.update();

    // Rotate ship
    if (ship.alive) {
        if (keys['ArrowLeft']) {
            ship.rotation = -0.05;
            playBridgeSound();
        } else if (keys['ArrowRight']) {
            ship.rotation = 0.05;
            playBridgeSound();
        } else {
            ship.rotation = 0;
            stopBridgeSound();
        }
    } else {
        ship.rotation = 0;
        stopBridgeSound();
    }

    // Bullets
    bullets.forEach((bullet, index) => {
        bullet.update();
        if (bullet.life > bullet.maxLife) {
            bullets.splice(index, 1);
        }
    });

    // Asteroids
    asteroids.forEach((asteroid) => {
        asteroid.update();
    });

    // Blobs
    blobs.forEach((blob) => {
        blob.update();
    });

    // Enemy Ships
    enemyShips.forEach((enemyShip) => {
        enemyShip.update();
    });

    // Enemy Bullets
    enemyBullets.forEach((enemyBullet, index) => {
        enemyBullet.update();
        if (enemyBullet.life > enemyBullet.maxLife) {
            enemyBullets.splice(index, 1);
        }
    });

    // Explosions
    explosions.forEach((explosion, index) => {
        explosion.update();
        if (explosion.life > explosion.maxLife) {
            explosions.splice(index, 1);
        }
    });

    // Update Smart Bombs
    smartBombs.forEach((smartBomb, sbIndex) => {
        smartBomb.update();

        // Check for collisions with asteroids
        asteroids.forEach((asteroid, aIndex) => {
            if (distanceBetweenPoints(smartBomb.x, smartBomb.y, asteroid.x, asteroid.y) < smartBomb.radius + asteroid.radius) {
                // Simulate asteroid being shot
                handleAsteroidDestruction(aIndex);
            }
        });

        // Check for collisions with enemy ships
        enemyShips.forEach((enemyShip, esIndex) => {
            if (distanceBetweenPoints(smartBomb.x, smartBomb.y, enemyShip.x, enemyShip.y) < smartBomb.radius + enemyShip.radius) {
                // Simulate enemy ship being shot
                handleEnemyShipDestruction(esIndex, enemyShip.x, enemyShip.y);
            }
        });

        // Check for collisions with blobs
        blobs.forEach((blob, bIndex) => {
            if (distanceBetweenPoints(smartBomb.x, smartBomb.y, blob.x, blob.y) < smartBomb.radius + blob.radius) {
                // Remove the blob
                blobs.splice(bIndex, 1);
                // Create explosion effect
                createExplosion(blob.x, blob.y, blob.radius, '#00FF00');
            }
        });

        // Remove Smart Bomb if it's no longer active
        if (!smartBomb.active) {
            smartBombs.splice(sbIndex, 1);
        }
    });

    // Collision detection
    if (ship.alive) {
        // Ship collision with asteroids
        asteroids.forEach((asteroid, aIndex) => {
            if (
                distanceBetweenPoints(ship.x, ship.y, asteroid.x, asteroid.y) <
                ship.radius + asteroid.radius
            ) {
                handleShipDestruction();
            }
        });

        // Ship collision with blobs
        blobs.forEach((blob) => {
            if (
                distanceBetweenPoints(ship.x, ship.y, blob.x, blob.y) <
                ship.radius + blob.radius
            ) {
                handleShipDestruction();
            }
        });

        // Ship collision with enemy bullets
        enemyBullets.forEach((enemyBullet, ebIndex) => {
            if (
                distanceBetweenPoints(ship.x, ship.y, enemyBullet.x, enemyBullet.y) <
                ship.radius + enemyBullet.radius
            ) {
                // Destroy the ship
                handleShipDestruction();

                // Remove the enemy bullet
                enemyBullets.splice(ebIndex, 1);
            }
        });

        // Ship collision with enemy ships
        enemyShips.forEach((enemyShip, esIndex) => {
            if (
                distanceBetweenPoints(ship.x, ship.y, enemyShip.x, enemyShip.y) <
                ship.radius + enemyShip.radius
            ) {
                handleShipDestruction();

                // Remove the enemy ship upon collision
                enemyShips.splice(esIndex, 1);
            }
        });
    }

    // Bullets and asteroids collision
    bullets.forEach((bullet, bIndex) => {
        asteroids.forEach((asteroid, aIndex) => {
            if (
                distanceBetweenPoints(bullet.x, bullet.y, asteroid.x, asteroid.y) <
                asteroid.radius
            ) {
                bullets.splice(bIndex, 1);
                handleAsteroidDestruction(aIndex);
            }
        });
    });

    // Bullets and enemy ships collision
    bullets.forEach((bullet, bIndex) => {
        enemyShips.forEach((enemyShip, esIndex) => {
            if (
                distanceBetweenPoints(bullet.x, bullet.y, enemyShip.x, enemyShip.y) <
                bullet.radius + enemyShip.radius
            ) {
                bullets.splice(bIndex, 1);
                handleEnemyShipDestruction(esIndex, enemyShip.x, enemyShip.y);
            }
        });
    });

    // Check if all asteroids and enemy ships are destroyed
    if (asteroids.length === 0 && explosions.length === 0 && enemyShips.length === 0 && !shipDestroyed) {
        // Stop ambient sound
        ambientSound.pause();

        round++;
        if (round > stories.length) {
            round = 1; // Reset to round 1 if stories are exhausted
        }
        inStoryMode = true;
        currentStoryPage = 0;
        storyTextDiv.style.display = 'block';
        canvas.style.display = 'none';
        displayStory();
        createAsteroids(round);
        if (round >= enemyShipStartRound) {
            createEnemyShips(round % 2);
        }
        if (round >= blobStartRound) {
            createBlobs(round % 2);
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw round number
    ctx.fillStyle = CRT_GREEN;
    ctx.font = '20px Courier New';
    ctx.fillText('Level: ' + round, 20, 30);

    // Draw ship
    ship.draw();

    // Draw bullets
    bullets.forEach((bullet) => {
        bullet.draw();
    });

    // Draw enemy bullets
    enemyBullets.forEach((enemyBullet) => {
        enemyBullet.draw();
    });

    // Draw asteroids
    asteroids.forEach((asteroid) => {
        asteroid.draw();
    });

    // Draw enemy ships
    enemyShips.forEach((enemyShip) => {
        enemyShip.draw();
    });

    // Draw blobs
    blobs.forEach((blob) => {
        blob.draw();
    });

    // Draw explosions
    explosions.forEach((explosion) => {
        explosion.draw();
    });

    // Draw Smart Bombs
    smartBombs.forEach((smartBomb) => {
        smartBomb.draw();
    });
}

function keyDown(e) {
    keys[e.key] = true;

    if (inStoryMode) {
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault(); // Prevent default scrolling behavior
            displayStory();
        }

        if (e.key.toLowerCase() === 's') {
            e.preventDefault(); // Prevent default behavior
            // Skip the story and start the round
            inStoryMode = false;
            storyTextDiv.style.display = 'none';
            storyInstructionsDiv.style.display = 'none';
            canvas.style.display = 'block';

            // Play ambient sound
            ambientSound.currentTime = 0;
            ambientSound.play().catch(error => {
                console.error("Ambient sound playback failed:", error);
            });
        }
    } else if (ship.alive) {
        // Shoot bullet
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault(); // Prevent default scrolling behavior

            if (ship.energy >= 0) {

                bullets.push(new Bullet(ship.x, ship.y, ship.angle));
                ship.energy = ship.energy  - 2; // Deplete energy

                // Play laser sound
                laserSound.currentTime = 0;
                laserSound.play().catch(error => {
                    console.error("Laser sound playback failed:", error);
                });
            }



        }

        // Activate Smart Bomb when 'S' is pressed and energy is full
        if (e.key.toLowerCase() === 's') {
            e.preventDefault(); // Prevent default behavior
            if (ship.energy >= ship.maxEnergy) {
                // Activate Smart Bomb
                smartBombs.push(new SmartBomb(ship.x, ship.y));
                ship.energy = 0; // Deplete energy

                // Play Smart Bomb activation sound
                smartBombSound.currentTime = 0;
                smartBombSound.play().catch(error => {
                    console.error("Smart Bomb sound playback failed:", error);
                });
            } else {
                // Optional: Provide feedback if energy is insufficient
                console.log("Smart Bomb not ready. Energy at " + Math.floor(ship.energy) + "%");
            }
        }

        // Play ship bridge sound only when rotating
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            // To prevent multiple sounds from overlapping, check if the sound is already playing
            if (bridgeSound.paused) {
                bridgeSound.currentTime = 0;
                bridgeSound.play().catch(error => {
                    console.error("Bridge sound playback failed:", error);
                });
            }
        }

        // Prevent default behavior for arrow keys
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
        }
    }
}

function keyUp(e) {
    keys[e.key] = false;

    // Stop bridge sound when arrow keys are released
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        bridgeSound.pause();
    }
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}

function createExplosion(x, y, radius, color = CRT_GREEN) {
    let numParticles = 20;
    let colors = [color, '#00CC00', '#009900'];
    for (let i = 0; i < numParticles; i++) {
        let particleColor = colors[Math.floor(Math.random() * colors.length)];
        explosions.push(new Particle(x, y, particleColor));
    }
}

function handleShipDestruction() {
    ship.alive = false;
    shipDestroyed = true;

    // Stop ambient sound
    ambientSound.pause();

    // Play ship explosion sound
    shipExplosionSound.currentTime = 0;
    shipExplosionSound.play().catch(error => {
        console.error("Ship explosion sound playback failed:", error);
    });

    // Create explosion at ship's position
    createExplosion(ship.x, ship.y, ship.radius, CRT_RED);

    // Set timeout to reset the game after 5 seconds
    setTimeout(() => {
        resetGame();
    }, 5000);
}

function handleAsteroidDestruction(aIndex) {
    const asteroid = asteroids[aIndex];

    // Play explosion sound
    explosionSound.currentTime = 0;
    explosionSound.play().catch(error => {
        console.error("Explosion sound playback failed:", error);
    });

    // Create explosion
    createExplosion(asteroid.x, asteroid.y, asteroid.radius, asteroid.color);

    // Split asteroid
    if (asteroid.level < 3) {
        let newRadius = asteroid.radius / 2;
        for (let i = 0; i < 2; i++) {
            asteroids.push(
                new Asteroid(asteroid.x, asteroid.y, newRadius, asteroid.level + 1, asteroid.color)
            );
        }
    }

    asteroids.splice(aIndex, 1);
}

function handleEnemyShipDestruction(esIndex, x, y) {
    // Remove the enemy ship from the array
    enemyShips.splice(esIndex, 1);

    // Create explosion at the enemy ship's position with a different color
    createExplosion(x, y, 20, CRT_RED);

    // Play explosion sound
    explosionSound.currentTime = 0;
    explosionSound.play().catch(error => {
        console.error("Explosion sound playback failed:", error);
    });
}

function resetGame() {
    ship = new Ship();
    shipDestroyed = false;
    asteroids = [];
    bullets = [];
    enemyShips = [];
    enemyBullets = [];
    explosions = [];
    blobs = [];
    smartBombs = [];
    round = 1;
    inStoryMode = true;
    currentStoryPage = 0;
    storyTextDiv.style.display = 'block';
    canvas.style.display = 'none';
    displayStory();
    createAsteroids(round);
    if (round >= enemyShipStartRound) {
        createEnemyShips(round % 2);
    }
    if (round >= blobStartRound) {
        createBlobs(round % 2);
    }
}

function playBridgeSound() {
    if (!bridgeSound.playing && !bridgeSound.paused) return;
    if (bridgeSound.paused) {
        bridgeSound.currentTime = 0;
        bridgeSound.play().catch(error => {
            console.error("Bridge sound playback failed:", error);
        });
    }
}

function stopBridgeSound() {
    bridgeSound.pause();
}

// Start the game after the window has fully loaded
window.addEventListener('load', () => {
    init();
});