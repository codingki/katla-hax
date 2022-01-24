import "./styles.css";
import { useState } from "react";

export default function App() {
  const [state, setState] = useState(new Map());

  const [answers, setAnswers] = useState();
  return (
    <div className="App">
      <h1>Katla hax</h1>
      <div className="wrapper">
        {Array.from(Array(5)).map((item, index) => (
          <input
            key={index}
            maxLength="1"
            onChange={(e) => {
              const newMap = new Map(state);
              newMap.set(index, e.currentTarget.value);
              setState(newMap);
            }}
          />
        ))}
      </div>
      <button
        style={{ marginTop: 10 }}
        onClick={async () => setAnswers(await katla(state))}
      >
        Cari
      </button>
      <div className="answerWrapper">
        {!!answers && answers.length === 0 && <span>Tidak ada di kbbi</span>}
        {answers && answers.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

const katla = async (charsMap) => {
  const kbbi = await fetch("https://kbbi.vercel.app").then((res) => res.json());
  const words = kbbi.entries
    .map((entry) => {
      const [word] = entry.split("/").reverse();
      return word;
    })
    .filter(
      (word) =>
        !word.includes("%20") && !word.includes("-") && word.length === 5
    );

  // clean chars
  charsMap.forEach((v, k) => {
    if (v.trim() === "") {
      charsMap.delete(k);
    }
  });
  const findWordsInX = words.filter((word) => {
    const getSameChar = Array.from(charsMap.entries()).map(([index, char]) => {
      if (char.trim() === "") return false;
      return word[index] === char;
    });
    const findFalse = getSameChar.includes(false);
    return !findFalse;
  });
  return findWordsInX;
};
