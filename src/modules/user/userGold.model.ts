import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IUserGoldDoc, IUserGoldModel } from './user.interfaces';

const userGoldSchema = new mongoose.Schema<IUserGoldDoc, IUserGoldModel>(
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
    gold: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userGoldSchema.plugin(toJSON);
userGoldSchema.plugin(paginate);

const userGold = mongoose.model<IUserGoldDoc, IUserGoldModel>('UserGold', userGoldSchema);

export default userGold;
