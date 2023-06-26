import CalendarColumn from "./CalendarColumn";
import styles from "./page.module.css";
import { Event } from "@/utils/types";

const events: Event[] = [
  {
    id: 0,
    startTime: new Date(2023, 5, 25, 10),
    endTime: new Date(2023, 5, 25, 12),
    rowStart: 1,
    rowEnd: 4,
    title: "My first Event!",
  },
  {
    id: 1,
    startTime: new Date(2023, 5, 25, 15),
    endTime: new Date(2023, 5, 25, 16, 45),
    rowStart: 6,
    rowEnd: 8,
    title: "My second Event!",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <CalendarColumn events={events} startTime={9} endTime={19} />
    </main>
  );
}
