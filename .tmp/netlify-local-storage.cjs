const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { syncBuiltinESMExports } = require("node:module");
const { Writable } = require("node:stream");

const root = path.dirname(__dirname);
const publicDir = path.join(root, "public");
const nextStandalone = path.join(root, ".next", "standalone");
const staticDir = path.join(root, ".netlify", "static");
const internalDir = path.join(root, ".netlify", "functions-internal");
const originalCp = fsp.cp;
const originalCopy = fsp.copyFile;
const originalWriteStream = fs.createWriteStream;
const inside = (candidate, directory) =>
  candidate === directory || candidate.startsWith(directory + path.sep);
const largeAsset = (relative) => /^(public|holi|social|tmp)[\\/]/.test(relative);

async function copyWithAssetLinks(source, dest, options, linkAsset) {
  if (options.filter && !(await options.filter(source, dest))) return;
  const stat = await fsp.lstat(source);
  if (stat.isDirectory()) {
    await fsp.mkdir(dest, { recursive: true });
    for (const name of await fsp.readdir(source)) {
      await copyWithAssetLinks(path.join(source, name), path.join(dest, name), options, linkAsset);
    }
  } else if (stat.isFile() && linkAsset(source)) {
    await fsp.link(source, dest);
  } else {
    await originalCp(source, dest, { ...options, filter: undefined });
  }
}

fsp.cp = async function (source, dest, options = {}) {
  if (source === publicDir && inside(dest, staticDir)) {
    return copyWithAssetLinks(source, dest, options, () => true);
  }
  if (source === nextStandalone && inside(dest, internalDir)) {
    return copyWithAssetLinks(source, dest, options, (file) => largeAsset(path.relative(source, file)));
  }
  return originalCp(source, dest, options);
};

fsp.copyFile = async function (source, dest, ...options) {
  if (typeof source === "string" && typeof dest === "string" &&
      inside(source, root) && inside(dest, nextStandalone) && largeAsset(path.relative(root, source))) {
    return fsp.link(source, dest);
  }
  return originalCopy(source, dest, ...options);
};

if (process.env.NETLIFY_COUNT_BASELINE_ZIP === "1") {
  fs.createWriteStream = function (file, ...options) {
    if (typeof file !== "string" || path.basename(file) !== "___netlify-server-handler.zip") {
      return originalWriteStream(file, ...options);
    }
    let bytes = 0;
    const output = new Writable({
      write(chunk, encoding, done) {
        bytes += chunk.length;
        done();
      },
    });
    output.once("finish", () => {
      console.log(`Baseline server ZIP byte count (streamed): ${bytes}`);
      output.emit("close");
    });
    return output;
  };
}
syncBuiltinESMExports();
