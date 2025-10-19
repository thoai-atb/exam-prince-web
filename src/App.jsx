import { useState } from "react";
import "./App.css";
import HouseContainer from "./pages/HouseContainer";
import TopicSelection from "./pages/TopicSelection";

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <>
      {!selectedTopic ? (
        <TopicSelection onSelect={(topic) => setSelectedTopic(topic)} />
      ) : (
        <HouseContainer topic={selectedTopic} onExit={() => setSelectedTopic(null)} />
      )}
    </>
  );
}

export default App;
