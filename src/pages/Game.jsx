import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../GameContext";
import { Button } from "../components/Button";

export default function Game({ dictionary }) {
  const [time, setTime] = useState(1000);
  const [score, setScore] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordIndexHistory, setWordIndexHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const navigate = useNavigate();
  const { addRecord } = useContext(GameContext);

  useEffect(() => {
    putRandomWord();
  }, []);

  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      addRecord(score);
      navigate("/");
    }
  }, [time]);

  function putRandomWord() {
    if (wordIndexHistory.length === dictionary.length) {
      addRecord(score);
      navigate("/");
      return;
    }

    const randomIndex = Math.floor(Math.random() * dictionary.length);
    if (wordIndexHistory.includes(randomIndex)) {
      putRandomWord();
    } else {
      setCurrentWordIndex(randomIndex);
      setWordIndexHistory((prevState) => [...prevState, randomIndex]);
    }
  }

  function handleAnswer(event) {
    event.preventDefault();
    if (
      currentAnswer.toLowerCase() ===
      dictionary[currentWordIndex].translate.toLowerCase()
    ) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setScore((prevScore) => prevScore - 1);
    }
    putRandomWord();
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
