import { v4 as uuid } from 'uuid';

import connectionPromise from './createConnection';
import Participant from './entities/Participant';
import Square from './entities/Square';
import Towner from './entities/Towner';
import User from './entities/User';

const NAMES = [
  'John Doe',
  'Will Smith',
  'Harrison Ford',
  'Mark Hamil',
  'Teletha Testarossa',
  'Shinji Ikari',
  'Ayako Kawasumi',
  'Jane Zhang',
  'Roger Mile',
  'Louise Clark',
  'Janie Rodgers',
  'Doris Lawson',
];

const SQUARE_DOMAIN = 'stanford';
const SQUARE_NAME = 'Stanford University';
const USER_EMAIL = 'jcx@stanford.edu';
const TOWNER_NAME = 'Raven Jiang';

(async () => {
  const connection = await connectionPromise;
  const entityManager = connection.manager;

  let square = await entityManager.findOne(Square, { domain: SQUARE_DOMAIN });
  if (!square) {
    square = entityManager.create(Square, {
      domain: SQUARE_DOMAIN,
      name: SQUARE_NAME,
    });
    await entityManager.save(square);
  }
  console.log(square);

  let user = await entityManager.findOne(User, { email: USER_EMAIL });
  if (!user) {
    user = entityManager.create(User, {
      email: USER_EMAIL,
      firebaseId: uuid().toString(),
    });
    await entityManager.save(user);
  }
  console.log(user);

  let towner = await entityManager.findOne(Towner, { user });
  if (!towner) {
    towner = entityManager.create(Towner, {
      name: TOWNER_NAME,
      isVisitor: false,
      isOnline: false,
      statusText: '',
      user,
      square,
    });
    await entityManager.save(towner);
  }
  console.log(towner);

  let participant = await entityManager.findOne(Participant, { towner });
  if (!participant) {
    participant = entityManager.create(Participant, {
      isModerator: false,
      isSpeaking: false,
      towner,
    });
    await entityManager.save(participant);
  }

  const promises = NAMES.map(async (name) => {
    const email = `${name.replace(' ', '.').toLocaleLowerCase()}@stanford.edu`;
    let u = await entityManager.findOne(User, { email });
    if (!u) {
      u = entityManager.create(User, {
        email,
        firebaseId: uuid().toString(),
      });
      await entityManager.save(u);
    }
    console.log(u);

    let t = await entityManager.findOne(Towner, { user: u });
    if (!t) {
      t = entityManager.create(Towner, {
        name,
        isVisitor: false,
        isOnline: false,
        statusText: '',
        user: u,
        square,
      });
      await entityManager.save(t);
    }
    console.log(t);

    let p = await entityManager.findOne(Participant, { towner: t });
    if (!p) {
      p = entityManager.create(Participant, {
        isModerator: false,
        isSpeaking: false,
        towner: t,
      });
      await entityManager.save(p);
    }
  });

  await promises;
})();
