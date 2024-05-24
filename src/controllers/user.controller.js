import BaseController from './base.controller.js';
import { UserModel } from '../models/user.model.js';
import { Bcrypt } from '../utils/bcrypt.js';
import { logger } from '../utils/index.js';
import { JWT } from '../utils/jwt.js';

class UserController extends BaseController {
  async index(request, response) {
    const user = new UserModel();
    const users = await user.whereNotNull('image').get();

    return await response.send(users);
  }

  async store(request, response) {
    try {
      const { name, email, password } = request.body;
      if (!name || !email || !password) {
        return response.status(400).send('Missing required fields.');
      }

      const user = new UserModel();
      const bcrypt = new Bcrypt();
      const passwordHashed = await bcrypt.hash(password);

      const newUser = await user.create({
        name,
        email,
        password: passwordHashed,
      });

      return response.send(newUser);
    } catch (error) {
      logger('error', error);
      return response.status(500).send('Internal Server Error');
    }
  }

  async show(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    const users = await user.find(id);

    return await response.send(users);
  }

  async update(request, response) {
    const id = request.params.id;
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).send('Missing required fields.');
    }

    const user = new UserModel();
    const bcrypt = new Bcrypt();
    const passwordHashed = await bcrypt.hash(password);

    const users = await user.update(id, {
      name,
      email,
      password: passwordHashed,
    });

    return await response.send(users);
  }

  async destroy(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    await user.delete(id);

    return await response.send('Deleted successfully');
  }

  async login(request, response) {
    const { email, password } = request.body;

    const user = new UserModel();
    const users = await user.where({ email: email }).withOutHiddenField().first();

    if (!users) {
      return response.status(404).send('User not found.');
    }

    const bcrypt = new Bcrypt();
    const isValidPassword = await bcrypt.compare(password, users[0].password);

    if (!isValidPassword) {
      return response.status(401).send({ message: 'Invalid password.' });
    }

    const accessToken = await JWT.sign(
      { id: users[0].id, name: users[0].name, email: users[0].email },
      { expiresIn: '1d' },
    );

    return response.send({
      user: users,
      token: accessToken,
      message: 'Logged in successfully',
    });
  }
}

export default new UserController();
