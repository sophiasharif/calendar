"use client";
import React, { useState, useEffect } from "react";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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

interface CalendarEventProps {
  event: Event;
  startTime: number;
  endTime: number;
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

function CurrentTimeIndicator({ startTime, endTime }: TimeColumnProps) {
  const [timePosition, setTimePosition] = useState(0);

  const updateTimePosition = () => {
    const now = new Date();
    if (now.getHours() < startTime || now.getHours() > endTime) {
      return 0;
    }

    const hoursPassed = now.getHours() + now.getMinutes() / 60 - startTime;
    const timePosition = (hoursPassed / (endTime - startTime)) * 100;
    setTimePosition(timePosition);
  };

  useEffect(() => {
    updateTimePosition(); // Call it immediately
    const interval = setInterval(updateTimePosition, 60000); // Then every minute
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return (
    <div
      style={{
        opacity: timePosition === 0 ? 0 : 1,
        position: "absolute",
        top: `${timePosition}%`,
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "red",
      }}
    />
  );
}

function CalendarEvent({ event, startTime, endTime }: CalendarEventProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "event",
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const eventStartHour =
    event.startTime.getHours() + event.startTime.getMinutes() / 60;
  const eventEndHour =
    event.endTime.getHours() + event.endTime.getMinutes() / 60;
  const topOffset =
    ((eventStartHour - startTime) / (endTime - startTime)) * 100;
  const length =
    ((eventEndHour - eventStartHour) / (endTime - startTime)) * 100;

  const style: React.CSSProperties = {
    top: `${topOffset}%`,
    height: `${length}%`,
    border: isDragging ? "3px solid white" : "0px",
    pointerEvents: isDragging ? "none" : "auto",
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div className={styles.calendarEvent} style={style} ref={drag}>
      <h1>{event.title}</h1>
      <h5>
        {eventStartHour} - {eventEndHour}
      </h5>
      <p>Event Description</p>
    </div>
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
      <CurrentTimeIndicator startTime={startTime} endTime={endTime} />
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
  function getTimeLabel(hour: number) {
    if (hour === 12) return "12 PM";
    else if (hour < 12) return `${hour} AM`;
    else return `${hour - 12} PM`;
  }
  return (
    <div className={styles.timeColumn} style={gridStyling}>
      {times.map((hour) => (
        <div key={hour}>{getTimeLabel(hour)}</div>
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

    toUpdate.startTime.setHours(newStartHour);
    toUpdate.startTime.setMinutes((newStartHour % 1) * 60);
    toUpdate.endTime.setHours(newStartHour + eventLength);
    toUpdate.endTime.setMinutes((newEndHour % 1) * 60);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>
        <div className={styles.calendarView}>
          <TimeColumn startTime={startTime} endTime={endTime} />
          <CalendarColumn
            events={events}
            startTime={startTime}
            endTime={endTime}
            moveEvent={moveEvent}
          />
        </div>
      </div>
    </DndProvider>
  );
}
