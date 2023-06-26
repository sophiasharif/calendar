"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TimeColumn from "./TimeColumn";
import CalendarEvent from "./CalendarEvent";
import styles from "./DayView.module.css";
import { Event } from "@/utils/types";
import { HOUR_HEIGHT } from "@/utils/globals";

interface DayViewProps {
  events: Event[];
  startTime: number;
  endTime: number;
}

export default function DayView({ events, startTime, endTime }: DayViewProps) {
  const numRows = endTime - startTime;
  const rows = new Array(numRows).fill(0); // array to render grid styling
  const gridStyling = {
    gridTemplateRows: `repeat(${numRows}, ${HOUR_HEIGHT}px)`,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.calendarView}>
        <TimeColumn startTime={startTime} endTime={endTime} />
        <div className={styles.calendarColumn} style={gridStyling}>
          {rows.map((_, index) => (
            <div className={styles.gridCell} key={index}></div>
          ))}
          {events.map((event) => (
            <CalendarEvent
              event={event}
              startTime={startTime}
              endTime={endTime}
              key={event.id}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
