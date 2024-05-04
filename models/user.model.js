import {BaseModel} from "./base.model.js";

export class UserModel extends BaseModel {
  table = 'users';
  hidden = ['password'];
}