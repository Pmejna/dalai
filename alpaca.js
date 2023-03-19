const path = require("path");
// eslint-disable-next-line no-unused-vars
const term = require("terminal-kit").terminal;
// eslint-disable-next-line no-unused-vars
const git = require("isomorphic-git");
// eslint-disable-next-line no-unused-vars
const Downloader = require("nodejs-file-downloader");
// eslint-disable-next-line no-unused-vars
const http = require("isomorphic-git/http/node");
const os = require("os");
const fs = require("fs");
const platform = os.platform();
class Alpaca {
  constructor(root) {
    this.root = root;
    this.home = path.resolve(this.root.home, "alpaca");
    this.url = "https://github.com/cocktailpeanut/alpaca.cpp.git";
  }
  async make() {
    let success;
    if (platform === "win32") {
      // CMake on Windows
      const venv_path = path.join(this.root.home, "venv");
      const cmake_path = path.join(venv_path, "Scripts", "cmake");
      await this.root.exec("mkdir build", this.home);
      await this.root.exec(
        `Remove-Item -path ${path.resolve(
          this.home,
          "build",
          "CMakeCache.txt"
        )}`,
        this.home
      );
      await this.root.exec(
        `${cmake_path} ..`,
        path.resolve(this.home, "build")
      );
      await this.root.exec(
        `${cmake_path} --build . --config Release`,
        path.resolve(this.home, "build")
      );
    } else {
      // Make on linux + mac
      success = await this.root.exec(`make`, this.home);
      if (!success) {
        throw new Error("running 'make' failed");
      }
    }
  }
  async add(...models) {
    models = models.map((m) => {
      return m.toUpperCase();
    });
    for (let model of models) {
      const venv_path = path.join(this.root.home, "venv");
      // eslint-disable-next-line no-unused-vars
      const python_path =
        platform == "win32"
          ? path.join(venv_path, "Scripts", "python.exe")
          : path.join(venv_path, "bin", "python");
      /**************************************************************************************************************
       *
       * 5. Download models + convert + quantize
       *
       **************************************************************************************************************/
      const outputFile = path.resolve(
        this.home,
        "models",
        model,
        "ggml-model-q4_0.bin"
      );
      if (fs.existsSync(outputFile)) {
        console.log(`Skip conversion, file already exists: ${outputFile}`);
      } else {
        // eslint-disable-next-line no-unused-vars
        const task = `downloading ${outputFile}`;
        const url =
          "https://ipfs.io/ipfs/QmQ1bf2BTnYxq73MFJWu1B7bQ2UD6qG7D7YDCxhTndVkPC";
        const dir = path.resolve(this.home, "models", model);
        await fs.promises.mkdir(dir, { recursive: true }).catch((error) => {
          console.log("Error", error);
        });
        await this.root.down(url, path.resolve(dir, "ggml-model-q4_0.bin"));
      }
    }
  }
}
module.exports = Alpaca;
