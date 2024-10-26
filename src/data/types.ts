export type Cohort = 'brentano';

export interface UserData {
  id: string;
  userId: string;
  userName: string;
  cohort: Cohort;
  lastCollectionDateTime: number;
}

export interface CollectionSession {
  userId: string;
  collectionId: string;
  collectionDateTime: number;
}

export interface BrentanoData {
  exposure: 'prolonged' | 'momentary';
  abLength: number;
  bcLength: number;
  response?: 'bc-definitely-shorter' | 'bc-slightly-shorter' | 'same-length' | 'bc-slightly-longer' | 'bc-definitely-longer';
  showAt: number;
  hideAt: number;
  responseTime?: number;
  illusionMm?: number;
}

export interface State {
  currentIteration: number;
  data: BrentanoData[];
}

export interface CollectionResult<T> {
  correct: number;
  iterations: number;
  data: T[];
}
