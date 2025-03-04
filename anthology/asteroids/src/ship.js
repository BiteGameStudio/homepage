// src/ship.js
class Ship {
    constructor(config) {
        this.config = config || {};
        this.x = this.config.game?.canvasWidth / 2 || canvas.width / 2;
        this.y = this.config.game?.canvasHeight / 2 || canvas.height / 2;
        this.radius = this.config.ship?.radius || 15;
        this.angle = 0;
        this.rotation = 0;
        this.thrust = { x: 0, y: 0 };
        this.acceleration = this.config.ship?.acceleration || 0.1;
        this.friction = this.config.ship?.friction || 0.99;
        this.alive = true;
        this.thrusters = false;
        this.energy = this.config.ship?.energy?.initial || 100;
        this.maxEnergy = this.config.ship?.energy?.max || 100;
        const rechargeSeconds = this.config.ship?.energy?.rechargeRateSeconds || 10;
        this.energyRechargeRate = this.maxEnergy / (rechargeSeconds * 60);

        // Shield properties
        this.shieldActive = false; // Shield starts off
        this.shieldRadius = this.radius + 10; // Slightly larger than ship
        this.shieldEnergyDrain = this.config.ship?.shield?.energyDrainPerSecond || 5; // Drains 5 energy per second
    }

    applyThrust() {
        this.thrust.x += this.acceleration * Math.cos(this.angle);
        this.thrust.y += this.acceleration * Math.sin(this.angle);
    }

    applyFriction() {
        this.thrust.x *= this.friction;
        this.thrust.y *= this.friction;
    }

    toggleShield() {
        if (this.energy > 0) { // Only toggle if there's energy
            this.shieldActive = !this.shieldActive;
            console.log("Shield " + (this.shieldActive ? "activated" : "deactivated"));
        } else {
            this.shieldActive = false; // Deactivate if no energy
            console.log("No energy for shield!");
        }
    }

    update() {
        if (this.alive) {
            this.angle += this.rotation;
            if (this.thrusters) this.applyThrust();
            else this.applyFriction();
            this.x += this.thrust.x;
            this.y += this.thrust.y;
            const canvasWidth = this.config.game?.canvasWidth || canvas.width;
            const canvasHeight = this.config.game?.canvasHeight || canvas.height;
            if (this.x < 0) this.x = canvasWidth;
            if (this.x > canvasWidth) this.x = 0;
            if (this.y < 0) this.y = canvasHeight;
            if (this.y > canvasHeight) this.y = 0;

            // Update energy with shield drain
            if (this.shieldActive) {
                this.energy -= this.shieldEnergyDrain / 60; // Drain per frame (assuming 60 FPS)
                if (this.energy <= 0) {
                    this.energy = 0;
                    this.shieldActive = false; // Auto-deactivate when energy runs out
                    console.log("Shield deactivated - out of energy!");
                }
            } else {
                this.updateEnergy(); // Recharge only when shield is off
            }
        }
    }

    draw() {
        if (this.alive) {
            ctx.lineWidth = 2;
            const frontX = this.x + this.radius * Math.cos(this.angle);
            const frontY = this.y + this.radius * Math.sin(this.angle);
            const leftX = this.x + this.radius * Math.cos(this.angle + 2 * Math.PI / 3);
            const leftY = this.y + this.radius * Math.sin(this.angle + 2 * Math.PI / 3);
            const rightX = this.x + this.radius * Math.cos(this.angle + 4 * Math.PI / 3);
            const rightY = this.y + this.radius * Math.sin(this.angle + 4 * Math.PI / 3);

            ctx.beginPath();
            ctx.moveTo(frontX, frontY);
            ctx.lineTo(rightX, rightY);
            ctx.strokeStyle = this.config?.colors?.crtAmber || CRT_AMBER || '#FFBF00';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(rightX, rightY);
            ctx.lineTo(leftX, leftY);
            ctx.strokeStyle = this.config?.colors?.crtGreen || CRT_GREEN || '#00FF00';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(leftX, leftY);
            ctx.lineTo(frontX, frontY);
            ctx.strokeStyle = this.config?.colors?.crtAmber || CRT_AMBER || '#FFBF00';
            ctx.stroke();

            // Draw shield if active
            if (this.shieldActive) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.shieldRadius, 0, Math.PI * 2);
                ctx.strokeStyle = this.config?.colors?.crtBlue || CRT_BLUE || '#00BFFF';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            if (this.thrusters) this.drawFlame();
            this.drawEnergyBar();
        }
    }

    drawFlame() {
        ctx.save();
        const flameBaseX = this.x - this.radius * Math.cos(this.angle);
        const flameBaseY = this.y - this.radius * Math.sin(this.angle);
        const flameLength = 15 + Math.random() * 5;
        const flameWidth = 8;
        const flameTipX = flameBaseX - flameLength * Math.cos(this.angle);
        const flameTipY = flameBaseY - flameLength * Math.sin(this.angle);
        const flameLeftX = flameBaseX + flameWidth * Math.cos(this.angle + Math.PI / 2);
        const flameLeftY = flameBaseY + flameWidth * Math.sin(this.angle + Math.PI / 2);
        const flameRightX = flameBaseX + flameWidth * Math.cos(this.angle - Math.PI / 2);
        const flameRightY = flameBaseY + flameWidth * Math.sin(this.angle - Math.PI / 2);

        ctx.beginPath();
        ctx.moveTo(flameTipX, flameTipY);
        ctx.lineTo(flameLeftX, flameLeftY);
        ctx.lineTo(flameRightX, flameRightY);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(flameTipX, flameTipY, flameBaseX, flameBaseY);
        gradient.addColorStop(0, this.config?.colors?.crtYellow || CRT_YELLOW || '#FFFF00');
        gradient.addColorStop(1, this.config?.colors?.crtAmber || CRT_AMBER || '#FFBF00');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = this.config?.colors?.crtYellow || CRT_YELLOW || '#FFFF00';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    updateEnergy() {
        if (this.energy < this.maxEnergy) {
            this.energy += this.energyRechargeRate;
            if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
        }
    }

    drawEnergyBar() {
        const barWidth = 200;
        const barHeight = 10;
        const x = ((this.config.game?.canvasWidth || canvas.width) - barWidth) / 2;
        const y = (this.config.game?.canvasHeight || canvas.height) - 30;

        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, barWidth, barHeight);

        const energyWidth = (this.energy / this.maxEnergy) * barWidth;
        ctx.fillStyle = this.energy >= this.maxEnergy ? 'yellow' : 'darkgoldenrod';
        ctx.fillRect(x, y, energyWidth, barHeight);

        ctx.strokeStyle = 'white';
        ctx.strokeRect(x, y, barWidth, barHeight);

        ctx.fillStyle = 'white';
        ctx.font = '14px Courier New';
        ctx.fillText(`Energy: ${Math.floor(this.energy)}%`, x + barWidth + 10, y + barHeight);
    }
}

class Bullet {
    constructor(x, y, angle, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = this.config.bullets?.speed || 5;
        this.radius = this.config.bullets?.radius || 2;
        this.color = this.config.colors?.crtAmber || CRT_AMBER || '#FFBF00';
        this.life = 0;
        this.maxLife = this.config.bullets?.maxLife || 60;
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

class SmartBomb {
    constructor(x, y, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = this.config.ship?.smartBomb?.maxRadius || 150;
        this.expansionRate = this.config.ship?.smartBomb?.expansionRate || 5;
        this.active = true;
    }

    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.expansionRate;
        } else {
            this.active = false;
        }
    }

    draw() {
        ctx.strokeStyle = this.config?.colors?.crtYellow || CRT_YELLOW || '#FFFF00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}