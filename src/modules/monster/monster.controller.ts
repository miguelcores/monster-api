import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as monsterService from './monster.service';

export const createMonster = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.author || req.user.role !== 'superAdmin') {
    req.body.author = req.user.id;
  }
  const monster = await monsterService.createMonster(req.body);
  res.status(httpStatus.CREATED).send(monster);
});

export const getMonsters = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name.first', 'name.last']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await monsterService.queryMonsters(filter, options);
  res.send(result);
});

export const getMonster = catchAsync(async (req: Request, res: Response) => {
  const monsterId = new mongoose.Types.ObjectId(req.params.monsterId);
  const monster = await monsterService.getMonsterById(monsterId);
  if (!monster) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Monster not found');
  }
  res.send(monster);
});

export const updateMonster = catchAsync(async (req: Request, res: Response) => {
  const monsterId = new mongoose.Types.ObjectId(req.params.monsterId);
  const authorId = req.user.role !== 'superAdmin' ? new mongoose.Types.ObjectId(req.user.id) : null;
  const monster = await monsterService.updateMonsterById(monsterId, req.body, authorId);
  res.send(monster);
});

export const getMonsterGold = catchAsync(async (req: Request, res: Response) => {
  const monsterId = new mongoose.Types.ObjectId(req.params.monsterId);
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const { goldGetAmount } = req.body;
  const monster = await monsterService.getMonsterGold(monsterId, userId, goldGetAmount);
  res.send(monster);
});

export const deleteMonster = catchAsync(async (req: Request, res: Response) => {
  const monsterId = new mongoose.Types.ObjectId(req.params.monsterId);
  const authorId = req.user.role !== 'superAdmin' ? new mongoose.Types.ObjectId(req.user.id) : null;
  await monsterService.deleteMonsterById(monsterId, authorId);
  res.status(httpStatus.NO_CONTENT).send();
});

export const upsertMonsterLike = catchAsync(async (req: Request, res: Response) => {
  const monsterId = new mongoose.Types.ObjectId(req.params.monsterId);
  const authorId = new mongoose.Types.ObjectId(req.user.id);
  const monsterLike = await monsterService.upsertMonsterLike(monsterId, authorId);
  res.send(monsterLike);
});

export const getMonstersLikes = catchAsync(async (req: Request, res: Response) => {
  const result = await monsterService.getMonstersLikes();
  res.send(result);
});
