import "./App.css";
import GraphVisual from "./GraphVisual";
import D3SPARQLScript from "./D3SPARQLScript";

const App = () => {
  return (
    <div>
      <GraphVisual prop={""} />
      <D3SPARQLScript />
      {/* <SparqlResult /> */}
    </div>
  );
};

export default App;
