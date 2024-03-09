const fs = require('node:fs');

// ------------ CONFIGURATION: BEGIN ------------
const FILE_NAME='out.nc'
const NR_OF_TILES_PER_COL = 4
const NR_OF_COLS = 6
const SCALE = 37 / 2

const DISTANCE_TILE_TO_TILE_X_MM = 40
const DISTANCE_TILE_TO_TILE_Y_MM = 45.667

const FIRST_TILE_X0_MM =   2 + SCALE * 0.866// 46
const FIRST_TILE_Y0_MM =   2 // 18
// Y: 33,91; x:28,43 - odl 0,0 lasera od 0,0 blachy
// const FIRST_TILE_X0_MM   =   46 - 28.43
// const FIRST_TILE_Y0_MM =   18 - 33.91

const SEAL = true
const SEAL_CUT_MM=SCALE * 3/7
// ------------ CONFIGURATION: END ------------

points = [[0,0],[-0.866,0.5],[-0.866,1.5],[0,2],[0.866,1.5],[0.866,0.5]];
var content

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

  if(SEAL) {
    add(`G0X${points[1][0]*SCALE+offx}Y${points[1][1]*SCALE+offy + SEAL_CUT_MM}F1000`);
    add("S0");
    add(`G0X${points[2][0]*SCALE+offx}Y${points[2][1]*SCALE+offy - SEAL_CUT_MM}F1000`);
    add("S1000");
    add(`G0X${points[2][0]*SCALE+offx}Y${points[2][1]*SCALE+offy}F1000`);
  
    // continue cutting to further points
    for(i = 3; i < points.length; i++)
      add(`X${points[i][0]*SCALE+offx}Y${points[i][1]*SCALE+offy}F1000`);

  } else {
    // continue cutting to further points
    for(i = 2; i < points.length; i++)
      add(`X${points[i][0]*SCALE+offx}Y${points[i][1]*SCALE+offy}F1000`);
  }
  
  // cut back to the last point
  add(`X${points[0][0]+offx}Y${points[0][1]+offy}`);

  add("");
}

function main() {

  content = "";
  add("M3 S0");
  add("");

  offset_x = FIRST_TILE_X0_MM;
  offset_y = FIRST_TILE_Y0_MM;

  for(let _col = 0; _col < NR_OF_COLS; _col++) {
    for(let _row = 0; _row < NR_OF_TILES_PER_COL; _row++) {
  
      draw_hex(points, offset_x, offset_y);
      offset_y += DISTANCE_TILE_TO_TILE_Y_MM;

    }
    offset_y = FIRST_TILE_Y0_MM;
    offset_x += DISTANCE_TILE_TO_TILE_X_MM;
  }

  add("S0");
  add("M5 S0");

  fs.writeFileSync(FILE_NAME, content);  
}

main();