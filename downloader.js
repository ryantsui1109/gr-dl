const { https } = require("follow-redirects");
const path = require("node:path");
const { createWriteStream , writeFileSync} = require("node:fs");

const result = {};

function url2fileName(urlPath) {
  const url = new URL(urlPath);
  return path.basename(url.pathname);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        result.completed=false
        reject("error: " + res.statusCode);
      }
      result.httpStatus = res.statusCode;
      console.log(`Downloading from ${url}`);
      res.pipe(file);
      file.on("finish", () => {
        result.completed=true
        resolve("Download completed");
      });
    });
  });
}

const helpTxt = `usage: node ./index.js <url>`;

const url = process.argv[2];



switch (url) {
  case "help":
    result.completed=true
    result.httpStatus=null

    console.log(helpTxt);
    writeFileSync("output/result.json", JSON.stringify(result,null,"  "));
    break;
  default:
    let fileName = "file";
    if (url2fileName(url) !== "") {
      fileName = url2fileName(url);
    }
    console.log("output/" + fileName);
    downloadFile(url, "output/" + fileName).then(()=>{
      writeFileSync("output/result.json", JSON.stringify(result,null,"  "))}
    );
    break;
}
