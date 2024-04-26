import UseGetSPARQL from "./UseGetSPARQL";

export const SparqlResult = () => {
  const simpleQuery: string = `SELECT ?entity ?label
    WHERE {
      ?entity rdfs:label ?label .
      FILTER (LANG(?label) = "en")  # Only retrieve labels in English
    }
    LIMIT 10`;

  const { data, error, isLoading } = UseGetSPARQL(simpleQuery);

  //   console.log("sparql loading:", isLoading);
  //   console.log("sparql query:", data);
  //   console.log("sparql error:", error);

  const stringOfJson = JSON.stringify(data);

  return (
    <div className="">
      <p>{stringOfJson}</p>
    </div>
  );
};
