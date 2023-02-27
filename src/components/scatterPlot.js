import {useData} from "./DataCollection";
import {useState} from "react";
import ScatterPlotChart from "./scatterPlotChart";

const ScatterPlot = () => {
    const {lifeExpectanciesData} = useData();
    const diseases = ["measles", "polio", "hepatitis_b", "diphtheria", "hiv/aids","schooling","alcohol"];
    const [chosenOption, setChosenOption] = useState(diseases[0]);
    let developingPlotData = [];
    let developedPlotData = [];
    const scale = 200;
    if (!lifeExpectanciesData.loading) {
        lifeExpectanciesData.data.forEach((country) => {
            country.status === "Developing" ? developingPlotData.push({
                    x: country[chosenOption],
                    y: country.life_expectancy
                }): developedPlotData.push({x: country[chosenOption], y: country.life_expectancy});
        })
    }
    const handleChange = (event) => {
        setChosenOption(event.target.value);
    }

    return (
        <div>
            <h1>Scatter Plot</h1>
            <div>
                <select value={chosenOption} onChange={handleChange}>{
                    diseases.map((x, y) =>
                        <option key={y} value={x}>{x}</option>)
                }</select>
                <ScatterPlotChart
                    developingData={developingPlotData}
                    developedData={developedPlotData}
                    xTitle={chosenOption.toUpperCase()}
                    width={scale * 5}
                    height={scale * 5}
                    radius={5}
                />
            </div>
        </div>
    )
}
export default ScatterPlot;