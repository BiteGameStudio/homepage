
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

        for (let i = 0; i < this.vertices; i++) {
            this.offset.push(Math.random() * this.radius / 2 - this.radius / 4);
        }

        // Shooting properties for enemy bases (if applicable)
        this.shootInterval = Math.floor(Math.random() * 200 + 100);
        this.shootTimer = 0;
    }

    update() {
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
                this.shoot();
                this.shootTimer = 0;
                this.shootInterval = Math.floor(Math.random() * 200 + 100);
            }
        }
    }

    shoot() {
        // Calculate angle towards the ship
        const angleToShip = Math.atan2(ship.y - this.y, ship.x - this.x);
        enemyBullets.push(new EnemyBullet(this.x, this.y, angleToShip));

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
    }
}
