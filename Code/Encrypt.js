const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const encrypt = ({ file, password, keepOriginal }, mainWindow) => {
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
    if (err) {
      console.log(err);
    }
    const encFileName = `${file}.dsec`;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algo, key, iv);

    const encrypted_file = Buffer.concat([
      iv,
      cipher.update(f),
      cipher.final(),
    ]);

    fs.writeFile(encFileName, encrypted_file, (error) => {
      if (error) {
        console.error(error);
      } else {
        mainWindow.webContents.send("file:enc-success", {});
        console.log("file encrypted successfully");
      }
    });
    if (!keepOriginal) {
      fs.unlinkSync(file);
    }
  });
};

module.exports = encrypt;
