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
    moveEvent(eventID, startTime + cellID / 4);
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
      className={id % 4 === 0 ? styles.gridCell : styles.gridCellNoLines}
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
  const rows = new Array(numRows * 4).fill(0);
  const gridStyling = {
    gridTemplateRows: `repeat(${numRows * 4}, ${HOUR_HEIGHT / 4}px)`,
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
    gridTemplateRows: `repeat(${numRows}, ${HOUR_HEIGHT + 3}px)`,
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
    const eventLength =
      toUpdate.endTime.getHours() +
      toUpdate.endTime.getMinutes() -
      toUpdate.startTime.getHours() -
      toUpdate.startTime.getMinutes();
    const newEndHour = newStartHour + eventLength;
    console.log(newEndHour);

    toUpdate.startTime.setHours(newStartHour);
    toUpdate.startTime.setMinutes((newStartHour % 1) * 60);
    toUpdate.endTime.setHours(newStartHour + eventLength);
    toUpdate.endTime.setMinutes((newEndHour % 1) * 60);
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
