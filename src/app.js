import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import dotenv from 'dotenv';
import compression from 'compression';
import Database from './models/database.js';

class App {
  // Initialize the server
  init() {
    const app = express();
    dotenv.config();

    app.use(cors()); // Enable CORS
    app.use(express.json()); // Parse JSON bodies
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(compression()); // Compress all responses
    app.use('/api', router); // Use the router
    app.use(function (req, res) { // Handle route not found
      res.status(404);
      res.json({
        message: 'Route not found',
      });
    });

    // Start the server
    app.listen(process.env.APP_PORT, () => {
      console.log(
        `Server is running on ${process.env.APP_URL}:${process.env.APP_PORT}`,
      );
    });
  }

  // Bootstrap the application
  bootstrap() {
    new App().init();
    new Database().init().then((r) => {
      console.log('Database connected');
    });
    // new Logger().init();
  }
}

export default App;
