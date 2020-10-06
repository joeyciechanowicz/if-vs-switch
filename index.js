const { stat } = require('fs');
const {performance} = require('perf_hooks');

const ITERATIONS = 10000000;
const MICRO_TO_NANO = 1000 * 1000;

const buildIfStatment = depth => {
    let statment = `() => {
        const start = process.hrtime.bigint();
        
        let sum = 0;
        for (let i = 0; i < ${ITERATIONS}; i++) {
            const rand = Math.floor(Math.random() * ${depth});

            if (rand === 0) { sum += 1; }
            ${[...Array(depth - 1).keys()].map(key => `else if (rand === ${key + 1}) { sum += ${key + 1}; }`).join('\n')}
        }

        return (process.hrtime.bigint() - start) / ${ITERATIONS}n;
    }`;

    // console.log(statment);

    return eval(statment);
};

const buildSwitchStatment = depth => {
    let statment = `() => {
        const start = process.hrtime.bigint();
        
        let sum = 0;
        for (let i = 0; i < ${ITERATIONS}; i++) {
            const rand = Math.floor(Math.random() * ${depth});

            switch (rand) {
                case 0: sum += 1; break;
                ${[...Array(depth - 1).keys()].map(key => `case ${key + 1}: sum += ${key + 1}; break;`).join('\n')}
            }
        }

        return (process.hrtime.bigint() - start) / ${ITERATIONS}n;
    }`;

    // console.log(statment);

    return eval(statment);
};

// buildIfStatment(10);
// buildSwitchStatment(10);

console.log(`Depth, If (ns), Switch (ns)`);
for (let depth = 1; depth < 1000; depth += 1) {
    const ifStatment = buildIfStatment(depth);
    const switchStatement = buildSwitchStatment(depth);

    const ifTime = ifStatment(depth);
    const switchTime = switchStatement(depth);
    console.log(`${depth}, ${ifTime}, ${switchTime}`);
}
