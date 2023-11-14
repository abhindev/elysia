const box = [
  {
    box1: {
      length: 2,
      breadth: 2,
      height: 2,
    },
    box2: {
      length: 4,
      breadth: 4,
      height: 4,
    },
    box3: {
      length: 5,
      breadth: 6,
      height: 6,
    },
  },
];

export const BoxSize = (weight: number) => {
  if (weight >= 0.001 && weight <= 0.1) {
    return box[0].box1;
  } else if (weight > 0.1 && weight <= 0.2) {
    return box[0].box2;
  } else {
    return box[0].box3;
  }
};
