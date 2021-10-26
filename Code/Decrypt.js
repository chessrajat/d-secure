const crypto = require("crypto");
const fs = require("fs");

const decrypt = ({ file, password, keepOriginal }, mainWindow) => {
  const algo = "aes-256-ctr";
  const key = crypto
    .createHash("sha256")
    .update(String(password))
    .digest("base64")
    .substr(0, 32);

  if (!fs.existsSync(file)) {
    mainWindow.webContents.send("file:not-available", {});
    return;
  }

  fs.readFile(file, (err, f) => {
    console.log(err);
    if (err) {
      console.log(err);
    }
    const decFileName = file.replace(".dsec", "");
    console.log(decFileName);
    try {
      const iv = f.slice(0, 16);
      f = f.slice(16);
      const decipher = crypto.createDecipheriv(algo, key, iv);

      const decrypted_file = Buffer.concat([
        decipher.update(f),
        decipher.final(),
      ]);

      fs.writeFile(decFileName, decrypted_file, (error) => {
        console.log("err",error)
        if (error) {
          console.error(error);
        } else {
          mainWindow.webContents.send("file:dec-success", {});
          console.log("file decrypted successfully");
        }
      });
      if (!keepOriginal) {
        fs.unlinkSync(file);
      }
    } catch (e) {
      console.log(e);
      console.log("here");
      return;
    }
  });
};

module.exports = decrypt;
