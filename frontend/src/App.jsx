import { useEffect, useState } from 'react';

function App(){

  const [metrics, setMetrics] = useState({});

  useEffect(()=>{
    const interval = setInterval(async()=>{
      const res = await fetch("http://localhost:5000/api/metrics/current");
      const data = await res.json();
      setMetrics(data);
    },2000);

    return ()=>clearInterval(interval);
  },[]);

  const card = {
    background: "#0f172a",
    padding: 30,
    borderRadius: 12,
    textAlign: "center"
  };

  const value = {
    fontSize: 36,
    marginTop: 10
  };

  return (
    <div style={{
      background: "#020617",
      minHeight: "100vh",
      color: "white",
      padding: 40
    }}>

      <h1 style={{ marginBottom: 40 }}>AI Predictive Autoscaler</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 30
      }}>

        <div style={card}>
          <h3>CPU</h3>
          <p style={value}>{metrics.cpu}%</p>
        </div>

        <div style={card}>
          <h3>Memory</h3>
          <p style={value}>{metrics.memory}%</p>
        </div>

        <div style={card}>
          <h3>Requests/sec</h3>
          <p style={value}>{metrics.requestsPerSecond}</p>
        </div>

      </div>

    </div>
  );
}

export default App;
