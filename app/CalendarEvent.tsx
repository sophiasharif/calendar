import styles from "./CalendarEvent.module.css";
import { Event } from "@/utils/types";
import { useDrag } from "react-dnd";

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

  const style = {
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
