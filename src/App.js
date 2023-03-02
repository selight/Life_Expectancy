import './App.css';

import WorldMapAtlas from './components/worldMapAtlas.js'
import ScatterPlot from "./components/scatterPlot";
import {AverageLifeExpectancy} from "./components/averageLifeExpectancy";
function App() {
  return (
    <div className="App">
        <div id="">
            <h1>The Dreadful Effect of Diseases on Life Expectancy</h1>
            <h2>The following three graphs visualize life expectancy and the factor that affect it, the data was take from keggle and it was organized by WHO.</h2>
            <WorldMapAtlas />
            <ScatterPlot />
          <AverageLifeExpectancy/>
            <br/>
        </div>
         </div>
  );
}

export default App;
