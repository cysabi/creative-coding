import p5 from "p5";

import "./style.css";

const SIZE = 900;

const _app = new p5((p5Instance) => {
  const p = p5Instance as unknown as p5;

  p.setup = function setup() {
    p.createCanvas(SIZE, SIZE);
    p.background(p.color(255));
    p.colorMode(p.HSB);

    p.strokeWeight(200);
    p.stroke("#e5eef9");

    drawRiver(makeNewLine([SIZE / 2, 0], 2, 7, 20));
    p.strokeWeight(75);
    drawRiver(makeNewLine([SIZE / 2, SIZE], 2, 2, 20));

    p.strokeWeight(5);

    const lines: number[][][] = [];

    // for each line
    for (let j = 0; j < 10; j++) {
      newColor();

      // gen line
      const line = makeNewLine();
      traceSegment(line);
      lines.push(line);
    }

    for (let i = 0; i < 10; i++) {
      newColor();
      const lineToTrace = lines[i];

      const startStartPoint = (Math.random() * lineToTrace.length) / 2;
      const endEndPoint = lineToTrace.length - startStartPoint;

      const segment = lineToTrace.slice(startStartPoint, endEndPoint);
      traceSegment(segment, 5);
    }
  };

  const drawRiver = (river: number[][]) => {
    river.forEach((seg, i) => {
      if (i == 0) return;

      const startPoint = river[i - 1];
      const endPoint = seg;

      p.line(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
    });
  };

  const makeNewLine = (
    startPoint: number[] = [SIZE / 2, SIZE / 2],
    distScalar: number = 1,
    dirI?: number,
    numSegsI?: number
  ) => {
    const line: number[][] = [startPoint];
    const dir =
      matrixAhhhh[
        dirI !== undefined
          ? dirI
          : Math.floor(Math.random() * matrixAhhhh.length)
      ];

    // for each seg
    const numSegs = numSegsI !== undefined ? numSegsI : Math.random() * 5 + 5;
    for (let i = 0; i < numSegs; i++) {
      const dist = (Math.random() * 50 + 50) * distScalar;
      const dirr = dir[Math.floor(Math.random() * dir.length)];
      const newStart = startPoint.map((p, i) => {
        return p + dirr[i] * dist;
      });
      line.push(newStart);
      startPoint = [...newStart];
    }
    return line;
  };

  const newColor = () => {
    p.stroke(Math.random() * 360, 128, 128);
  };

  const traceSegment = (segment: number[][], offset: number = 0) => {
    segment.forEach((seg, i) => {
      if (i == 0) return;

      const startPoint = segment[i - 1];
      const endPoint = seg;

      p.line(
        startPoint[0] + offset,
        startPoint[1] + offset,
        endPoint[0] + offset,
        endPoint[1] + offset
      );
      p.fill("white");
      p.strokeWeight(2);
      p.ellipse(startPoint[0] + offset, startPoint[1] + offset, 11, 11);
      p.strokeWeight(5);
    });
  };

  const matrixAhhhh = [
    [
      [-1, -1],
      [0, -1],
      [-1, 0],
    ],
    [
      [0, -1],
      [-1, -1],
      [1, -1],
    ],
    [
      [1, -1],
      [0, -1],
      [1, 0],
    ],
    [
      [-1, 0],
      [-1, -1],
      [-1, 1],
    ],
    [
      [1, 0],
      [1, -1],
      [1, 1],
    ],
    [
      [-1, 1],
      [-1, 0],
      [0, 1],
    ],
    [
      [0, 1],
      [-1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [0, 1],
      [1, 0],
    ],
  ];
}, document.getElementById("app")!);
