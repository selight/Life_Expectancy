import './App.css';

import WorldMapAtlas from './components/worldMapAtlas.js'
import ScatterPlot from "./components/scatterPlot";
import {AverageLifeExpectancy} from "./components/averageLifeExpectancy";
function App() {
  return (
    <div className="App">
        <div id="">
            <h1>Getting started with map visualization</h1>
            <WorldMapAtlas />
            <ScatterPlot />
          <AverageLifeExpectancy/>
            <br/>
        </div>
         </div>
  );
}

export default App;