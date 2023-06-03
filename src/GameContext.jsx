import moment from "moment/moment";
import { createContext, useEffect, useState } from "react";

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [lastRecordDate, setLastRecordDate] = useState("");

  useEffect(() => {
    const storedRecords = localStorage.getItem("records");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  const addRecord = (score) => {
    const recordDate = moment().format("DD.MM.YYYY HH:mm:ss");
    setLastRecordDate(recordDate);
    setRecords((prevState) => [
      ...prevState,
      {
        score,
        date: recordDate,
      },
    ]);
  };

  return (
    <GameContext.Provider value={{ records, lastRecordDate, addRecord }}>
      {children}
    </GameContext.Provider>
  );
}
