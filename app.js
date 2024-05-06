import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import {BaseModel} from "./models/base.model.js";
import dotenv from "dotenv";

class App {
  // Initialize the server
  init() {
    const app = express();
    dotenv.config();

    app.use(cors()); // Enable CORS
    app.use(express.json()); // Parse JSON bodies
    app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies
    app.use("/api", router); // Use the router

    // Start the server
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is running on port ${process.env.APP_PORT}`);
    });
  }

  // Bootstrap the application
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