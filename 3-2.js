const { assert } = require('console');
const fs = require('fs');
/**
 * Approaches:
 * 1. Walk thru array until we find a symbol
 *   check adjacencies for exactly two numbers, if true, sum gear ratio
 * 
 * 2. Walk thru array, keeping track of numbers
 * - once number ends, backtrack and search for symbols
 * - hash symbols using the the coords as a key and number as a val
 * - then find gear rations by iterating through the map
 
 */
(function () {
  const isNumber = (any) => Number.isFinite(Number(any));
  const map = new Map();

  const findAndHashGears = (x, y, number) => {
    const checkCoord = (x, y) => {
      if (rows[y] === undefined) {
        return;
      }
      const current = rows[y][x];
      if (current === undefined) {
        console.debug(`Out of bounds, early return`);
        return;
      }
      if (current !== undefined && current === '*') {
        console.debug(`Gear detected ${current}`);
        const key = `${x},${y}`;
        if (map.has(key)) {
          const val = map.get(key);
          if (val.find(x => x === number)) {
            console.debug(`Duplicate number detected when hashing: ${number}`);
            return;
          }
          map.set(key, [...val, number]);
          assert(map.get(key).length === 2);
        } else {
          map.set(key, [number]);
        }
        console.debug(`Gear ${key} hashed: ${map.get(key)}`);
      }
    };
    console.debug(`Checking for gears at ${x} ${y} - ${rows[y][x]}`);
    checkCoord(x + 1, y);
    checkCoord(x - 1, y);
    checkCoord(x, y + 1);
    checkCoord(x, y - 1);
    checkCoord(x + 1, y - 1);
    checkCoord(x + 1, y + 1);
    checkCoord(x - 1, y - 1);
    checkCoord(x - 1, y + 1);
  };

  const data = fs.readFileSync('3.csv', 'utf-8');
  const rows = data.split('\n');

  for (let y = 0; y < rows.length; y++) {
    let numBuf = '';
    for (let x = 0; x < rows[y].length; x++) {
      const current = rows[y][x];

      if (isNumber(current)) {
        numBuf += current;
        // this number ends at the rightmost edge of the matrix, so backtrack and empty the buf
        if (rows[y][x + 1] === undefined) {
          for (let z = 1; z < numBuf.length + 1; z++) {
            findAndHashGears(x - z, y, numBuf);
          }
          numBuf = '';
        }
      } else if (numBuf.length > 0 || numBuf.length > 0) {
        // backtrack and check all digits for symbols
        for (let z = 1; z < numBuf.length + 1; z++) {
          findAndHashGears(x - z, y, numBuf);
        }
        numBuf = '';
      }
    }
  }

  console.log(`Hashed gears ${JSON.stringify(Array.from(map.entries()))}`);

  let sum = 0;
  console.log(map.values());
  for (let val of map.values()) {
    console.log(val)
    if (val.length !== 2) {
      continue;
    }
    sum += Number(val[0]) * Number(val[1]);
  }
  // iterate over map and sum gear ratios
  console.log('Sum:', sum);
  // example for expected - 467835
  return sum;
}());

