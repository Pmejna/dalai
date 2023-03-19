const Dalai = require("./index");
new Dalai()
  .setup()
  .then(() => {
    console.log("executed setup");
    process.exit(0);
  })
  .catch((error) => {
    console.log("Error", error);
    process.exit(1);
  });
