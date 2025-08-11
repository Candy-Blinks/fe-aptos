import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface CandyStore {
  address: string;
  url: string;
  numberOfItems: number;
  name: string;
  minted: number;
}

function useFetchCollections() {
  const [data, setData] = useState<CandyStore[] | null>(null);

  useEffect(() => {
    // Replace with actual fetch logic
    async function fetchData() {
      const {data} = await axios.get(`${API_URL}api/collections/collections`);
      setData(data);
    }
    fetchData();
  }, []);

  return { data };
}
export default useFetchCollections;