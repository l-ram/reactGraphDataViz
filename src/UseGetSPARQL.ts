import { useQuery } from "react-query";

const UseGetSPARQL = async () => {
  const { isLoading, error, data } = useQuery(
    await fetch("").then((res) => res.json)
  );
};

export default {} = UseGetSPARQL;
