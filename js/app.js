var fileSystem;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.requestFileSystem(window.TEMPORARY, 1024*1024, function (fs) {
  fileSystem = fs;
}, errorHandler);

function errorHandler() {

}

function readFile(f, onload, onprogress) {
  var reader = new FileReader();

  reader.onload = onload;
  reader.onprogress = onprogress;

  reader.readAsArrayBuffer(f);
}

function readFromInput(elem, cb) {
  readFile(elem.files[0], cb, function(progress) {
    console.log("Loaded " + progress.loaded + " out of " + progress.total);
  });
}

function saveToDisk(arrayBuffer, path) {
  var content = new Int8Array(arrayBuffer);

  var start = -128;
  for (var i = 100002; i < content.length; i += 3) {
    content[i+0] = start;
    content[i+1] = start;
    content[i+2] = start;

    start++;
  }

  fileSystem.root.getFile(path, { 'create': true }, function(fileEntry) {
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.onwriteend = function(event) {
        alert('done!');
        loadFromLocalIntoImage(path);
      };

      var blob = new Blob([arrayBuffer], { type: 'image/jpg' });
      fileWriter.write(blob);
    }, errorHandler);
  });
}

function loadFromLocalIntoDataURL(path, cb) {
  var readme = new FileReader();
  fileSystem.root.getFile(path, {}, function(f) {
    f.file(function(f) {
      readme.onload = function(d) {
        cb(d.target.result);
      };
      readme.readAsDataURL(f);
    });
  });
}

function loadFromLocalIntoImage(path) {
  loadFromLocalIntoDataURL(path, function(data) {
    document.querySelector('img').src = data;
  });
}
