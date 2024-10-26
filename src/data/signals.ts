import type { User } from 'firebase/auth';
import { createEffect, createSignal } from 'solid-js';
import type { UserData } from './types';

export const userSignal = createSignal<User | null>(null);
export const userDataSignal = createSignal<UserData | null>(null);
