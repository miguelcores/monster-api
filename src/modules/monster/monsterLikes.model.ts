import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IMonsterLikesDoc, IMonsterLikesModel } from './monster.interfaces';

const monsterLikesSchema = new mongoose.Schema<IMonsterLikesDoc, IMonsterLikesModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    monster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monster',
    },
    liked: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
monsterLikesSchema.plugin(toJSON);
monsterLikesSchema.plugin(paginate);

const monsterLikes = mongoose.model<IMonsterLikesDoc, IMonsterLikesModel>('MonsterLikes', monsterLikesSchema);

export default monsterLikes;
