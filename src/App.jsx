import { GameProvider } from "./GameContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Game from "./pages/Game";
import { useEffect, useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState([]);

  // при инициализации приложения достаем из сервера json со словарем
  useEffect(() => {
    fetch("http://194.147.115.197:3600/dictionary")
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setDictionary(data);
          setLoading(false);
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="mt-10 flex flex-col items-center">
      {loading ? (
        <span className="loader" />
      ) : (
        <GameProvider>
          <RouterProvider
            router={createBrowserRouter([
              {
                path: "/",
                element: <Root />,
              },
              {
                path: "/game",
                element: <Game dictionary={dictionary} />,
              },
            ])}
          />
        </GameProvider>
      )}
    </div>
  );
}
