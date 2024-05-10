import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import {BaseModel} from "./models/base.model.js";
import dotenv from "dotenv";
import {logger} from "./utils/index.js";
import compression from "compression";

class App {
  // Initialize the server
  init() {
    const app = express();
    dotenv.config();

    app.use(cors()); // Enable CORS
    app.use(express.json()); // Parse JSON bodies
    app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies
    app.use(compression()); // Compress all responses
    app.use("/api", router); // Use the router

    // Start the server
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is running on ${process.env.APP_URL}:${process.env.APP_PORT}`);
    });
  }

  // Bootstrap the application
  bootstrap() {
    new App().init();
    new BaseModel().init().then(r => console.log("Database connected")).catch(e => logger("error", e));
    // new Logger().init();
  }
}

export default App;