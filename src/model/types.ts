import { Project } from './project.js';

export type Listener<T> = (item: T[]) => void;
export type ElementPosition =
  | 'afterbegin'
  | 'afterend'
  | 'beforebegin'
  | 'beforeend';
export type orderType = 'min' | 'max' | 'equal';
export type extensibleObj = { [key: string]: any };
export type method = { [key: string]: Function };

export type LocalState = {
  type: string;
  projects: [string, Project][];
};
