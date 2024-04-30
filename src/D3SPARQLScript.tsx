import { useState } from "react";
import d3sparql from './d3sparql.js' as any;
import { useEffect } from "react";
import { SPARQLQuerySelectResultsJSON } from "./types/types.js";

const SPARQLtoD3 = () => {
  const [sparqlResults, setSparqlResults] = useState<any>(null);

  useEffect(() => {
    const endpoint = "https://dbpedia.org/sparql";
    const query = `
    SELECT ?label WHERE {
        ?person a dbo:Person.
        ?person rdfs:label ?label.
        FILTER (lang(?label) = "en")
    }
    LIMIT 10
`;

    console.log(d3sparql);

    d3sparql.json(endpoint, query, (error: any, data: any) => {
      if (error) {
        console.log("error", error);
        return;
      }
      setSparqlResults(data);
    });
  }, []);

  return (
    <div>
      <h1>SPARQL results</h1>
      {sparqlResults && (
        <ul>
          {sparqlResults.results.bindings.map((binding: any, id: any) => (
            <li key={id}>{binding.label.value}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SPARQLtoD3;
