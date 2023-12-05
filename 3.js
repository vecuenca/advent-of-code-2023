const assert = require('assert');
const fs = require('fs');
/**
 * Approaches
 * - Walk through array, keep track of numbers when we encounter them,
 *  when a number ends then check if there is a symbol adjacent to all the individual digits
 *  if so, sum the number
 * 
 * - walk through array until we find a symbol
 *   check adjacent squares for a number, if a number found, then need to find all digits of that number
 * 
 * 
 */
(function () {
  const isNonAlphaNumeric = (str) => str.match(/^[^a-zA-Z0-9]+$/);
  const isNumber = (any) => Number.isFinite(Number(any));

  const findSymbols = (x, y) => {
    let symbolFound = false;
    const checkCoord = (x, y) => {
      if (rows[y] === undefined) {
        return;
      }
      const current = rows[y][x];
      if (current === undefined) {
        console.debug(`Out of bounds, early return`);
        return;
      }
      // console.debug(`Checking ${x} ${y}: ${current}`);
      if (current !== undefined && isNonAlphaNumeric(current) && current !== '.') {
        console.debug(`Symbol detected ${current}`);
        symbolFound = true;
      }
    };
    console.debug(`Checking for symbols at ${x} ${y} - ${rows[y][x]}`);
    checkCoord(x + 1, y);
    checkCoord(x - 1, y);
    checkCoord(x, y + 1);
    checkCoord(x, y - 1);
    checkCoord(x + 1, y - 1);
    checkCoord(x + 1, y + 1);
    checkCoord(x - 1, y - 1);
    checkCoord(x - 1, y + 1);

    return symbolFound;
  };

  const data = fs.readFileSync('3.csv', 'utf-8');

  const rows = data.split('\n');
  console.log(rows)

  let sum = 0;
  for (let y = 0; y < rows.length; y++) {
    let numBuf = '';
    for (let x = 0; x < rows[y].length; x++) {
      const current = rows[y][x];

      if (isNumber(current)) {
        numBuf += current;
        // console.log('adding to buf', numBuf)
        if (rows[y][x + 1] === undefined) {
          for (let z = 1; z < numBuf.length + 1; z++) {
            // if symbol found, add to sum
            if (findSymbols(x - z, y) === true) {
              sum += Number(numBuf);
              console.debug(`Symbol found, summing ${numBuf}`);
              break;
            }
          }
          numBuf = '';
        }
      } else if (numBuf.length > 0 || numBuf.length > 0) {
        // console.log('emptying buf')
        // backtrack and check all digits for symbols
        for (let z = 1; z < numBuf.length + 1; z++) {
          // if symbol found, add to sum
          if (findSymbols(x - z, y) === true) {
            sum += Number(numBuf);
            console.debug(`Symbol found, summing ${numBuf}`);
            break;
          }
        }
        numBuf = '';
      }
    }
  }
  console.log(sum)
  // example for expected - 4361
  return sum;
}());

