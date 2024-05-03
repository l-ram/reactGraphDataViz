import { useQuery } from "react-query";
import { SPARQLQuerySelectResultsJSON } from "../types/types";

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

  const { isLoading, isError, data, status } = useQuery({
    queryKey: ["sparql", query],
    queryFn: async () => await fetchQuery(),
  });

  return { isLoading, isError, data, status };
};

export default UseGetSPARQL;
