import moment from "moment/moment";
import { createContext, useEffect, useState } from "react";

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [records, setRecords] = useState([]); // записи рекордов

  // дата и время (в виде строки) последней попытки. по умолчанию пустая строка, так как последней попытки еще не было
  const [lastRecordDate, setLastRecordDate] = useState("");

  // При первом запуске достаем данные из localStorage
  useEffect(() => {
    const storedRecords = localStorage.getItem("records");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  // При каждом изменении данных, записываем в localStorage
  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  // метод добавления новой записи
  // на вход принимает количество очков
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
