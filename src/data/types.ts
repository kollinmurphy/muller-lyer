export interface UserData {
  userId: string;
  userName: string;
  email: string;
  age: number;
  eyeColor: string;
  collectedData: boolean;
  percentCorrect?: number;
  gender?: Gender;
}

export type EyeColor = 'blue' | 'brown' | 'green' | 'hazel' | 'amber' | 'gray' | 'other';

export type LineConfiguration = 'brentano' | 'offset' | 'vertical';

export type LineVariant = 'baseline' | 'arrowhead' | 'circle' | 'square' | 'obliques';

export type Gender = 'male' | 'female' | '-';

export interface TrialData {
  configuration: LineConfiguration;
  variant: LineVariant;
  leftLength: number;
  rightLength: number;
  response?:
    | 'left-definitely-longer'
    | 'left-slightly-longer'
    | 'same-length'
    | 'right-slightly-longer'
    | 'right-definitely-longer';
  responseTimeMs?: number;
}

export interface State {
  data: TrialData[];
}

export interface CollectedTrial {
  configuration: LineConfiguration;
  variant: LineVariant;
  leftLength: number;
  rightLength: number;
  response: NonNullable<TrialData['response']>;
  responseTimeMs: number;
}

export interface CollectionResult {
  correct: number;
  iterations: number;
  trials: CollectedTrial[];
  userId: string;
  startTime: number;
  endTime: number;
  exposureDelayMs: number;
  exposureDurationMs: number;
}
