import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Gathering from './Gathering';
import Towner from './Towner';

@Entity()
export default class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => Towner, (towner) => towner.participant)
  @JoinColumn()
  towner: Towner;

  @ManyToOne((type) => Gathering, (gathering) => gathering.participants)
  gathering: Gathering;

  @Column({
    type: 'boolean',
    default: false,
  })
  isModerator: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isSpeaking: boolean;
}
