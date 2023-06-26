import styles from "./CalendarEvent.module.css";
import { Event } from "@/utils/types";

interface CalendarColumnProps {
  event: Event;
  startTime: number;
  endTime: number;
}

export default function CalendarEvent({
  event,
  startTime,
  endTime,
}: CalendarColumnProps) {
  const eventStartHour =
    event.startTime.getHours() + event.startTime.getMinutes() / 60;
  const eventEndHour =
    event.endTime.getHours() + event.endTime.getMinutes() / 60;
  const topOffset =
    ((eventStartHour - startTime) / (endTime - startTime)) * 100;
  const length =
    ((eventEndHour - eventStartHour) / (endTime - startTime)) * 100;

  const style = {
    top: `${topOffset}%`,
    height: `${length}%`,
  };

  return (
    <div className={styles.calendarEvent} style={style}>
      <h1>{event.title}</h1>
      <h5>
        {eventStartHour} - {eventEndHour}
      </h5>
      <p>Event Description</p>
    </div>
  );
}
