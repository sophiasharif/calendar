import styles from "./CalendarEvent.module.css";
import { Event } from "@/utils/types";

interface CalendarColumnProps {
  event: Event;
}

export default function CalendarEvent({ event }: CalendarColumnProps) {
  const style = {
    top: `${(event.rowStart / 10) * 100}%`,
    height: `${((event.rowEnd - event.rowStart) / 10) * 100}%`,
    width: "100%",
  };

  return (
    <div className={styles.calendarEvent} style={style}>
      <h1>{event.title}</h1>
      <p>Event Description</p>
    </div>
  );
}
