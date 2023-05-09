import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Monster from './monster.model';
import UserGold from '../user/userGold.model';
import MonsterLikes from './monsterLikes.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewMonster, UpdateMonsterBody, IMonsterDoc, IMonsterLikesDoc } from './monster.interfaces';

/**
 * Create a Monster
 * @param {NewMonster} monsterBody
 * @returns {Promise<IMonsterDoc>}
 */
export const createMonster = async (monsterBody: NewMonster): Promise<IMonsterDoc> => {
  return Monster.create(monsterBody);
};

/**
 * Query for Monsters
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryMonsters = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const Monsters = await Monster.paginate(filter, options);
  return Monsters;
};

/**
 * Get Monster by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IMonsterDoc | null>}
 */
export const getMonsterById = async (id: mongoose.Types.ObjectId): Promise<IMonsterDoc | null> => Monster.findById(id);

/**
 * Get Monster by id and author if provided, otherwise return monster by id
 * @param {mongoose.Types.ObjectId} id
 * @param {mongoose.Types.ObjectId | null} authorId - If authorId is null, then the Monster will be returned regardless of author
 * @returns {Promise<IMonsterDoc | null>}
 */
export const getMonster = async (
  id: mongoose.Types.ObjectId,
  authorId: mongoose.Types.ObjectId | null = null
): Promise<IMonsterDoc | null> => {
  if (authorId) {
    return Monster.findOne({ _id: id, author: authorId });
  }
  return getMonsterById(id);
};

/**
 * Update Monster by id
 * @param {mongoose.Types.ObjectId} monsterId
 * @param {mongoose.Types.ObjectId | null } authorId - If authorId is null, then the Monster will be updated regardless of author
 * @param {UpdateMonsterBody} updateBody
 * @returns {Promise<IMonsterDoc | null>}
 */
export const updateMonsterById = async (
  monsterId: mongoose.Types.ObjectId,
  updateBody: UpdateMonsterBody,
  authorId: mongoose.Types.ObjectId | null = null
): Promise<IMonsterDoc | null> => {
  const monster = await getMonster(monsterId, authorId);
  if (!monster) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Monster not found');
  }
  Object.assign(monster, updateBody);
  await monster.save();
  return monster;
};

/**
 * Update Monster by id
 * @param {mongoose.Types.ObjectId} monsterId
 * @param {mongoose.Types.ObjectId } userId
 * @param {number} goldGetAmount
 * @returns {Promise<IMonsterDoc | null>}
 */
export const getMonsterGold = async (
  monsterId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  goldGetAmount: number
): Promise<IMonsterDoc | null> => {
  const monster = await getMonsterById(monsterId);
  if (!monster) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Monster not found');
  }
  if (monster.goldBalance < goldGetAmount) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Monster does not have enough gold to retire');
  }
  monster.goldBalance -= goldGetAmount;
  await monster.save();
  const goldAddAmount = goldGetAmount;
  const userGold = await UserGold.create({ monster: monsterId, user: userId, gold: goldAddAmount });
  await userGold.save();
  return monster;
};

/**
 * Delete Monster by id
 * @param {mongoose.Types.ObjectId} monsterId
 * @param {mongoose.Types.ObjectId | null } authorId - If authorId is null, then the Monster will be deleted regardless of author
 * @returns {Promise<IMonsterDoc | null>}
 */
export const deleteMonsterById = async (
  monsterId: mongoose.Types.ObjectId,
  authorId: mongoose.Types.ObjectId | null = null
): Promise<IMonsterDoc | null> => {
  const monster = await getMonster(monsterId, authorId);
  if (!monster) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Monster not found');
  }
  await monster.remove();
  return monster;
};

/**
 * Upsert a MonsterLike for a Monster and User, defaulting liked to true
 * @param {mongoose.Types.ObjectId} monsterId
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IMonsterLikesDoc | null>}
 */
export const upsertMonsterLike = async (
  monsterId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<IMonsterLikesDoc | null> => {
  let monsterLike = await MonsterLikes.findOne({ monster: monsterId, user: userId });
  if (!monsterLike) {
    monsterLike = await MonsterLikes.create({ monster: monsterId, user: userId, liked: true });
  } else {
    monsterLike.liked = !monsterLike.liked;
    await monsterLike.save();
  }
  return monsterLike;
};

export const getMonstersLikes = async (): Promise<any> => {
  const monstersLikes = await Monster.find().populate('likes');

  const monstersLikesSorted = monstersLikes.sort((a, b) => b.likes - a.likes);

  return monstersLikesSorted;
};
