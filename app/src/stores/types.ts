export type SquareID = string;
export type TownerID = string;

export type Towner = {
  id: TownerID;
  displayName: string;
};

export type Participant = {
  townerId: TownerID;
  role: 'regular' | 'moderator';
  audioOn: boolean;
  speaking: boolean;
};

export type Gathering = {
  participants: Participant[];
};

export type Square = {
  name: string;
  towners: TownerID[];
  gatherings: Gathering[];
};
