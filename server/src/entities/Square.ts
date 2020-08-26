import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import Gathering from './Gathering';
import Towner from './Towner';

@Entity()
export default class Square {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Towner, (towner) => towner.square)
  towners: Towner[];

  @OneToMany((type) => Gathering, (gathering) => gathering.square)
  gatherings: Gathering[];

  @Column({
    type: 'text',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  domain: string;
}
