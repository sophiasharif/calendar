import CalendarColumn from "./CalendarColumn";
import styles from "./page.module.css";
import { Event } from "@/utils/types";

const events: Event[] = [
  {
    id: 0,
    rowStart: 1,
    rowEnd: 4,
    title: "My first Event!",
  },
  {
    id: 1,
    rowStart: 6,
    rowEnd: 8,
    title: "My second Event!",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <CalendarColumn events={events} />
    </main>
  );
}
