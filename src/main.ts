import p5 from 'p5';
import { map, splitEvery } from 'ramda';

import './style.css';

// Settings
const canvasWidth = 500;
const canvasHeight = 500;

// General Utilities
const range = (n: number): number[] => [...Array(n).keys()];

const _app = new p5(p5Instance => {
  const p = p5Instance as p5;

  let img: p5.Image;
  p.preload = function preload() {
    img = p.loadImage('/sample.jpg');
  }

  const getPixel = (px: number, py: number): number[] => {
    const density = p.pixelDensity();
    const index: number = 4 * ((py * density) * canvasWidth * density + (px * density));
    return [p.pixels[index], p.pixels[index + 1], p.pixels[index + 2], p.pixels[index + 3]];
  }

  const setPixel = (px: number, py: number, r: number, g: number, b: number, a: number): void => {
    const density = p.pixelDensity();
    const index: number = 4 * ((py * density) * canvasWidth * density + (px * density));
    p.pixels[index] = r;
    p.pixels[index + 1] = g;
    p.pixels[index + 2] = b;
    p.pixels[index + 3] = a;
  }

  p.setup = function setup() {
    p.createCanvas(500, 500);
    p.image(img, 0, 0, 500, 500);
  };

  p.draw = function draw() {
    p.loadPixels();

    range(canvasWidth).forEach(x => range(canvasHeight).forEach(y => {
      if (Math.random() < .9) return;
      if (p.dist(x, y, p.mouseX, p.mouseY) > 100) return;
      const [r, g, b, a] = getPixel(x, y);
      const rgAverage = (r + g) / 2;
      setPixel(x, y, rgAverage, rgAverage, b, a);
    }));

    range(canvasWidth).forEach(x => range(canvasHeight).forEach(y => {
      // Get the values for the current pixel
      const [r] = getPixel(x, y);
      
      // If a pixel is rather red, increase the redness of the pixel below it
      if (r > 220) {
        const yBelow = y + 1;
        const xBelow = x;
        
        const [rBelow, gBelow, bBelow, aBelow] = getPixel(xBelow, yBelow);

        const newRBelow = (rBelow + 30 < 255) ? rBelow + 30 : rBelow; 

        setPixel(xBelow, yBelow, newRBelow, gBelow, bBelow, aBelow);
      }
    }));
    
    p.updatePixels();
  };
}, document.getElementById('app')!);
