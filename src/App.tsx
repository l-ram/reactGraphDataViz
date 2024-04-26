import "./App.css";
import GraphVisual from "./GraphVisual";
import { SparqlResult } from "./SparqlResult";

const App = () => {
  return (
    <div>
      <GraphVisual prop={""} />
      <SparqlResult />
    </div>
  );
};

export default App;
