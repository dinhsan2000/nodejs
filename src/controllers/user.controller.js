import BaseController from './base.controller.js';
import {UserModel} from "../models/user.model.js";
import {Bcrypt} from "../utils/bcrypt.js";
import {logger} from "../utils/index.js";

class UserController extends BaseController {

  async index(request, response) {
    const user = new UserModel();
    const users = await user.getAll();

    return await response.send(users);
  }

  async store(request, response) {
      try {
          const { name, email, password } = request.body;
          if (!name || !email || !password) {
              return response.status(400).send("Missing required fields.");
          }

          const user = new UserModel();
          const bcrypt = new Bcrypt();
          const passwordHashed = await bcrypt.hash(password);

          const newUser = await user.create({
              name,
              email,
              password: passwordHashed
          });

          return response.send(newUser);
      } catch (error) {
          logger('error', error);
          return response.status(500).send("Internal Server Error");
      }
  }

  async show(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    const users = await user.find(id);

    return await response.send(users);
  }

  async update(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    const data = request.body;
    const users = await user.update(data, id);

    return await response.send(users);
  }

  async destroy(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    await user.delete(id);

    return await response.send('Deleted successfully');
  }


}

export default new UserController;