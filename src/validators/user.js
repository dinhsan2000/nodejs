import { body } from 'express-validator';

export const userValidator = () => {
  return [
    body('name').isString().isLength({ min: 3, max: 255 }),
    body('email').isEmail(),
    body('password').isString().isLength({ min: 8, max: 255 }),
  ];
};

export const userLoginValidator = () => {
  return [
    body('email').isEmail(),
    body('password').isString().isLength({ min: 6, max: 255 }),
  ];
}