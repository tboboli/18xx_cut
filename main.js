const fs = require('node:fs');

const NR_OF_TILES_PER_ROW = 4
const NR_OF_ROWS = 1


function add(txt) {
  content += txt + "\n";
}

let content = "";
content += "M3 S0\n";
content += "\n";

for(let row = 0; row < NR_OF_ROWS; row++) {
  for(let col = 0; col < NR_OF_TILES_PER_ROW; col++) {

    content += "S0\n";

    // content += "G0X30.736Y47.641\n";
    // content += "S1000\n";

    // content += "G1X46.57Y39.175F1000\n";
    // content += "Y22.243\n";
    // content += "X30.736Y13.777\n";
    // content += "X14.902Y22.243\n";
    // content += "X14.902Y39.175\n";
    // content += "X30.736Y47.641\n";
    add("G0X0Y0");
    add("S1000");
    add("G1X-0.866Y0.5F1000");
    add("Y1.5");
    add("X0Y2");
    add("G1X0.866Y1.5F1000");
    add("Y0.5");
    add("X0Y0");

    content += "\n";

  }
}



fs.writeFile('test.nc', content, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});