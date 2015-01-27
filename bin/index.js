var fs = require('fs');
var glob = require('glob');

var disk;
var disks = [];

var idx;

glob('json/disks/*.json', function(err, files) {
    for (idx = 0; idx < files.length; idx++) {
        var filename = files[idx];
        var json = fs.readFileSync(filename);

        disk = JSON.parse(json);
        disk.filename = filename;
        delete disk.data;

        disks.push(disk);
    }

    disks = disks.sort(function(a, b) {
        var result = a.category.localeCompare(b.category);
        if (result === 0) {
            result = a.name.localeCompare(b.name);
        }
        return result;
    });
    
    console.log('disk_index = ' + JSON.stringify(disks, null, 4));
});

