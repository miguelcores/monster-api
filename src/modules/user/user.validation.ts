import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  // username: Joi.string().required().min(3).max(15),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  role: Joi.string().required().valid('user', 'admin'),
  image: Joi.string(),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

const paginationQuery = Joi.object().keys({
  name: Joi.string(),
  role: Joi.string(),
  sortBy: Joi.string(),
  projectBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
  withParent: Joi.boolean(),
});

export const getUsers = {
  query: paginationQuery,
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const upsertUserGold = {
  params: Joi.object().keys({
    monsterId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      goldAddAmount: Joi.number().min(0).max(1000000),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const getUserMonsters = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: paginationQuery,
};
