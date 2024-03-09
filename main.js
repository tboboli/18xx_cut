const fs = require('node:fs');

const FILE_NAME='out.nc'
const NR_OF_TILES_PER_ROW = 4
const NR_OF_ROWS = 6
var content
const SCALE = 37 / 2

//const GLOBAL_MARGIN_LEFT_MM   =   46
//const GLOBAL_MARGIN_BOTTOM_MM =   18

// Y: 33,91; x:28,43 - odl 0,0 lasera od 0,0 blachy
const GLOBAL_MARGIN_LEFT_MM   =   46 - 28.43
const GLOBAL_MARGIN_BOTTOM_MM =   18 - 33.91

points = [[0,0]	,	[-0.866, 0.5],	[-0.866, 1.5]	,	[0,2]	,	[0.866,1.5]	,	[0.866,0.5]];

function add(txt) {
  content += txt + "\n";
}

function draw_hex(points, offx, offy) {
  add("S0");

  // go to the first point
  add(`G0X${points[0][0]+offx}Y${points[0][1]+offy}`);
  add("S1000");    
  
  // cut to the first point
  add(`G0X${points[1][0]*SCALE+offx}Y${points[1][1]*SCALE+offy}F1000`);

  // continue cutting to further points
  for(i = 2; i < points.length; i++)
    add(`X${points[i][0]*SCALE+offx}Y${points[i][1]*SCALE+offy}F1000`);
  
  // cut back to the last point
  add(`X${points[0][0]+offx}Y${points[0][1]+offy}`);

  add("");
}

function main() {

  content = "";
  add("M3 S0");
  add("");

  offset_x = GLOBAL_MARGIN_LEFT_MM;
  offset_y = GLOBAL_MARGIN_BOTTOM_MM;

  for(let row = 0; row < NR_OF_ROWS; row++) {
    for(let col = 0; col < NR_OF_TILES_PER_ROW; col++) {
  
      draw_hex(points, offset_x, offset_y);
      offset_y += 40;

    }
    offset_y = GLOBAL_MARGIN_BOTTOM_MM;
    offset_x += 45;
  }

  add("S0");
  add("M5 S0");

  fs.writeFileSync(FILE_NAME, content);  
}

main();