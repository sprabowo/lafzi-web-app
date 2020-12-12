var path = require("path"),
  fs = require("fs"),
  child = require("child_process");

function findFilesInDir(startPath, filter) {
  var results = [];

  if (!fs.existsSync(startPath)) {
    console.log("directory not found ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter)); //recurse
    } else if (filename.indexOf("." + filter) >= 0) {
      results.push(filename);
    }
  }
  return results;
}

function optimizeAssets(srcDir, targetDir, fileExt) {
  var totalFiles = findFilesInDir(srcDir, fileExt);
  for (var i = 0; i < totalFiles.length; i++) {
    var fileDirSplit = totalFiles[i].replace(srcDir, "").split("/");
    var OutputFileDir =
      fileDirSplit.length > 0
        ? fileDirSplit
            .join("/")
            .split("." + fileExt)[0]
            .split("/")
            .slice(0, -1)
            .join("/") + "/"
        : "/";
    var optimizePlus = fileExt === "png" ? "--oxipng" : "--mozjpeg";
    try {
      child.execSync(
        "squoosh-cli --webp '{\"quality\": 90}' ./" +
          totalFiles[i] +
          " -d ./" +
          targetDir +
          OutputFileDir,
        { stdio: "inherit" }
      );
      child.execSync(
        "squoosh-cli " +
          optimizePlus +
          " '{\"quality\": 90}' ./" +
          totalFiles[i] +
          " -d ./" +
          targetDir +
          OutputFileDir,
        { stdio: "inherit" }
      );
    } catch (e) {
      continue;
    }
  }
}

console.time("startOptimize");
optimizeAssets("public", "build", "jpg");
optimizeAssets("public", "build", "png");
console.timeEnd("startOptimize");
console.log(
  findFilesInDir("public", "jpg").concat(findFilesInDir("public", "png"))
);
