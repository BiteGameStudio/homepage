class Particle {
    constructor(x, y, color, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.radius = Math.random() * (this.config.particles?.radiusMax - this.config.particles?.radiusMin || 2) + (this.config.particles?.radiusMin || 1);
        this.speed = Math.random() * (this.config.particles?.speedMax - this.config.particles?.speedMin || 2) + (this.config.particles?.speedMin || 1);
        this.angle = Math.random() * Math.PI * 2;
        this.life = 0;
        this.maxLife = this.config.particles?.maxLife || 50;
        this.color = color;
    }

    update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.life++;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}