const fs = require('node:fs');

// ------------ CONFIGURATION: BEGIN ------------
const FILE_NAME='out.nc'
const LASER_POWER = 1000 //5
const CUT_SPEED = 700 //F1000 S500 enough for 0.3mm glossy paper cut F700 S1000 for laminated glossy 0.3mm paper
const NR_OF_TILES_PER_COL = 3
const NR_OF_COLS = 5
const SCALE = 44  // length of the longer diagonal of the hex in mm
const LEFT_MARGIN = 19.5 //Distance from X0 mahine axe to the left hexagons left enge
const BOTTOM_MARGIN = 5 //Distance from Y0 mahine axe to the lowest bottom hexagons points
const LASER_FOCUS_Z = -36.4 //Z position for best laser focus
const DISTANCE_TILE_TO_TILE_X_MM = 41.25
const DISTANCE_TILE_TO_TILE_Y_MM = 47

const FIRST_TILE_X0_MM =   LEFT_MARGIN + SCALE * 0.433// 46
const FIRST_TILE_Y0_MM =   BOTTOM_MARGIN // 18
// Y: 33,91; x:28,43 - odl 0,0 lasera od 0,0 blachy
// const FIRST_TILE_X0_MM   =   46 - 28.43
// const FIRST_TILE_Y0_MM =   18 - 33.91

const SEAL = false
const SEAL_CUT_MM=SCALE * 3/7
// ------------ CONFIGURATION: END ------------

points = [[0,0],[-0.433,0.25],[-0.433,0.75],[0,1],[0.433,0.75],[0.433,0.25]];
var content

function add(txt) {
  content += txt + "\n";
}

function draw_hex(points, offx, offy) {
  add("M5");

  // go to the first point
  add(`G0X${(points[0][0]+offx).toFixed(3)}Y${(points[0][1]+offy).toFixed(3)}`);
  
  add("M3");      
  // cut to the first point
  add(`G1X${(points[1][0]*SCALE+offx).toFixed(3)}Y${(points[1][1]*SCALE+offy).toFixed(3)}`);
  if(SEAL) {
    add(`G1X${(points[1][0]*SCALE+offx).toFixed(3)}Y${(points[1][1]*SCALE+offy + SEAL_CUT_MM).toFixed(3)}`);
	
    add("M5");
    add(`G0X${(points[2][0]*SCALE+offx).toFixed(3)}Y${(points[2][1]*SCALE+offy - SEAL_CUT_MM).toFixed(3)}`);
	
    add("M3");
    add(`G1X${(points[2][0]*SCALE+offx).toFixed(3)}Y${(points[2][1]*SCALE+offy).toFixed(3)}`);
      // continue cutting to further points
    for(i = 3; i < points.length; i++)
      add(`G1X${(points[i][0]*SCALE+offx).toFixed(3)}Y${(points[i][1]*SCALE+offy).toFixed(3)}`);

  } else {
    // continue cutting to further points
    for(i = 2; i < points.length; i++)
      add(`G1X${(points[i][0]*SCALE+offx).toFixed(3)}Y${(points[i][1]*SCALE+offy).toFixed(3)}`);
  }
  
  // cut back to the last point
  add(`G1X${(points[0][0]+offx).toFixed(3)}Y${(points[0][1]+offy).toFixed(3)}`);

  add("");
}

function main() {

  content = "";
  add(";GRBL gcode cutting or engraving number of hexagons");
  add(";No of hexagons in column " + NR_OF_TILES_PER_COL);
  add(";No of hexagons in row " + NR_OF_COLS);
  add(";Left margin " + LEFT_MARGIN + " mm");
  add(";Bottom margin " + BOTTOM_MARGIN + " mm");
  add(";Cutting speed " + CUT_SPEED + " mm/min");
  add (";Laser power " + LASER_POWER);
  add (";Cutting Z position " + LASER_FOCUS_Z + " mm");
  add(";Speed F1000 and power S500 are enough for 0.3mm glossy paper cut F700 S1000 for laminated glossy 0.3mm paper");
  add("");

  add("G0Z" + LASER_FOCUS_Z);
  add("M5 S" + LASER_POWER);
  add("G1F" + CUT_SPEED);
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

  add("M5 S0");
  add("M30 ;End of program")

  fs.writeFileSync(FILE_NAME, content);  
}

main();