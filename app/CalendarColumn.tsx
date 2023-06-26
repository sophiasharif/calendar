import styles from "./CalendarColumn.module.css";
import CalendarEvent from "./CalendarEvent";
import { Event } from "@/utils/types";

interface CalendarColumnProps {
  events: Event[];
}

export default function CalendarColumn({ events }: CalendarColumnProps) {
  return (
    <div className={styles.calendarColumn}>
      {events.map((event) => (
        <CalendarEvent event={event} key={event.id} />
      ))}
    </div>
  );
}
