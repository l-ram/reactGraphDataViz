import { useQuery } from "react-query";
import { SPARQLQuerySelectResultsJSON } from "../types/types";
import { error } from "console";

const UseGetSPARQL = (query: string) => {
  const fetchQuery = async () => {
    const url = "http://dbpedia.org/sparql";
    const response = await fetch(url + "?query=" + encodeURIComponent(query), {
      method: "GET",
      headers: {
        "Content-Type": "application/sparql-query",
        Accept: "application/sparql-results+json",
      },
    });
    return response.json() as Promise<SPARQLQuerySelectResultsJSON>;
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["sparql", query],
    queryFn: async () => await fetchQuery(),
  });

  console.log("query data:", data);
  console.log("query ran");
  console.log("is loading?:", isLoading);
  console.log("is error?:", isError);
  return { isLoading, isError, data };
};

export default UseGetSPARQL;
