import BaseController from './base.controller.js';
import {UserModel} from "../models/user.model.js";

class UserController extends BaseController {

  async index(request, response) {
    const user = new UserModel();
    const users = await user.getAll();

    return await response.send(users);
  }

  async store(request, response) {
    const user = new UserModel();
    const data = request.body;
    const users = await user.create('users', data);

    return await response.send(users);
  }

  async show(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    const users = await user.getById(id);

    return await response.send(users);
  }

  async update(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    const data = request.body;
    const users = await user.update(id, data);

    return await response.send(users);
  }

  async destroy(request, response) {
    const user = new UserModel();
    const id = request.params.id;
    const users = await user.delete(id);

    return await response.send('Deleted successfully');
  }

}

export default new UserController;