import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBankValues } from "../utils/theGraph";

const Chart = () => {
  const { daochain, daoid } = useParams();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const data = await fetchBankValues({
        daoID: daoid,
        chainID: daochain,
      });
      setChartData(data);
    };
    if (!chartData) {
      fetchChartData();
    }
  }, []);

  return (
    <div>
      <h3>Chart</h3>
      {chartData?.length ? `Loaded ${chartData?.length} items` : "Loading..."}
    </div>
  );
};

export default Chart;
