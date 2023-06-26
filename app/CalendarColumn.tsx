import styles from "./CalendarColumn.module.css";
import CalendarEvent from "./CalendarEvent";
import { Event } from "@/utils/types";

interface CalendarColumnProps {
  events: Event[];
}

export default function CalendarColumn({ events }: CalendarColumnProps) {
  const rows = new Array(10).fill(0); // array to render grid styling
  return (
    <div className={styles.calendarColumn}>
      {rows.map((_, index) => (
        <div className={styles.gridCell} key={index}></div>
      ))}
      {events.map((event) => (
        <CalendarEvent event={event} key={event.id} />
      ))}
    </div>
  );
}
