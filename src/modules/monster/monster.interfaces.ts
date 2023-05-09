import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IMonster {
  name: {
    first: string;
    last: string;
    title: string;
  };
  gender: string;
  description: string;
  nationality: string[];
  image: string;
  goldBalance: number;
  speed: number;
  health: number;
  secretNotes: string;
  monsterPassword: string;
  likes: any;
  author: any;
}

export interface IMonsterDoc extends IMonster, Document {}

export interface IMonsterModel extends Model<IMonsterDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateMonsterBody = Partial<IMonster>;

export type NewMonster = Omit<IMonster, 'likes'>;

// Monster Likes
export interface IMonsterLikes {
  user: any;
  monster: any;
  liked: boolean;
}

export interface IMonsterLikesDoc extends IMonsterLikes, Document {}

export interface IMonsterLikesModel extends Model<IMonsterLikesDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
