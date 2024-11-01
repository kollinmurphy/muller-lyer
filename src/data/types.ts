export interface UserData {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  email: string;
  collectedData: boolean;
  percentCorrect?: number;
}

export type LineConfiguration = 'brentano' | 'offset' | 'vertical';

export type LineVariant = 'arrowhead' | 'circle' | 'square' | 'obliques' | 'circle-obliques';

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
