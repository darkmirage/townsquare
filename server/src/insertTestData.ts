import { Square, User, Towner } from './sequelize';
import { v4 as uuid } from 'uuid';

const names = [
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

(async () => {
  const [square] = await Square.findOrCreate({
    where: {
      domain: 'stanford',
    },
    defaults: {
      name: 'Stanford University',
    },
  });

  const [u1] = await User.findOrCreate({
    where: {
      email: 'jcx@stanford.edu',
    },
    defaults: {
      firebaseId: 'placeholder id',
    },
  });

  const [t1] = await Towner.findOrCreate({
    where: {
      name: 'Raven Jiang',
    },
    defaults: {
      squareId: (square as any).id,
      userId: (u1 as any).id,
    },
  });

  const promises = names.map(async (name) => {
    const [user] = await User.findOrCreate({
      where: {
        email: `${name.replace(' ', '.').toLocaleLowerCase()}@stanford.edu`
      },
      defaults: {
        firebaseId: uuid().toString(),
      }
    });
    await Towner.findOrCreate({
      where: {
        name,
      },
      defaults: {
        squareId: (square as any).id,
        userId: (user as any).id,
      },
    })
  });

  await Promise.all(promises);
})();
