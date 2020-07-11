import React, { useLayoutEffect } from 'react';
import { useRef } from 'react';
import './App.css';
import BatmanBase64 from './assets/batmanBase64';
export interface IParticle {
  x: number;
  y: number;
  color: string;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
}
function App() {
  const mouse = {
    x: null,
    y: null,
    radius: 30
  };
  const png = new Image();
  const canvasRef: any = useRef<any>();
  let context: any = useRef<any>();
  let particles: IParticle[] = [];
  let imageData: any;
  const resizeCanvas = () => {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    init();
  }
  const drawCanvasImage = () => {
    let imageWidth = png.width || png.naturalWidth;
    let imageHeight = png.height || png.naturalHeight;
    imageData = context.current.getImageData(0, 0, imageWidth, imageHeight);
    context.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    init();
  }
  const draw = (particle: IParticle) => {
    context.current.beginPath();
    context.current.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.current.closePath();
    context.current.fill();
  }
  const update = (particle: IParticle) => {
    context.current.fillStyle = particle.color;
    let dx = mouse.x! - particle.x;
    let dy = mouse.y! - particle.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    var maxDistance = 100;
    var force = (maxDistance - distance) / maxDistance;
    if (force < 0) {
      force = 0;
    }
    let directionX = (forceDirectionX * force * particle.density) * 0.9;
    let directionY = (forceDirectionY * force * particle.density) * 0.9;

    if (distance < mouse.radius + particle.size) {
      particle.x -= directionX;
      particle.y -= directionY;
    }
    else {
      if (particle.x !== particle.baseX) {
        let dx = particle.x - particle.baseX;
        particle.x -= dx / 5;
      } if (particle.y !== particle.baseY) {
        let dy = particle.y - particle.baseY;
        particle.y -= dy / 5;
      }
    }
    draw(particle);
  }
  const animate = () => {
    window.requestAnimationFrame(animate);
    context.current.fillStyle = 'rgba(255,255,255,.2)';
    context.current.fillRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(particle => {
      update(particle);
    });
  }
  const pageLoad = () => {
    console.log('page has loaded');
    context.current.drawImage(png, 0, 0);
    drawCanvasImage();
  }
  const mouseMove = (event: any) => {
    mouse.x = event.x + canvasRef.current.clientLeft / 2;
    mouse.y = event.y + canvasRef.current.clientTop / 2;
  }
  const init = () => {
    particles = [];
    for (var y = 0, y2 = imageData.height; y < y2; y++) {
      for (var x = 0, x2 = imageData.width; x < x2; x++) {
        if (imageData.data[(y * 4 * imageData.width) + (x * 4) + 3] > 128) {
          let positionX = x * 4;
          let positionY = y * 4;
          let color = "rgb(" + imageData.data[(y * 4 * imageData.width) + (x * 4)] + "," + imageData.data[(y * 4 * imageData.width) + (x * 4) + 1] + "," + imageData.data[(y * 4 * imageData.width) + (x * 4) + 2] + ")";

          let particle = {
            x: positionX + canvasRef.current.width / 2 - png.width * 2,
            y: positionY + canvasRef.current.height / 2 - png.width * 2,
            color: color,
            size: 2,
            baseX: positionX + canvasRef.current.width / 2 - png.width * 2,
            baseY: positionY + canvasRef.current.height / 2 - png.width * 2,
            density: (Math.random() * 10) + 2
          }
          particles.push(particle);
        }
      }
    }
    animate();
  }
  useLayoutEffect(() => {
    png.src = BatmanBase64;
    context.current = canvasRef.current.getContext("2d");
    window.addEventListener('load', pageLoad);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('load', pageLoad);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', mouseMove);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}></canvas>
    </div>
  );
}

export default App;
