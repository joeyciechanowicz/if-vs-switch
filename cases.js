// if statment
() => {
  const start = process.hrtime.bigint();

  let sum = 0;
  for (let i = 0; i < 10000000; i++) {
    const rand = Math.floor(Math.random() * undefined);
    if (rand === 0) {
      sum += 1;
    } else if (rand === 1) {
      sum += 1;
    } else if (rand === 2) {
      sum += 2;
    } else if (rand === 3) {
      sum += 3;
    } else if (rand === 4) {
      sum += 4;
    }
  }
  return Number(process.hrtime.bigint() - start) / 10000000;
};

// if with optimal branch prediction (always last else)
() => {
  const start = process.hrtime.bigint();

  let sum = 0;
  for (let i = 0; i < 10000000; i++) {
    // Keep the rand generation so that it doesn't scew results
    const rand = Math.floor(Math.random() * undefined);
    if (4 === 0) {
      sum += 1;
    } else if (4 === 1) {
      sum += 1;
    } else if (4 === 2) {
      sum += 2;
    } else if (4 === 3) {
      sum += 3;
    } else if (4 === 4) {
      sum += 4;
    }
  }
  return Number(process.hrtime.bigint() - start) / 10000000;
};

// lookup computed per loop
() => {
  const start = process.hrtime.bigint();

  let sum = 0;
  for (let i = 0; i < 10000000; i++) {
    const rand = Math.floor(Math.random() * undefined);
    const lookup = [0, 1, 2, 3, 4];
    sum += lookup[rand];
  }
  return Number(process.hrtime.bigint() - start) / 10000000;
};

// switch statment
() => {
  const start = process.hrtime.bigint();

  let sum = 0;
  for (let i = 0; i < 10000000; i++) {
    const rand = Math.floor(Math.random() * undefined);
    switch (rand) {
      case 0:
        sum += 1;
        break;
      case 1:
        sum += 1;
        break;
      case 2:
        sum += 2;
        break;
      case 3:
        sum += 3;
        break;
      case 4:
        sum += 4;
        break;
    }
  }
  return Number(process.hrtime.bigint() - start) / 10000000;
};

// Lookup computed outside loop
() => {
  const start = process.hrtime.bigint();

  let sum = 0;
  const lookup = [0, 1, 2, 3, 4];

  for (let i = 0; i < 10000000; i++) {
    const rand = Math.floor(Math.random() * 5);
    sum += lookup[rand];
  }
  return Number(process.hrtime.bigint() - start) / 10000000;
};
