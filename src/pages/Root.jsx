import { useContext, useEffect, useState } from "react";
import { GameContext } from "../GameContext";
import { useNavigate } from "react-router-dom";

const classes = "p-2 border border-slate-300 text-center";

export default function Root() {
  const { records, lastRecordDate } = useContext(GameContext);
  const navigate = useNavigate();

  // записи, которые нужно отобразить в таблице
  const [currentRecords, setCurrentRecords] = useState([]);

  useEffect(() => {
    // сортируем все записи по убыванию очков и достаем первые 5 записей
    const subRecords = records.sort((a, b) => b.score - a.score).slice(0, 5);

    // если пользователь только что завершил свою попытку
    if (lastRecordDate !== "") {

      //то достаем все даты из среза записей и пытаемся найти дату последней попытки
      const dates = subRecords.map((x) => {
        return x.date;
      });

      // если такая дата присутствует,
      if (dates.includes(lastRecordDate)) {
        // то отображаем в срез записей как есть
        setCurrentRecords(subRecords);
      } else {
        // иначе принудительно добавляем запись с последней попыткой
        setCurrentRecords([
          ...subRecords,
          records.find((x) => x.date === lastRecordDate),
        ]);
      }
    } else {
      // если последней попытки не было, то просто кладем срез записей как есть
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
                // если текущая запись - это запись последней попытки, то подсвечиваем ее
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
