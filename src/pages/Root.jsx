import { useContext, useEffect, useState } from "react";
import { GameContext } from "../GameContext";
import { useNavigate } from "react-router-dom";

const classes = "p-2 border border-slate-300 text-center";

export default function Root() {
  const { records, lastRecordDate } = useContext(GameContext);
  const navigate = useNavigate();

  const [currentRecords, setCurrentRecords] = useState([]);

  useEffect(() => {
    const subRecords = records.sort((a, b) => b.score - a.score).slice(0, 5);
    if (lastRecordDate !== "") {
      const dates = subRecords.map((x) => {
        return x.date;
      });
      if (dates.includes(lastRecordDate)) {
        setCurrentRecords(subRecords);
      } else {
        setCurrentRecords([
          ...subRecords,
          records.find((x) => x.date === lastRecordDate),
        ]);
      }
    } else {
      setCurrentRecords(subRecords);
    }
  }, [records]);

  function handleStartGame() {
    navigate("/game");
  }

  return (
    <>
      <h2 className="text-3xl font-semibold">Таблица рекордов</h2>
      <table className="mt-3 table-auto border-collapse border-spacing-2 border border-slate-400">
        <thead>
          <tr>
            <th className={classes}>Место</th>
            <th className={classes}>Результат</th>
            <th className={classes}>Дата</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record, index) => {
            return (
              <tr
                key={record.date}
                className={record.date === lastRecordDate ? "bg-slate-200" : ""}
              >
                <td className={classes}>{index + 1}</td>
                <td className={classes}>{record.score}</td>
                <td className={classes}>{record.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="p-2 mt-3 border rounded-lg transition hover:bg-slate-200" onClick={handleStartGame}>
        Начать
      </button>
    </>
  );
}
