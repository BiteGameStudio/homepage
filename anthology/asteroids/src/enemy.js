// src/enemy.js
class EnemyBullet {
    constructor(x, y, angle, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = this.config.enemyBullets?.speed || 4;
        this.radius = this.config.enemyBullets?.radius || 3;
        this.color = this.config.colors?.crtPurple || CRT_PURPLE || '#FF00FF';
        this.life = 0;
        this.maxLife = this.config.enemyBullets?.maxLife || 120;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        const canvasWidth = this.config.game?.canvasWidth || canvas.width;
        const canvasHeight = this.config.game?.canvasHeight || canvas.height;
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
        this.life++;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class EnemyShip {
    constructor(x, y, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.radius = this.config.enemyShips?.radius || 20;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * (this.config.enemyShips?.speedMax - this.config.enemyShips?.speedMin || 1) + (this.config.enemyShips?.speedMin || 0.5);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.color = this.config.colors?.crtRed || CRT_RED || '#FF0000';
        this.shootInterval = Math.floor(Math.random() * (this.config.enemyShips?.shootIntervalMax - this.config.enemyShips?.shootIntervalMin || 300) + (this.config.enemyShips?.shootIntervalMin || 200));
        this.shootTimer = 0;
        this.enemyBullets = [];

        // EMP effect
        this.empDisabled = false;
        this.empRechargeTime = 0; // Frames remaining until re-enabled
        this.defaultColor = this.color;
        this.disabledColor = '#808080'; // Grey when disabled
    }

    update(ship) {
        this.x += this.vx;
        this.y += this.vy;
        const canvasWidth = this.config.game?.canvasWidth || canvas.width;
        const canvasHeight = this.config.game?.canvasHeight || canvas.height;
        if (this.x < -this.radius) this.x = canvasWidth + this.radius;
        if (this.x > canvasWidth + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvasHeight + this.radius;
        if (this.y > canvasHeight + this.radius) this.y = -this.radius;

        if (this.empDisabled) {
            this.empRechargeTime--;
            this.color = this.disabledColor;
            if (this.empRechargeTime <= 0) {
                this.empDisabled = false;
                this.color = this.defaultColor;
                console.log(`EnemyShip at (${this.x}, ${this.y}) recharged`);
            }
        } else {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot(ship);
                this.shootTimer = 0;
                this.shootInterval = Math.floor(Math.random() * (this.config.enemyShips?.shootIntervalMax - this.config.enemyShips?.shootIntervalMin || 300) + (this.config.enemyShips?.shootIntervalMin || 200));
            }
        }
    }

    shoot(ship) {
        const angleToPlayer = Math.atan2(ship.y - this.y, ship.x - this.x);
        this.enemyBullets.push(new EnemyBullet(this.x, this.y, angleToPlayer, this.config));
        if (enemyLaserSound) {
            enemyLaserSound.currentTime = 0;
            enemyLaserSound.play().catch(error => console.error("Enemy laser sound playback failed:", error));
        }
    }

    disableByEMP() {
        this.empDisabled = true;
        this.empRechargeTime = 180; // 3 seconds at 60 FPS
        console.log(`EnemyShip at (${this.x}, ${this.y}) disabled by EMP`);
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
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