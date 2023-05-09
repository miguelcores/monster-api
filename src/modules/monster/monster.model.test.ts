import mongoose from 'mongoose';
import { NewMonster } from './monster.interfaces';
import Monster from './monster.model';

const userOneId = new mongoose.Types.ObjectId();
describe('Monster model', () => {
  describe('Monster validation', () => {
    let newMonster: NewMonster;

    beforeAll(async () => {});

    beforeEach(() => {
      newMonster = {
        name: {
          first: 'Janfri',
          last: 'Man',
          title: 'Mr',
        },
        gender: 'male',
        description: 'A monster joker. It can turn into anything',
        nationality: ['Sp'],
        image:
          'https://elcomercio.pe/resizer/GgErUGeR6EMo5ppM5c1i8CP12fk=/580x330/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/UMECXA4G3FHGZHYGLX434LBJOI.jpg',
        goldBalance: 1,
        speed: 100,
        health: 100,
        secretNotes: "It's really from Peru",
        monsterPassword: 'Papalauancaina123',
        author: userOneId,
      };
    });

    test('should correctly validate a valid monster', async () => {
      await expect(new Monster(newMonster).validate()).resolves.toBeUndefined();
    });
  });
});
