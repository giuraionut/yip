
import { DayMood, Mood } from '@prisma/client';

export interface IDay {
    title: string;
    index: number;
    currentDay?: boolean;
    mood?: Mood;
}
export interface MyDayMood extends DayMood {
    mood: Mood;
}

export interface IMonth {
    title: string;
    icon: JSX.Element; // Updated 'icon' type to JSX.Element
    color: string;
    index: number;
    currentMonth?: boolean;
}