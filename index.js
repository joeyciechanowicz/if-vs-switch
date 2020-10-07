const { performance } = require("perf_hooks");
const asciichart = require("asciichart");
const { stat } = require("fs");

// const ITERATIONS = 100000;
const ITERATIONS = 10000000;

const header = (depth) => `() => {
    const start = process.hrtime.bigint();
    
    let sum = 0;
    for (let i = 0; i < ${ITERATIONS}; i++) {
        const rand = Math.floor(Math.random() * ${depth});`;

const footer = () => `
    }
    return Number(process.hrtime.bigint() - start) / ${ITERATIONS};
}`;

const buildIfStatment = (depth) => {
  let statment = `
    ${header()}
        if (rand === 0) { sum += 1; }
        ${[...Array(depth - 1).keys()]
          .map((key) => `else if (rand === ${key + 1}) { sum += ${key + 1}; }`)
          .join("\n")}
    ${footer()}`;
  console.log(statment);

  return eval(statment);
};

const buildIfWithOptimalBranchPredictionStatment = (depth) => {
  let statment = `
      ${header()}
          if (${depth - 1} === 0) { sum += 1; }
          ${[...Array(depth - 1).keys()]
            .map(
              (key) =>
                `else if (${depth - 1} === ${key + 1}) { sum += ${key + 1}; }`
            )
            .join("\n")}
      ${footer()}`;
  console.log(statment);
  return eval(statment);
};

const buildSwitchStatment = (depth) => {
  let statment = `
    ${header()}
        switch (rand) {
            case 0: sum += 1; break;
            ${[...Array(depth - 1).keys()]
              .map((key) => `case ${key + 1}: sum += ${key + 1}; break;`)
              .join("\n")}
        }
    ${footer()}`;
  console.log(statment);

  return eval(statment);
};

const buildLookupStatment = (depth) => {
  let statment = `
    ${header()}
        const lookup = [${[...Array(depth).keys()]}];
        sum += lookup[rand];
    ${footer()}`;
  console.log(statment);

  return eval(statment);
};

const buildPrecomputedLookupStatment = (depth) => {
  let statment = `() => {
        const start = process.hrtime.bigint();
        
        let sum = 0;
        const lookup = [${[...Array(depth).keys()]}];

        for (let i = 0; i < ${ITERATIONS}; i++) {
            // Keep the rand generation so that it doesn't sqew results
            const rand = Math.floor(Math.random() * ${depth});  
            sum += lookup[rand];
        ${footer()}`;
  console.log(statment);

  return eval(statment);
};

buildSwitchStatment(5);

process.exit();

const ifs = [];
const switches = [];
const lookups = [];
const optimalIf = [];
const precomputedLookups = [];

console.log(
  `Depth, If, Switch], Lookup, Optimal branch-predicted If-statment, Precomputed lookup`
);
for (let depth = 1; depth < 30; depth += 1) {
  const ifStatment = buildIfStatment(depth);
  const switchStatement = buildSwitchStatment(depth);
  const lookupStatement = buildLookupStatment(depth);
  const optimalBranchPredictedIfStatment = buildIfWithOptimalBranchPredictionStatment(
    depth
  );
  const precomputedLookupsStatment = buildPrecomputedLookupStatment(depth);

  const ifTime = ifStatment();
  const switchTime = switchStatement();
  const lookupTime = lookupStatement();
  const optimalBranchPredictedIfTime = optimalBranchPredictedIfStatment();
  const precomputedLookupsTime = precomputedLookupsStatment();

  ifs.push(ifTime);
  switches.push(switchTime);
  lookups.push(lookupTime);
  optimalIf.push(optimalBranchPredictedIfTime);
  precomputedLookups.push(precomputedLookupsTime);

  console.log(
    `${depth}, ${ifTime}, ${switchTime}, ${lookupTime}, ${optimalBranchPredictedIfTime}, ${precomputedLookupsTime}`
  );
}

const config = {
  colors: [
    asciichart.blue,
    asciichart.green,
    asciichart.red,
    asciichart.yellow,
    asciichart.magenta,
  ],
  padding: 3,
  offset: 3,
};

console.log("\n");
console.log(
  asciichart.plot(
    [ifs, switches, lookups, optimalIf, precomputedLookups],
    config
  )
);
console.log(
  `${asciichart.blue}If-statment
  ${asciichart.green}Switch-statment
  ${asciichart.red}Lookup table
  ${asciichart.yellow}Optimal branch-predicted If-statment
  ${asciichart.magenta}Precomputed lookup table`
);
