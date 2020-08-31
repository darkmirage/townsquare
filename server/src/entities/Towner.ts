import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import Participant from './Participant';
import Square from './Square';
import User from './User';

@Entity()
export default class Towner {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Square, (square) => square.towners)
  square: Square;

  @ManyToOne((type) => User, (user) => user.towners)
  user: User;

  @OneToOne((type) => Participant, (participant) => participant.towner)
  participant: Participant;

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
  })
  statusText: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVisitor: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isOnline: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isAway: boolean;

  @Column({
    type: 'timestamp',
    default: 'NOW()',
  })
  lastActive: Date;
}
