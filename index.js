const { performance } = require("perf_hooks");
const asciichart = require("asciichart");

// const ITERATIONS = 100000;
const ITERATIONS = 10000000;

const buildIfStatment = (depth) => {
  let statment = `() => {
        const start = process.hrtime.bigint();
        
        let sum = 0;
        for (let i = 0; i < ${ITERATIONS}; i++) {
            const rand = Math.floor(Math.random() * ${depth});

            if (rand === 0) { sum += 1; }
            ${[...Array(depth - 1).keys()]
              .map(
                (key) => `else if (rand === ${key + 1}) { sum += ${key + 1}; }`
              )
              .join("\n")}
        }

        return Number(process.hrtime.bigint() - start) / ${ITERATIONS};
    }`;

  // console.log(statment);

  return eval(statment);
};

const buildSwitchStatment = (depth) => {
  let statment = `() => {
        const start = process.hrtime.bigint();
        
        let sum = 0;
        for (let i = 0; i < ${ITERATIONS}; i++) {
            const rand = Math.floor(Math.random() * ${depth});

            switch (rand) {
                case 0: sum += 1; break;
                ${[...Array(depth - 1).keys()]
                  .map((key) => `case ${key + 1}: sum += ${key + 1}; break;`)
                  .join("\n")}
            }
        }

        return Number(process.hrtime.bigint() - start) / ${ITERATIONS};
    }`;

  // console.log(statment);

  return eval(statment);
};

const buildLookupStatment = (depth) => {
  let statment = `() => {
        const start = process.hrtime.bigint();
        
        let sum = 0;
        for (let i = 0; i < ${ITERATIONS}; i++) {
            const rand = Math.floor(Math.random() * ${depth});

            const lookup = [${[...Array(depth).keys()]}];

            sum += lookup[rand];
        }

        return Number(process.hrtime.bigint() - start) / ${ITERATIONS};
    }`;

  // console.log(statment);

  return eval(statment);
};

const ifs = [];
const switches = [];
const lookups = [];

console.log(`Depth, If (ns), Switch (ns), Lookup (ns)`);
for (let depth = 1; depth < 30; depth += 1) {
  const ifStatment = buildIfStatment(depth);
  const switchStatement = buildSwitchStatment(depth);
  const lookupStatement = buildLookupStatment(depth);

  const ifTime = ifStatment();
  const switchTime = switchStatement();
  const lookupTime = lookupStatement();

  ifs.push(ifTime);
  switches.push(switchTime);
  lookups.push(lookupTime);

  console.log(`${depth}, ${ifTime}, ${switchTime}, ${lookupTime}`);
}

const config = {
  colors: [asciichart.blue, asciichart.green, asciichart.red],
  padding: 3,
  offset: 3
};

console.log(asciichart.plot([ifs, switches, lookups], config));
console.log(`${asciichart.blue}If-statment  ${asciichart.green}Switch-statment  ${asciichart.red}Lookup table`)
