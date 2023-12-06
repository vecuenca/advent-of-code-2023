const fs = require('fs');
/**
 * Example:
 *  Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
 * Total: 13 points
 * 
 * Approach:
 * - First, for each card, compute winning numbers
 *   - create a hashmap with a key:copies key value pair mapping
 * - Create a stack with the initial cards
 * - Pop off cards, look up hash tables to see which copies we've won, add to stack
 * 
 * hash table: example
 * {
 *   0: [1, 2, 3, 4, 5],
 *   1: []
 * }
 */
(function () {
  const data = fs.readFileSync('4.csv', 'utf-8');
  const rows = data.split('\n')
    .map(row => row.split(': ')[1])
    .map(row => {
      const split = row.split(' | ');
      return {
        winningNums: split[0].split(' ').filter(x => x.length > 0),
        ourNums: split[1].split(' ').filter(x => x.length > 0),
      };
    });
  console.log(rows);

  const copyMap = new Map();
  // map keys to copies
  for (let i = 0; i < rows.length; i++) {
    const map = new Set();

    for (const winningNum of rows[i].winningNums) {
      map.add(winningNum);
    }

    let winners = 0;
    for (const num of rows[i].ourNums) {
      if (map.has(num)) {
        winners += 1;
      }
    }

    if (winners > 0) {
      const copies = [];
      for (let j = 1; j <= winners; j++) {
        copies.push((i + 1) + j);
      }
      copyMap.set(i + 1, copies);
    }


  }


  // populate initial stack
  const stack = [];
  const countmap = {};
  for (let i = 1; i <= rows.length; i++) {
    stack.push(i);
    if (countmap[i]) {
      countmap[i] = countmap[i] + 1;
    } else {
      countmap[i] = 1;
    }
  }

  // consume stack
  let scratchcardsTotal = 0; // question is a bit ambiguous, i thought this would've included the initial set of cards as well..

  while (stack.length > 0) {
    const copy = stack.pop();
    scratchcardsTotal += 1;
    countmap[copy] += 1;
    if (!copyMap.has(copy)) {
      continue;
    }

    const newCopies = copyMap.get(copy);
    // console.log(`Pushing ${newCopies} for ${copy}`);
    stack.push(...newCopies);
  }
  console.log(countmap)

  console.log('Total scratchcards:', scratchcardsTotal);
  return scratchcardsTotal;
}());