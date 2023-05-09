import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewMonster } from './monster.interfaces';

const createMonsterBody: Record<keyof NewMonster, any> = {
  name: {
    first: Joi.string().required().max(50),
    last: Joi.string().required().max(50),
    title: Joi.string().required().max(10),
  },
  gender: Joi.string().max(10),
  description: Joi.string().required().min(10).max(100),
  nationality: Joi.array().items(Joi.string().required().max(50)).min(1).max(9),
  image: Joi.string().required().max(250),
  goldBalance: Joi.number().min(0).max(1000000),
  speed: Joi.number().required().min(0).max(1000000),
  health: Joi.number().required().min(0).max(1000000),
  secretNotes: Joi.string().min(1).max(100),
  monsterPassword: Joi.string().required().min(5).max(51),
  author: Joi.string().custom(objectId),
};

export const createMonster = {
  body: Joi.object().keys(createMonsterBody),
};

export const getMonsters = {
  query: Joi.object().keys({
    name: {
      first: Joi.string(),
      last: Joi.string(),
    },
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getMonstersFeed = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    user: Joi.string().custom(objectId),
  }),
};

export const getMonster = {
  params: Joi.object().keys({
    monsterId: Joi.string().custom(objectId),
  }),
};

export const updateMonster = {
  params: Joi.object().keys({
    monsterId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: {
        first: Joi.string().max(50),
        last: Joi.string().max(50),
        title: Joi.string().max(10),
      },
      gender: Joi.string().max(10),
      description: Joi.string().min(10).max(100),
      nationality: Joi.array().items(Joi.string().max(50)).min(1).max(9),
      image: Joi.string().max(250),
      goldBalance: Joi.number().min(0).max(1000000),
      speed: Joi.number().min(0).max(1000000),
      health: Joi.number().min(0).max(1000000),
      secretNotes: Joi.string().min(1).max(100),
      monsterPassword: Joi.string().min(5).max(51),
    })
    .min(1),
};

export const getMonsterGold = {
  params: Joi.object().keys({
    monsterId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      goldGetAmount: Joi.number().min(0).max(1000000),
    })
    .min(1),
};

export const deleteMonster = {
  params: Joi.object().keys({
    monsterId: Joi.string().custom(objectId),
  }),
};

export const upsertMonsterLike = {
  params: Joi.object().keys({
    monsterId: Joi.string().custom(objectId),
  }),
};
