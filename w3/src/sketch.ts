import p5 from "p5";

// Parameter definitions moved from main.tsx to here
export const numericParameterDefs = {
  timeMultiplier: {
    min: 0,
    max: 1.0,
    step: 0.01,
    defaultValue: 0.5,
  },
};

// This type represents the parameter store structure
export type ParameterStore = {
  [K in keyof typeof numericParameterDefs]: number;
};

// Create initialization function here too
export function initParameterStore(): ParameterStore {
  // Initialize from default values in the parameter definitions
  const store = {} as ParameterStore;

  Object.entries(numericParameterDefs).forEach(([key, def]) => {
    store[key as keyof ParameterStore] = def.defaultValue;
  });

  return store;
}

let seed;

// This function creates the p5 sketch
export function createSketch(parameterStore: ParameterStore) {
  let currentParams = parameterStore;

  return function sketch(p: p5) {
    let font: p5.Font;
    let startTime = p.millis();

    // Expose a method to update parameters
    (p as any).updateParameters = (newParams: ParameterStore) => {
      currentParams = newParams;
    };

    p.preload = function () {
      // can preload assets here...
      // myShader = p.loadShader("gradient.vert", "gradient.frag");
    };

    p.setup = function () {
      seed = p.random(1000);
      // Keep the fixed dimensions - this is the actual size of your visualization
      p.createCanvas(1024, 1024, p.WEBGL);
      p.noStroke();

      // Fix any potential canvas styling issues
      const canvas = document.querySelector(".p5Canvas");
      if (canvas) {
        (canvas as any).style.margin = "0 auto";
        (canvas as any).style.display = "block";
      }

      // draw a black background
      p.colorMode(p.HSB);
      p.noStroke();
      p.background("#fffff");
    };

    let frameCount = 0;

    let prevTime = 0;
    p.keyPressed = function (e: KeyboardEvent) {
      for (let i = 0; i < 80; i++) {
        splatter(
          Math.random() * p.width - 512,
          Math.random() * p.height - 512,
          Math.random() * 100
        );
      }
    };
    p.draw = function () {
      frameCount++;
      // p.filter(p.BLUR, 0.1);

      let c = p.color((frameCount / 1.7) % 255, (frameCount * 1.7) % 255, 100);

      if (p.mouseIsPressed) {
        p.fill(c);
        for (let i = 0; i < 10; i++) {
          splatter(p.mouseX - 512, p.mouseY - 512);
          p.ellipse(
            p.mouseX - 512 + randPosOffset(),
            p.mouseY - 512 + randPosOffset(),
            8,
            8
          );
        }
      }
    };

    const randPosOffset = () => {
      return Math.floor(Math.random() * 8) - 8;
    };

    const splatter = (bx, by, moved = null) => {
      bx += p.random(-8, 8);
      by += p.random(-8, 8);

      let mx = 10 * (moved ? moved : p.movedX);
      let my = 10 * (moved ? moved : p.movedY);

      for (let i = 0; i < 80; i++) {
        seed += 0.1;
        let x = bx + mx * (0.5 - p.noise(seed + i));
        let y = by + my * (0.5 - p.noise(seed + 2 * i));

        let s = 150 / p.dist(bx, by, x, y);
        if (s > 10) s = 10;

        p.ellipse(x, y, s);

        seed += 0.1;
      }
    };
  };
}
