class Blob {
    constructor(x, y, radius, config) {
        this.config = config || {};
        this.x = x;
        this.y = y;
        this.radius = radius || this.config.blobs?.radius || 15;
        this.speed = Math.random() * (this.config.blobs?.speedMax - this.config.blobs?.speedMin || 2) + (this.config.blobs?.speedMin || 1);
        this.angle = Math.random() * Math.PI * 2;
        this.vx = this.speed * Math.cos(this.angle);
        this.vy = this.speed * Math.sin(this.angle);
        this.color = this.config.colors?.felMagicGreen || '#00FF00';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -this.radius) this.x = this.config.game?.canvasWidth || canvas.width + this.radius;
        if (this.x > (this.config.game?.canvasWidth || canvas.width) + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = this.config.game?.canvasHeight || canvas.height + this.radius;
        if (this.y > (this.config.game?.canvasHeight || canvas.height) + this.radius) this.y = -this.radius;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}