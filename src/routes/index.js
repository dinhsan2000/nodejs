import express, {response} from 'express';
import UserController from "../controllers/user.controller.js";
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/about', (req, res) => {
  res.send('About Us');
});

router.get('/users', UserController.index)
router.post('/users', UserController.store)
router.get('/users/:id', UserController.show)
router.put('/users/:id', UserController.update)
router.delete('/users/:id', UserController.destroy)

// You can add more routes as needed

export default router;