import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { monsterController, monsterValidation } from '../../modules/monster';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('createMonster'), validate(monsterValidation.createMonster), monsterController.createMonster)
  .get(validate(monsterValidation.getMonsters), monsterController.getMonsters);

router
  .route('/:monsterId')
  .get(validate(monsterValidation.getMonster), monsterController.getMonster)
  .put(auth('manageMonsters'), validate(monsterValidation.updateMonster), monsterController.updateMonster)
  .patch(auth('getMonsterGold'), validate(monsterValidation.getMonsterGold), monsterController.getMonsterGold)
  .delete(auth('manageMonsters'), validate(monsterValidation.deleteMonster), monsterController.deleteMonster);

router
  .route('/:monsterId/like')
  .put(auth(), validate(monsterValidation.upsertMonsterLike), monsterController.upsertMonsterLike)
  .get(auth(), monsterController.getMonstersLikes);

export default router;

/**
 * @swagger
 * tags:
 *   name: Monsters
 *   description: Monsters management and retrieval
 */

/**
 * @swagger
 * /monsters:
 *   post:
 *     summary: Create a monster
 *     description: Only logged users can create monsters.
 *     tags: [Monsters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name.first
 *               - name.last
 *               - name.title
 *               - description
 *               - nationality
 *               - image
 *               - speed
 *               - health
 *               - monsterPassword
 *             properties:
 *               name:
 *                 first:
 *                  type: string
 *                 last:
 *                  type: string
 *                 title:
 *                  type: string
 *               gender:
 *                 type: string
 *               description:
 *                 type: string
 *               nationality:
 *                 type: string
 *               image:
 *                 type: string
 *               goldBalance:
 *                 type: number
 *               speed:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1000000
 *               health:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1000000
 *               secretNotes:
 *                 type: string
 *               monsterPassword:
 *                 type: string
 *             example:
 *                 name:
 *                   first: Janfri
 *                   last: Man
 *                   title: Mr
 *                 gender: male
 *                 description: A monster joker. It can turn into anything
 *                 nationality: [Sp, Pe]
 *                 image: https://elcomercio.pe/resizer/GgErUGeR6EMo5ppM5c1i8CP12fk=/580x330/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/UMECXA4G3FHGZHYGLX434LBJOI.jpg
 *                 speed: 100
 *                 health: 100
 *                 secretNotes: It's really from Peru
 *                 monsterPassword: Papalauancaina123
 *     responses:
 *       "200":
 *         description: OK
 *
 *   get:
 *     summary: Get all monsters
 *     description: Everyone can see monsters.
 *     tags: [Monsters]
 *     parameters:
 *       - in: query
 *         name: name.first
 *         schema:
 *           type: string
 *         description: Monster Name
 *       - in: query
 *         name: name.last
 *         schema:
 *           type: string
 *         description: Monster Surname
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: projectBy
 *         schema:
 *           type: string
 *         description: project by query in the form of field:hide/include (ex. name:hide)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of monsters
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /monsters/{id}:
 *   get:
 *     summary: Get a monster
 *     description: Everyone can get a monster.
 *     tags: [Monsters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Monster id
 *     responses:
 *       "200":
 *         description: OK
 *
 *   put:
 *     summary: Update a Monster
 *     description: Only superAdmins like Carlos Roldan can update monsters (e.g., add gold).
 *     tags: [Monsters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Monster id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goldBalance:
 *                 type: number
 *             example:
 *               goldBalance: 100
 *     responses:
 *       "200":
 *         description: OK
 *
 *   patch:
 *     summary: Get Monster Gold
 *     description: Certain logged in users can get monsters' gold.
 *     tags: [Monsters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Monster id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goldGetAmount:
 *                 type: number
 *             example:
 *               goldGetAmount: 100
 *     responses:
 *       "200":
 *         description: OK
 *
 *   delete:
 *     summary: Delete a monster
 *     description: Logged in users can delete only their own monsters. Only admins can delete other user's monsters.
 *     tags: [Monsters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Monster id
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /monsters/{id}/like:
 *   put:
 *     summary: Like a Monster
 *     description: Logged in users can like a monster.
 *     tags: [Monsters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Monster id
 *     responses:
 *       "200":
 *         description: OK
 *
 *   get:
 *     summary: Get monsters sorted by number of likes
 *     description: Only logged in users can get monsters by number of likes.
 *     tags: [Monsters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
