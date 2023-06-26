import { HOUR_HEIGHT } from "@/utils/globals";
import styles from "./TimeColumn.module.css";

interface TimeColumnProps {
  startTime: number;
  endTime: number;
}

function getDisplayTime(hour: number) {
  return hour < 12 ? `${hour} AM` : `${hour} PM`;
}

export default function TimeColumn({ startTime, endTime }: TimeColumnProps) {
  const numRows = endTime - startTime - 1;
  const times = [];
  for (let hour = startTime; hour < endTime - 1; hour++, times.push(hour)); // populate times
  const gridStyling = {
    gridTemplateRows: `repeat(${numRows}, ${HOUR_HEIGHT}px)`,
  };
  return (
    <div className={styles.timeColumn} style={gridStyling}>
      {times.map((hour) => (
        <div>{getDisplayTime(hour)}</div>
      ))}
    </div>
  );
}
