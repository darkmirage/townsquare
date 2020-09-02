import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import Towner from './Towner';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Towner, (towner) => towner.user)
  towners: Towner[];

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  firebaseId: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  photoUrl: string;
}
