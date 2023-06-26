import styles from "./CalendarColumn.module.css";
import CalendarEvent from "./CalendarEvent";
import { Event } from "@/utils/types";

interface CalendarColumnProps {
  events: Event[];
  startTime: number;
  endTime: number;
}

export default function CalendarColumn({
  events,
  startTime,
  endTime,
}: CalendarColumnProps) {
  const numRows = endTime - startTime;
  const rows = new Array(numRows).fill(0); // array to render grid styling
  const gridStyling = {
    gridTemplateRows: `repeat(${numRows}, 80px)`,
  };
  return (
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
  );
}
