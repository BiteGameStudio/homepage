class AsteroidBullet {
    constructor(x, y, angle, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = this.config.enemyBullets?.speed || 4;
        this.radius = this.config.enemyBullets?.radius || 3;
        this.color = this.config.colors?.crtPurple || CRT_PURPLE;
        this.life = 0;
        this.maxLife = this.config.enemyBullets?.maxLife || 120;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        if (this.x < 0) this.x = this.config.game?.canvasWidth || canvas.width;
        if (this.x > (this.config.game?.canvasWidth || canvas.width)) this.x = 0;
        if (this.y < 0) this.y = this.config.game?.canvasHeight || canvas.height;
        if (this.y > (this.config.game?.canvasHeight || canvas.height)) this.y = 0;
        this.life++;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Asteroid {
    constructor(x, y, radius, level, color, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.level = level;
        this.color = color || this.config.colors?.crtGreen || CRT_GREEN;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * (this.config.asteroids?.speedMax - this.config.asteroids?.speedMin || 1.5) + (this.config.asteroids?.speedMin || 0.5);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.vertices = Math.floor(Math.random() * 5 + 5);
        this.offset = [];
        this.bullets = [];
        for (let i = 0; i < this.vertices; i++) {
            this.offset.push(Math.random() * this.radius / 2 - this.radius / 4);
        }
        this.shootInterval = Math.floor(Math.random() * (this.config.asteroids?.shootIntervalMax - this.config.asteroids?.shootIntervalMin || 200) + (this.config.asteroids?.shootIntervalMin || 100));
        this.shootTimer = 0;
        this.textPosition = 0;
        this.textSpeed = 0.5;
    }

    update(ship) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -this.radius) this.x = this.config.game?.canvasWidth || canvas.width + this.radius;
        if (this.x > (this.config.game?.canvasWidth || canvas.width) + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = this.config.game?.canvasHeight || canvas.height + this.radius;
        if (this.y > (this.config.game?.canvasHeight || canvas.height) + this.radius) this.y = -this.radius;

        if (this.config.game?.initialRound >= this.config.enemyShips?.startRound && this.color === this.config?.colors?.crtRed) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot(ship);
                this.shootTimer = 0;
                this.shootInterval = Math.floor(Math.random() * (this.config.asteroids?.shootIntervalMax - this.config.asteroids?.shootIntervalMin || 200) + (this.config.asteroids?.shootIntervalMin || 100));
            }
        }

        if (this.level === 1 && this.color === this.config?.colors?.crtBlue) {
            this.textPosition += this.textSpeed;
            if (this.textPosition > this.radius * 2) this.textPosition = -ctx.measureText('advertise').width;
        }

        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.life > bullet.maxLife) this.bullets.splice(index, 1);
        });
    }

    shoot(ship) {
        const angleToShip = Math.atan2(ship.y - this.y, ship.x - this.x);
        this.bullets.push(new AsteroidBullet(this.x, this.y, angleToShip, this.config));
        if (enemyLaserSound) {
            enemyLaserSound.currentTime = 0;
            enemyLaserSound.play().catch(error => console.error("Enemy laser sound playback failed:", error));
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
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        this.bullets.forEach(bullet => bullet.draw());

        if (this.level === 1 && this.color === this.config?.colors?.crtBlue) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.beginPath();
            for (let i = 0; i < this.vertices; i++) {
                const angle = ((Math.PI * 2) / this.vertices) * i;
                const r = this.radius + this.offset[i];
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.clip();
            const text = 'ADVERTISE';
            const textX = -this.radius + this.textPosition;
            const textY = 0;
            ctx.fillStyle = this.config?.colors?.crtBlue || CRT_BLUE;
            ctx.fillText(text, textX, textY);
            ctx.restore();
        }
    }
}