
import { DayEvent, DayMood, Event, Mood } from '@prisma/client';

export interface IDay {
    title: string;
    index: number;
    currentDay?: boolean;
    mood?: Mood;
    event?: Event;
}
export interface MyDayMood extends DayMood {
    mood: Mood;
}
export interface MyDayEvent extends DayEvent {
    event: Event
}
export interface IMonth {
    title: string;
    icon: string; 
    color: string;
    index: number;
    currentMonth?: boolean;
}
