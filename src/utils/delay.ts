import { trialConfiguration } from './constants';

export const getNextTrialDelay = () => Math.round(trialConfiguration.trialDelayMinMs + Math.random() * trialConfiguration.trialDelayRandomMs);
