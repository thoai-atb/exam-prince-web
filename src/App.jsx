import { useState } from "react";
import "./App.css";
import Main from "./pages/Main";
import TopicSelection from "./pages/TopicSelection";

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <>
      {!selectedTopic ? (
        <TopicSelection onSelect={(topic) => setSelectedTopic(topic)} />
      ) : (
        <Main topic={selectedTopic} onExit={() => setSelectedTopic(null)} />
      )}
    </>
  );
}

export default App;
