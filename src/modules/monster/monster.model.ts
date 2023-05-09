import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IMonsterDoc, IMonsterModel } from './monster.interfaces';

const monsterSchema = new mongoose.Schema<IMonsterDoc, IMonsterModel>(
  {
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
      title: { type: String, required: true },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    description: { type: String, required: true },
    nationality: [{ type: String, required: true }],
    image: { type: String, required: true },
    goldBalance: { type: Number, default: 0 },
    speed: { type: Number, required: true },
    health: { type: Number, required: true },
    secretNotes: { type: String },
    monsterPassword: { type: String, required: true },
    author: {
      // author is the user who created the monster in our system
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

monsterSchema.virtual('likes', {
  ref: 'MonsterLikes',
  localField: '_id',
  foreignField: 'monster',
  count: true, // only get the number of docs
  match: { liked: true }, // only get docs that liked: true
});

monsterSchema.pre(['findOne', 'find'], function () {
  this.populate('likes');
});

// add plugin that converts mongoose to json
monsterSchema.plugin(toJSON);
monsterSchema.plugin(paginate);
monsterSchema.plugin(autopopulate);

const monster = mongoose.model<IMonsterDoc, IMonsterModel>('Monster', monsterSchema);

export default monster;
