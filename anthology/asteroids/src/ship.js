// Ship class (includes energy bar for Smart Bomb)
class Ship {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 15;
        this.angle = 0;
        this.rotation = 0;
        this.thrust = {
            x: 0,
            y: 0
        };
        this.acceleration = 0.1;
        this.friction = 0.99;
        this.alive = true;
        this.thrusters = false;
        // Energy properties for Smart Bomb
        this.energy = 100; // Energy level starts at 100%
        this.maxEnergy = 100; // Maximum energy level
        this.energyRechargeRate = this.maxEnergy / (10 * 60); // Energy recharges over 10 seconds at 60 FPS
    }
    applyThrust(){
        this.thrust.x += this.acceleration * Math.cos(this.angle);
        this.thrust.y += this.acceleration * Math.sin(this.angle);
    }
    applyFriction(){
        this.thrust.x *= this.friction;
        this.thrust.y *= this.friction;
    }
    update() {
        if (this.alive) {
            // Rotate ship
            this.angle += this.rotation;

            // Move ship
            if (this.thrusters) {
              this.applyThrust()
            } else {
                this.applyFriction()
            }

            this.x += this.thrust.x;
            this.y += this.thrust.y;

            // Screen edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;


            // Update energy level
            this.updateEnergy();
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

            // Front line (front tip to right back point) - CRT_BLUE
            ctx.beginPath();
            ctx.moveTo(frontX, frontY);
            ctx.lineTo(rightX, rightY);
            ctx.strokeStyle = CRT_AMBER;
            ctx.stroke();

            // Right back line (right back point to left back point) - CRT_GREEN
            ctx.beginPath();
            ctx.moveTo(rightX, rightY);
            ctx.lineTo(leftX, leftY);
            ctx.strokeStyle = CRT_GREEN;
            ctx.stroke();

            // Left back line (left back point to front tip) - CRT_BLUE
            ctx.beginPath();
            ctx.moveTo(leftX, leftY);
            ctx.lineTo(frontX, frontY);
            ctx.strokeStyle = CRT_AMBER;
            ctx.stroke();

            // Draw energy bar
            this.drawEnergyBar();
        }
    }

    // Method to update energy level
    updateEnergy() {
        if (this.energy < this.maxEnergy) {
            this.energy += this.energyRechargeRate;
            if (this.energy > this.maxEnergy) {
                this.energy = this.maxEnergy;
            }
        }
    }

    // Method to draw energy bar
    drawEnergyBar() {
        const barWidth = 200;
        const barHeight = 10;
        const x = (canvas.width - barWidth) / 2;
        const y = canvas.height - 30; // Position the bar near the bottom

        // Background bar
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Energy level
        const energyWidth = (this.energy / this.maxEnergy) * barWidth;
        ctx.fillStyle = this.energy >= this.maxEnergy ? 'yellow' : 'darkgoldenrod';
        ctx.fillRect(x, y, energyWidth, barHeight);

        // Bar border
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x, y, barWidth, barHeight);

        // Display percentage
        ctx.fillStyle = 'white';
        ctx.font = '14px Courier New';
        ctx.fillText(`Energy: ${Math.floor(this.energy)}%`, x + barWidth + 10, y + barHeight);
    }
}



// Bullet class
class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 5;
        this.radius = 2;
        this.color = CRT_AMBER;
        this.life = 0;
        this.maxLife = 60;
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

// SmartBomb class
class SmartBomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 150; // Maximum radius the circle will expand to
        this.expansionRate = 5; // Rate at which the circle expands per frame
        this.active = true; // Indicates if the Smart Bomb is still expanding
    }

    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.expansionRate;
        } else {
            this.active = false; // Deactivate when max radius is reached
        }
    }

    draw() {
        ctx.strokeStyle = CRT_YELLOW;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}