import { useEffect, useState } from "react";
import { Button, Checkbox, Input } from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { ipcRenderer } = window.require("electron");

function App() {
  const [pass, setPass] = useState("");
  const [filePath, setFilePath] = useState("");
  const [passhide, setPassHide] = useState(true);
  const [checked, setChecked] = useState(true);

  const handleEncrypt = () => {
    if (filePath === "") {
      toast.error("Please select a file first");
      return;
    }
    if (pass === "") {
      toast.warning("Password not provided. Using default 1234");
    }
    ipcRenderer.send("encrypt", {
      filePath,
      pass: pass === "" ? 1234 : pass,
      keepfile: checked,
    });
  };

  const handleDecrypt = () => {
    if (filePath === "") {
      toast.error("Please select a file first");
      return;
    }
    if (pass === "") {
      toast.warning("Password not provided. Using default 1234");
    }
    if (!filePath.endsWith(".dsec")) {
      toast.error("Should select a dsec file");
      return;
    }
    ipcRenderer.send("decrypt", {
      filePath,
      pass: pass === "" ? 1234 : pass,
      keepfile: checked,
    });
  };

  useEffect(() => {
    ipcRenderer.on("file:enc-success", () => {
      let message = "";
      if (!checked) {
        message = "Original deleted";
      }
      toast.success(`File encrypted successfully | ${message}`);
    });

    return () => {
      ipcRenderer.removeAllListeners("file:enc-success");
    };
  });

  useEffect(() => {
    ipcRenderer.on("file:dec-success", () => {
      let message = "";
      if (!checked) {
        message = "Original deleted";
      }
      toast.success(`File decrypted successfully | ${message}`);
    });

    return () => {
      ipcRenderer.removeAllListeners("file:dec-success");
    };
  });

  useEffect(() => {
    ipcRenderer.on("file:not-available", () => {
      toast.error(`File not available | ${filePath}`);
    });
    return () => {
      ipcRenderer.removeAllListeners("file:not-available");
    };
  });

  return (
    <div className="app">
      <div className="file-select">
        <input
          type="file"
          className="input-file"
          onChange={(e) => {
            e.target.files[0]
              ? setFilePath(e.target.files[0].path)
              : toast.error("Please select a file");
          }}
        />
      </div>
      <Input
        className="password"
        label="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        type={passhide ? "password" : "text"}
        action={{
          icon: passhide ? "eye slash" : "eye",
          onClick: () => setPassHide(!passhide),
        }}
      />
      <Checkbox
        label="Keep Original file"
        onChange={() => setChecked(!checked)}
        checked={checked}
        className="keep-file"
      />
      <div className="button-grp">
        <Button fluid content="Encrypt" onClick={handleEncrypt} primary />
        <Button fluid content="Decrypt" onClick={handleDecrypt} secondary />
      </div>
      <ToastContainer autoClose={4000} hideProgressBar={true} />
    </div>
  );
}

export default App;
