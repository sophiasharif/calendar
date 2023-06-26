"use client";
import React, { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CalendarEvent from "./CalendarEvent";
import styles from "./DayView.module.css";
import { Event } from "@/utils/types";
import { HOUR_HEIGHT } from "@/utils/globals";

interface DayViewProps {
  events: Event[];
  startTime: number;
  endTime: number;
}

interface TimeColumnProps {
  startTime: number;
  endTime: number;
}

interface CalendarColumnProps {
  events: Event[];
  startTime: number;
  endTime: number;
  moveEvent: (id: number, newStartHour: number) => void;
}

interface GridCellProps {
  id: number;
  startTime: number;
  endTime: number;
  moveEvent: (id: number, newStartHour: number) => void;
}

function GridCell({ id, startTime, endTime, moveEvent }: GridCellProps) {
  // update event position
  function updateEvent(
    eventID: number,
    cellID: number,
    startTime: number,
    endTime: number
  ) {
    console.log(eventID);
    moveEvent(eventID, startTime + cellID);
  }

  // drag and drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "event",
    drop: (item: { id: number }) =>
      updateEvent(item.id, id, startTime, endTime),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  return (
    <div
      ref={drop}
      className={styles.gridCell}
      style={{ borderTop: isOver ? "3px solid white" : "0px" }}
    ></div>
  );
}

function CalendarColumn({
  events,
  startTime,
  endTime,
  moveEvent,
}: CalendarColumnProps) {
  // array to hour grid lines
  const numRows = endTime - startTime;
  const rows = new Array(numRows).fill(0);
  const gridStyling = {
    gridTemplateRows: `repeat(${numRows}, ${HOUR_HEIGHT}px)`,
  };

  return (
    <div className={styles.calendarColumn} style={gridStyling}>
      {rows.map((_, index) => (
        <GridCell
          id={index}
          startTime={startTime}
          endTime={endTime}
          moveEvent={moveEvent}
          key={index}
        />
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
  );
}

function TimeColumn({ startTime, endTime }: TimeColumnProps) {
  const numRows = endTime - startTime - 1;
  const times = [];
  for (let hour = startTime; hour < endTime - 1; hour++, times.push(hour)); // populate times
  const gridStyling = {
    gridTemplateRows: `repeat(${numRows}, ${HOUR_HEIGHT}px)`,
  };
  return (
    <div className={styles.timeColumn} style={gridStyling}>
      {times.map((hour) => (
        <div key={hour}>{hour < 12 ? `${hour} AM` : `${hour} PM`}</div>
      ))}
    </div>
  );
}

export default function DayView({ events, startTime, endTime }: DayViewProps) {
  function moveEvent(id: number, newStartHour: number) {
    let toUpdate = events.filter((event) => event.id === id)[0];
    const timeOffset = newStartHour - toUpdate.startTime.getHours();
    toUpdate.startTime.setHours(newStartHour);
    toUpdate.endTime.setHours(timeOffset + toUpdate.endTime.getHours());
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.calendarView}>
        <TimeColumn startTime={startTime} endTime={endTime} />
        <CalendarColumn
          events={events}
          startTime={startTime}
          endTime={endTime}
          moveEvent={moveEvent}
        />
      </div>
    </DndProvider>
  );
}
