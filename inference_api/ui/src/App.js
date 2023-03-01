import "./App.css";

import React from "react";

function App() {
  const [modelList, setModelList] = React.useState([]);
  const [selectedModel, setSelectedModel] = React.useState();
  const [selectedLineSpace, setSelectedLineSpace] = React.useState();
  const [selectedScanSpeed, setSelectedScanSpeed] = React.useState();
  const [selectedDepth, setSelectedDepth] = React.useState();
  const [prediction, setPrediction] = React.useState({});

  React.useEffect(() => {
    fetch("http://localhost:5000/models")
      .then((res) => res.json())
      .then((data) => setModelList(data));
  }, []);

  React.useEffect(()=>{
    setSelectedModel(modelList[0])
  },[modelList])

  const submit = () => {
    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        line_space: parseFloat(selectedLineSpace),
        scanning_velocity: parseFloat(selectedScanSpeed),
        depth: parseFloat(selectedDepth),
      }),
    })
      .then((response) => response.json())
      .then((data) => setPrediction(data));
  };
  return (
    <div className="App">
      <div className="main">
        <div>
          <label htmlFor="models">Choose a model:</label>
          <select
            name="models"
            id="models"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {modelList?.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="line">Line space: </label>
          <input
            name="line"
            onChange={(e) => setSelectedLineSpace(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="scan">Scan speed: </label>
          <input
            name="scan"
            onChange={(e) => setSelectedScanSpeed(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="depth">Depth: </label>
          <input
            name="depth"
            onChange={(e) => setSelectedDepth(e.target.value)}
          ></input>
        </div>
        <button onClick={submit}>Predict Pulse Energy</button>
      </div>
      <div className="result">
        <h3>Prediction: {prediction?.prediction}</h3>
      </div>
    </div>
  );
}

export default App;
