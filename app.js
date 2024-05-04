import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import {BaseModel} from "./models/base.model.js";

class App {
  // Initialize the server
  init() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use("/api", router);
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }

  bootstrap() {
    new App().init();
    new BaseModel().init()
    .then((connection) => {
      console.log('Connected to the database');
      return connection;
    }).catch((error) => {
      console.log('Error connecting to the database: ', error);
    });
  }
}

export default App;