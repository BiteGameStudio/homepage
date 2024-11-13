class AsteroidBullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 4;
        this.radius = 3;
        this.color = CRT_PURPLE;
        this.life = 0;
        this.maxLife = 120;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        // Screen edges - wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.life++;
    }

    draw() {console.log("asteroid bullet")
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}



// Asteroid class
class Asteroid {
    constructor(x, y, radius, level, color = CRT_GREEN) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.level = level;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1.5 + 0.5;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.vertices = Math.floor(Math.random() * 5 + 5);
        this.offset = [];
        this.bullets = [];
        for (let i = 0; i < this.vertices; i++) {
            this.offset.push(Math.random() * this.radius / 2 - this.radius / 4);
        }

        // Shooting properties for enemy bases (if applicable)
        this.shootInterval = Math.floor(Math.random() * 200 + 100);
        this.shootTimer = 0;

        // Scrolling text properties (for blue asteroids)
        this.textPosition = 0; // Horizontal position of the scrolling text
        this.textSpeed = 0.5; // Speed at which the text scrolls
    }

    update(ship) {
        this.x += this.vx;
        this.y += this.vy;

        // Screen edges - wrap around
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;

        // Handle shooting for enemy bases
        if (round >= enemyBaseStartRound && this.color === CRT_RED) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot(ship);
                this.shootTimer = 0;
                this.shootInterval = Math.floor(Math.random() * 200 + 100);
            }
        }

        // Update scrolling text position if asteroid is CRT blue
        if (this.level === 1 && this.color === CRT_BLUE) {
            this.textPosition += this.textSpeed;
            // Reset text position to create a looping effect
            if (this.textPosition > this.radius * 2) {
                this.textPosition = -ctx.measureText('advertise').width;
            }
        }

        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.life > bullet.maxLife) {
                this.bullets.splice(index, 1);
            }
        });
    }

    shoot(ship) {
        // Calculate angle towards the ship
        const angleToShip = Math.atan2(ship.y - this.y, ship.x - this.x);
        this.bullets.push(new AsteroidBullet(this.x, this.y, angleToShip));

        // Play enemy shooting sound
        if (enemyLaserSound) {
            enemyLaserSound.currentTime = 0;
            enemyLaserSound.play().catch(error => {
                console.error("Enemy laser sound playback failed:", error);
            });
        }
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < this.vertices; i++) {
            const angle = ((Math.PI * 2) / this.vertices) * i;
            const r = this.radius + this.offset[i];
            const x = this.x + r * Math.cos(angle);
            const y = this.y + r * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();

        // Draw bullets fired by the asteroid (if any)
        this.bullets.forEach(bullet => {
            bullet.draw();
        });

        // Draw scrolling text bar if asteroid is CRT blue
        if (this.level === 1 &&  this.color === CRT_BLUE) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(0); // Adjust rotation if needed

            // Set the font to display capital letters
            ctx.font = '12px Arial'; // Adjust font size and style as needed
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Create a clipping path in the shape of the asteroid
            ctx.beginPath();
            for (let i = 0; i < this.vertices; i++) {
                const angle = ((Math.PI * 2) / this.vertices) * i;
                const r = this.radius + this.offset[i];
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.clip();

            // Draw the scrolling text
            const text = 'ADVERTISE'; // Text in uppercase
            const textX = -this.radius + this.textPosition;
            const textY = 0; // Adjust vertical position as needed

            // Optional: Draw a background rectangle behind the text
            // ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'; // Semi-transparent blue background
            // ctx.fillRect(-this.radius, -10, this.radius * 2, 20);

            // Draw the text
            ctx.fillStyle = CRT_BLUE; // Set text color to CRT blue
            ctx.fillText(text, textX, textY);

            ctx.restore();
        }

    }
}
