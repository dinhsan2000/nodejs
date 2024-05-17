import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import dotenv from 'dotenv';
import compression from 'compression';

class Application {
  static #instance;

  // Private constructor
  constructor() {
    if (Application.#instance) {
      throw new Error('Singleton class, use getInstance method instead.');
    }
    // Load environment variables
    dotenv.config();
    // Create the Express app
    this.createExpressApp();
    // Start the server
    this.startServer();

    // Assign this instance to the static property
    Application.#instance = this;
  }

  createExpressApp() {
    this.application = express();
    this.application.use(cors()); // Enable CORS
    this.application.use(express.json()); // Parse JSON bodies
    this.application.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    this.application.use(compression()); // Compress all responses
    this.application.use('/api', router); // Use the router
    this.application.use(function (req, res) {
      // Handle route not found
      res.status(404);
      res.json({
        message: 'Route not found',
      });
    });
  }

  startServer() {
    const port = process.env.PORT || 3000;
    this.application.listen(port, () => {
      console.log(
        `Server is running on ${process.env.APP_URL}:${process.env.APP_PORT}`,
      );
    });
  }

  // Static method to get instance
  static getInstance() {
    if (!Application.#instance) {
      Application.#instance = new Application();
    }
    return Application.#instance;
  }

  // Bootstrap the application
  static bootstrap() {
    return Application.getInstance();
  }
}

export default Application;
