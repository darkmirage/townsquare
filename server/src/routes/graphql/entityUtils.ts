import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import Gathering from '../../entities/Gathering';
import Participant from '../../entities/Participant';
import Square from '../../entities/Square';
import Towner from '../../entities/Towner';

export async function setGathering(
  manager: EntityManager,
  participant: Participant,
  gathering: Gathering | null = null,
  isModerator: boolean = false
) {
  if (participant.gathering) {
    const g = participant.gathering;
    const { count } = await manager
      .getRepository(Gathering)
      .createQueryBuilder('gathering')
      .leftJoinAndSelect('gathering.participants', 'participant')
      .select('COUNT(participant.towner_id)', 'count')
      .where('gathering.id = :id', { id: g.id })
      .getRawOne();
    if (count <= 1 || participant.isModerator) {
      await manager.delete(Gathering, g);
    }
  }

  participant.isModerator = isModerator;
  participant.gathering = gathering;
  await manager.save(participant);
}

export async function getTownerForUser(
  manager: EntityManager,
  squareId: number,
  userId: number
) {
  return manager
    .getRepository(Towner)
    .createQueryBuilder('towner')
    .leftJoinAndSelect('towner.square', 'square')
    .leftJoinAndSelect('towner.participant', 'participant')
    .leftJoinAndSelect('participant.gathering', 'gathering')
    .where('towner.user_id = :userId', { userId })
    .andWhere('square.id = :squareId', { squareId })
    .getOne();
}

export async function joinGathering(
  manager: EntityManager,
  gatheringId: number,
  userId: number,
  leave: boolean = false
): Promise<boolean> {
  const gathering = await manager.findOne(Gathering, gatheringId, {
    relations: ['square'],
  });
  if (!gathering) {
    return false;
  }

  const towner = await getTownerForUser(manager, gathering.square.id, userId);
  if (!towner) {
    return false;
  }

  await setGathering(manager, towner.participant, leave ? null : gathering);
  return true;
}

export async function createGathering(
  manager: EntityManager,
  square: Square,
  description: string = ''
) {
  const gathering = manager.create(Gathering, {
    square: square,
    isInviteOnly: false,
    isResidentOnly: false,
    description,
    channel: uuid(),
  });

  await manager.save(gathering);
  return gathering;
}
