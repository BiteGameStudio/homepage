// src/asteroid.js
class AsteroidBullet {
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

class Asteroid {
    constructor(x, y, radius, level, color, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.level = level;
        this.color = color || this.config.colors?.crtGreen || CRT_GREEN || '#00FF00';
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

        this.isBlue = this.color === (this.config.colors?.crtBlue || CRT_BLUE || '#00BFFF');
        console.log(`Asteroid created at (${this.x}, ${this.y}): Color ${this.color}, Is Blue? ${this.isBlue}`);
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

        if (this.config.game?.initialRound >= this.config.enemyShips?.startRound && this.color === (this.config?.colors?.crtRed || CRT_RED || '#FF0000')) {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) {
                this.shoot(ship);
                this.shootTimer = 0;
                this.shootInterval = Math.floor(Math.random() * (this.config.asteroids?.shootIntervalMax - this.config.asteroids?.shootIntervalMin || 200) + (this.config.asteroids?.shootIntervalMin || 100));
            }
        }

        if (this.level === 1 && this.color === (this.config?.colors?.crtBlue || CRT_BLUE || '#00BFFF')) {
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

    shouldTriggerEMP() {
        return this.isBlue; // Return true if blue for EMP triggering
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

        if (this.level === 1 && this.color === (this.config?.colors?.crtBlue || CRT_BLUE || '#00BFFF')) {
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
            ctx.fillStyle = this.config?.colors?.crtBlue || CRT_BLUE || '#00BFFF';
            ctx.fillText(text, textX, textY);
            ctx.restore();
        }
    }
}

// New EMPBlast class
class EMPBlast {
    constructor(x, y, level, config) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.config = config || {};
        this.radius = 0;
        this.maxRadius = 600; // Large fixed radius
        this.expansionRate = 20; // Fast expansion
        this.active = true;
        console.log(`EMPBlast created at (${this.x}, ${this.y}), Level ${this.level}`);
    }

    update() {
        if (this.active) {
            this.radius += this.expansionRate;
            console.log(`EMPBlast updating: Radius ${this.radius}/${this.maxRadius}`);
            if (this.radius >= this.maxRadius) {
                this.active = false;
                console.log("EMPBlast completed");
            }
        }
    }

    draw() {
        if (this.active) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = this.config?.colors?.crtBlue || CRT_BLUE || '#00BFFF';
            ctx.lineWidth = 5;
            ctx.stroke();
            console.log(`EMPBlast drawing at (${this.x}, ${this.y}), Radius ${this.radius}`);
        }
    }
}