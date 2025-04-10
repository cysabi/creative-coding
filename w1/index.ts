/// <reference path="node_modules/@types/p5/global.d.ts" />

let dots: Dot[] = [];
let dotPos: p5.Vector;
let dotVel: p5.Vector;
let mouseVel: p5.Vector;
let someNumver: p5.Vector;

function setup() {
  createCanvas(600, 600);
}
function mouseClicked() {
  dots = [];
  dotPos = createVector(mouseX, mouseY);
  for (let i = 0; i < 11; i++) {
    dots.push(
      new Dot(
        createVector(mouseX, mouseY),
        createVector(1, 1)
          .rotate((i / 10) * PI * 2)
          .mult(5),
        dots.at(-1)
      )
    );
  }
}

function draw() {
  background(220);
  if (mouseX && mouseY) {
    if (!dotPos) {
      dotPos = createVector(mouseX, mouseY);
    } else {
      mouseVel = createVector(mouseX, mouseY).sub(dotPos);
      someNumver = createVector(mouseX, mouseY).sub(dotPos);
      mouseVel = createVector(mouseVel.x, mouseVel.y)
        .normalize()
        .mult(sqrt(createVector(mouseVel.x, mouseVel.y).normalize().mag()));
      //   .mult(3);

      dotPos.add(mouseVel);
    }
  }

  if (mouseVel && someNumver.mag() > 3) {
    dotVel = mouseVel.normalize().mult(3);
    if (dotPos && dotVel) {
      let wavePos = sin((millis() / 1000) * 30);

      dots.push(
        new Dot(
          dotPos,
          dotVel.mult(-1).rotate(wavePos * PI * 0.75),
          dots.at(-1)
        )
      );
    }
  }

  dots.forEach((dot) => {
    dot.update();
    dot.display();
  });
}

class Dot {
  pos: any;
  vel: any;
  prevDot?: Dot;

  constructor(pos: any, vel: any, prevDot?: Dot) {
    this.prevDot = prevDot;
    this.pos = pos;
    this.vel = vel;
  }

  update() {
    this.pos = this.pos.add(this.vel);
    this.vel * 0.95;
  }

  display() {
    if (this.prevDot) {
      ellipse(this.pos.x, this.pos.y, 5, 5);
      line(this.prevDot.pos.x, this.prevDot.pos.y, this.pos.x, this.pos.y);
    }
  }
}
