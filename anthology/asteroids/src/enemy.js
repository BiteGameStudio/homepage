
// Enemy Bullet class
class EnemyBullet {
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

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
// Enemy Ship class
class EnemyShip {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1 + 0.5;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.color = CRT_RED;
        this.shootInterval = Math.floor(Math.random() * 300 + 200);
        this.shootTimer = 0;
        this.enemyBullets = []
    }

    update(ship) {
        // Move the enemy ship
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen edges
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;

        // Handle shooting
        this.shootTimer++;
        if (this.shootTimer >= this.shootInterval) {
            this.shoot(ship);
            this.shootTimer = 0;
            this.shootInterval = Math.floor(Math.random() * 300 + 200);
        }
    }

    shoot(ship) {
        // Calculate angle towards the player's ship
        const angleToPlayer = Math.atan2(ship.y - this.y, ship.x - this.x);
        this.enemyBullets.push(new EnemyBullet(this.x, this.y, angleToPlayer));

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
        // Simple triangle shape for the enemy ship
        const frontX = this.x + this.radius * Math.cos(this.angle);
        const frontY = this.y + this.radius * Math.sin(this.angle);
        const leftX = this.x + this.radius * Math.cos(this.angle + (5 * Math.PI) / 6);
        const leftY = this.y + this.radius * Math.sin(this.angle + (5 * Math.PI) / 6);
        const rightX = this.x + this.radius * Math.cos(this.angle - (5 * Math.PI) / 6);
        const rightY = this.y + this.radius * Math.sin(this.angle - (5 * Math.PI) / 6);

        ctx.moveTo(frontX, frontY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
        ctx.stroke();
    }
}
