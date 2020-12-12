var path = require("path"),
  fs = require("fs"),
  child = require("child_process");

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 */
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
        "npx @squoosh/cli --webp '{\"quality\": 90}' ./" +
          totalFiles[i] +
          " -d ./" +
          targetDir +
          OutputFileDir,
        { stdio: "inherit" }
      );
      child.execSync(
        "npx @squoosh/cli " +
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
