const { airplaneSeatBlocks, passengers } = require('./config');

/* columns is array of columns object. index is column index
  column object:{ 
                 blockIndex: block number. 1 indexed
                 position: 'A' for aisle, 'W' for window, 'C' for center
                 maxRow: how many seat in the column. every seat in the column is called row
                 seats: [] array's every item is passenger number.
                        array index is row number. maxRow=seats.length() 
}
*/
const columns = []; // array of column objects

/**
 * controllers, validators
 */
if (passengers.length > 99) {
  console.log('**Error : Passengers can not be more than 99');
  return;
}
let maxSeat = 0;
// calculate how many seats in the plane
airplaneSeatBlocks.forEach((block) => {
  maxSeat += block[0] * block[1];
});

if (passengers.length > maxSeat) {
  console.log('**Error : Passengers can not be more than airplane seats');
  return;
}

/**
 *  Initialize the column Objects-seats columns, aisle, window, center columns, rows
 */

// initiliaze the columns
let columnNo = 0;
airplaneSeatBlocks.forEach((block, blockIndex) => {
  for (i = 0; i < block[0]; i++) {
    columns.push({}); // push empty column object
    columns[columnNo].blockIndex = blockIndex + 1;
    columns[columnNo].maxRow = block[1];
    columns[columnNo].seats = [];
    columnNo++;
  }
});

/**
 * set the columns position
 */
let maxWindowSeat,
  maxAisleSeat = 0;
const aisleColIndexes = [],
  centerColIndexes = []; // column index array of aisles and centers

//first and the last columns are window
columns[0].position = 'W';
columns[columns.length - 1].position = 'W';
maxWindowSeat = columns[0].maxRow + columns[columns.length - 1].maxRow;

//set the aisle and center columns
for (i = 1; i < columns.length - 1; i++) {
  if (columns[i].blockIndex === columns[i + 1].blockIndex) {
    columns[i].position = 'C';
    centerColIndexes.push(i);
  } else {
    columns[i].position = 'A';
    columns[i + 1].position = 'A';
    maxAisleSeat += columns[i].maxRow + columns[i + 1].maxRow;
    aisleColIndexes.push(i, i + 1);
    i++;
  }
}
console.log('AIRPLANE SEAT COLUMNS:');
console.table(columns);

/**
 * seat the passengers
 */

let passengerCount = 1,
  colIndex = 0;

// first seat passengers to aisles
while (passengerCount <= maxAisleSeat) {
  if (columns[aisleColIndexes[colIndex]].seats.length < columns[aisleColIndexes[colIndex]].maxRow) {
    columns[aisleColIndexes[colIndex]].seats.push(passengers.shift()); //seat passenger and remove from the queue
    passengerCount++;
  }
  colIndex === aisleColIndexes.length - 1 ? (colIndex = 0) : colIndex++;
}

// next seat passengers to windows (0 and last columns)
colIndex = 0;
passengerCount = 1;
while (passengerCount <= maxWindowSeat) {
  if (columns[colIndex].seats.length < columns[colIndex].maxRow) {
    columns[colIndex].seats.push(passengers.shift()); //seat passenger and remove from the queue
    passengerCount++;
  }
  colIndex === 0 ? (colIndex = columns.length - 1) : (colIndex = 0);
}

// next seat remaining passengers to the centers
colIndex = 0;
while (passengers.length) {
  if (columns[centerColIndexes[colIndex]].seats.length < columns[centerColIndexes[colIndex]].maxRow)
    columns[centerColIndexes[colIndex]].seats.push(passengers.shift()); //seat passenger and remove from the queue

  colIndex === centerColIndexes.length - 1 ? (colIndex = 0) : colIndex++;
}

/**
 * print the airplane seats to the console or send as JSON
 */
const displayGrid = {}; // console.table grid to show the all passenger seat
columns.forEach((col, colIndex) => {
  col.seats.forEach((passenger, rowIndex) => {
    if (!displayGrid['Row ' + (rowIndex + 1)]) displayGrid['Row ' + (rowIndex + 1)] = {};
    displayGrid['Row ' + (rowIndex + 1)][col.blockIndex + '.' + (colIndex + 1)] = passenger;
  });
});

console.table(displayGrid);
