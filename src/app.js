import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import dotenv from 'dotenv';
import compression from 'compression';

class App {
  static #instance;

  // Private constructor
  constructor() {
    if (App.#instance) {
      throw new Error('Singleton class, use getInstance method instead.');
    }
    // Load environment variables
    dotenv.config();
    // Create the Express app
    this.createExpressApp();
    // Start the server
    this.startServer();

    // Assign this instance to the static property
    App.#instance = this;
  }

  createExpressApp() {
    this.app = express();
    this.app.use(cors()); // Enable CORS
    this.app.use(express.json()); // Parse JSON bodies
    this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    this.app.use(compression()); // Compress all responses
    this.app.use('/api', router); // Use the router
    this.app.use(function (req, res) {
      // Handle route not found
      res.status(404);
      res.json({
        message: 'Route not found',
      });
    });
  }

  startServer() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(
        `Server is running on ${process.env.APP_URL}:${process.env.APP_PORT}`,
      );
    });
  }

  // Static method to get instance
  static getInstance() {
    if (!App.#instance) {
      App.#instance = new App();
    }
    return App.#instance;
  }

  // Bootstrap the application
  static bootstrap() {
    return App.getInstance();
  }
}

export default App;
