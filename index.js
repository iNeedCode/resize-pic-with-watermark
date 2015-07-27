var fs = require('fs')
  , gm = require('gm');

function walk(currentDirPath, callback) {
    var fs = require('fs'), path = require('path');
    fs.readdirSync(currentDirPath).forEach(function(name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walk(filePath, callback);
        }
    });
}


var inputDir = '/Users/USER/Desktop/original
/'
var outputDir = '/Users/USER/Desktop/target/'
var watermark_position = 'image Over 50,50 400,400 '
var logo_source = __dirname + '/logo.png'

walk(inputDir, function(filePath, stat) {
    // match filename like IMG_1234.JPG
    // delete .DS_Store under OS X
    var filename = filePath.match(/IMG_\d{4}.JPG/gmi).toString();
    console.log(filename);
    var outputfile = outputDir + filename

    var readStream = fs.createReadStream(filePath);
    gm(readStream, filename)
    .draw([watermark_position + logo_source])
    .size({bufferStream: true}, function(err, size) {
      this.resize(size.width / 2, size.height / 2)
      this.write(outputfile, function (err) {
        if (!err) console.log('done');
      });
    });
});
