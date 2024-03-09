const fs = require('node:fs');

const NR_OF_TILES_PER_ROW = 4
const NR_OF_ROWS = 1
var content

points = [[0,0]	,	[-0.866, 0.5],	[-0.866, 1.5]	,	[0,2]	,	[0.866,1.5]	,	[0.866,0.5]];

function add(txt) {
  content += txt + "\n";
}

function main() {

  content = "";
  add("M3 S0");
  add("");

  for(let row = 0; row < NR_OF_ROWS; row++) {
    for(let col = 0; col < NR_OF_TILES_PER_ROW; col++) {

      add("S0");

      // go to the first point
      add(`G0X${points[0][0]}Y${points[0][1]}`);
      add("S1000");    
      
      // cut to the first point
      add(`G0X${points[1][0]}Y${points[1][1]}F1000`);

      // continue cutting to further points
      for(i = 2; i < points.length; i++)
        add(`X${points[i][0]}Y${points[i][1]}F1000`);
      
      // cut back to the last point
      add(`X${points[0][0]}Y${points[0][1]}`);

      add("");

    }
  }

  add("S0");
  add("M5 S0");

  fs.writeFile('test.nc', content, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
}