import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../GameContext";
import { Button } from "../components/Button";

export default function Game({ dictionary }) {
  const [time, setTime] = useState(60); // время таймера
  const [score, setScore] = useState(0); // количество очков
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // текущий индекс слова
  const [wordIndexHistory, setWordIndexHistory] = useState([]); // история индеков
  const [currentAnswer, setCurrentAnswer] = useState(""); // текущее значение ответа
  const navigate = useNavigate();
  const { addRecord } = useContext(GameContext);

  useEffect(() => {
    // при инициализации необходимо установить первое слово из словаря
    putRandomWord();
  }, []);

  // механизм работы таймера
  useEffect(() => {
    // если время еще есть, то через секунду уменьшаем его на единицу
    if (time > 0) {
      const timerId = setTimeout(() => {
        setTime(time - 1);
      }, 1000);

      // и сразу очищаем
      return () => clearTimeout(timerId);
    } else {
      // иначе время закончилось, следовательно необходимо завершить попытку
      addRecord(score);
      navigate("/");
    }
  }, [time]);

  // устанавливает рандомное слово из словаря
  function putRandomWord() {
    // если количество индеков в истории ровняется количеству слов из словаря,
    // то пользователь ответил на все слова в словаре, следовательно необходимо завершить попытку
    if (wordIndexHistory.length === dictionary.length) {
      addRecord(score);
      navigate("/");
      return;
    }

    // иначе достаем рандомный индекс
    const randomIndex = Math.floor(Math.random() * dictionary.length);

    // если такой индекс уже присутствует в истории
    if (wordIndexHistory.includes(randomIndex)) {
      // то рекурсивно пытаемся найти индекс еще раз
      putRandomWord();
    } else {
      // если свободный индекс нашелся, то устанавливаем новый текущий индекс и добавляем его в историю
      setCurrentWordIndex(randomIndex);
      setWordIndexHistory((prevState) => [...prevState, randomIndex]);
    }
  }

  // обработчик проверки ответа
  function handleAnswer(event) {
    event.preventDefault();

    // конвертируем ответ в нижний регистр и проверяем текущее слово из словаря также в нижнем регистре
    if (
      currentAnswer.toLowerCase() ===
      dictionary[currentWordIndex].translate.toLowerCase()
    ) {
      // ответ верный
      setScore((prevScore) => prevScore + 1);
    } else {
      // ответ неверный
      setScore((prevScore) => prevScore - 1);
    }

    // заново выбираем новое слово
    putRandomWord();

    // очищаем поле ввода
    setCurrentAnswer("");
  }


  return (
    <>
      <div className="flex flex-row gap-3 justify-between">
        <div className="flex flex-row gap-3">
          <p>Таймер: </p>
          <div>
            {time === 60 ? `01:00` : time >= 10 ? `00:${time}` : `00:0${time}`}
          </div>
        </div>
        <div>Счет: {`${score < 10 && score >= 0 ? `0${score}` : score}`}</div>
      </div>
      <div className="mt-3 p-4 rounded-lg shadow-lg flex flex-col gap-4">
        <div className="flex flex-row gap-3">
          <p>Текущее слово: </p>
          <p className="font-semibold">{dictionary[currentWordIndex].word}</p>
        </div>
        <form className="flex flex-row gap-4" onSubmit={handleAnswer}>
          <input
            className="p-2 border rounded-lg transition-all focus:outline-none focus:ring focus:ring-slate-300"
            placeholder="Ваш ответ..."
            value={currentAnswer}
            onChange={(event) => setCurrentAnswer(event.target.value)}
          />
        <Button>
          Ответить
          </Button>          
        </form>
      </div>
    </>
  );
}
