const canvas = document.getElementById("canvasId");
const ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];


// get mouse mouse position ///////////////////////////////
let mouse = {
	x: null,
	y: null,
    radius: 80
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + canvas.clientLeft/2;
		mouse.y = event.y + canvas.clientTop/2;
});

function drawImage(){
    let imageWidth = png.width || png.naturalWidth;
    let imageHeight = png.height || png.naturalHeight;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    class Particle {
        constructor(x, y, color, size){
            this.x = x + canvas.width/2-png.width*2,
            this.y = y + canvas.height/2-png.width*2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2-png.width*2,
            this.baseY = y + canvas.height/2-png.width*2,
            this.density = ((Math.random() * 10) + 2);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;
            // check mouse position/particle position - collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            // distance past which the force is zero
            var maxDistance = 100;
            var force = (maxDistance - distance) / maxDistance;

            // if we go below zero, set it to zero.
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density) * 0.9;
            let directionY = (forceDirectionY * force * this.density) * 0.9;

            if (distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX ) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.x -= dx/5;
                } if (this.y !== this.baseY) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.y -= dy/5;
                }
            }
            this.draw();
        }
    }
    function init(){
        particleArray = [];

        for (var y = 0, y2 = data.height; y < y2; y++) {
            for (var x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb("+data.data[(y * 4 * data.width)+ (x * 4)]+","+data.data[(y * 4 * data.width)+ (x * 4) +1]+","+data.data[(y * 4 * data.width)+ (x * 4) +2]+")";

                    particleArray.push(new Particle(positionX*4, positionY*4, color));

                }
            }
        }
        
    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(255,255,255,.2)';
        // console.log(canvas.width, window.innerWidth,innerHeight);
        
        ctx.fillRect(0,0,innerWidth,innerHeight);
       // ctx.clearRect(0,0,innerWidth,innerHeight);
	    
	
	    for (let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
	    }
    }
    init();
    animate();

    // RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
    window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		init();
	});
}


var png = new Image();
png.src = "data:image/png;base64,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";
// Run drawImage after page has been fully loaded
window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0);
    drawImage();
});