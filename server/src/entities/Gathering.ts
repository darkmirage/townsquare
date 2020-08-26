import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import Participant from './Participant';
import Square from './Square';

@Entity()
export default class Gathering {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Square, (square) => square.gatherings)
  square: Square;

  @OneToMany((type) => Gathering, (gathering) => gathering.parent)
  children: Gathering[];

  @ManyToOne((type) => Gathering, (gathering) => gathering.children)
  parent: Gathering;

  @OneToMany((type) => Participant, (participant) => participant.gathering)
  participants: Participant[];

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isInviteOnly: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  isResidentOnly: boolean;
}
