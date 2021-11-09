import { Action } from './enums';

export type PrimitiveValue = number | string | boolean;

export type Options = {
  maxUndo?: number;
};

export type DataCoordinate = {
  index: number;
  accessor: string;
};
export type Command = {
  coordinate: DataCoordinate;
  action: Action;
  value: PrimitiveValue | null;
  reverse: PrimitiveValue | null;
};
