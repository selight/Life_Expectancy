import {useData} from "./DataCollection";
import {useState} from "react";
import ScatterPlotChart from "./scatterPlotChart";
const DEVELOPING_COLOR = "#f46d43";
const DEVELOPED_COLOR = "#66c2a5";
const review = [{
    "hepatitis_b": "There is a slight decrease in the life expectancy value in case of developed countries " +
        "whereas in case of Developed countries the life expectancy value is gradually " +
        "rising which means that developing countries are taking measures for setting up vaccine of hepatitis B",
    "measles": "In case of Measles, according to the graph the developed countries seems to " +
        "have vaccines available to tackle measles whereas developing countries life expectancy" +
        " values is decreasing day by day maybe because of lack of resources to handle measles",
    "polio": "Developed countries seems to have successfully eradicated polio disease because " +
        "of vaccines whereas in developing countries there was low expectancy value initially " +
        "but now it is gradually increasing maybe because of proper doses being given",
    "diphtheria": "Developed countries seems to have successfully eradicated diptheria " +
        "disease because of vaccines whereas in developing countries there was low expectancy value initially " +
        "but now it is gradually increasing maybe because of proper doses being given",
    "hiv/aids": "The graph shows that developing countries still have not been able to " +
        "handle hiv/aids at all as the life expectancy value is decreasing at a rapid range." +
        " This can be due to rising population and no education been given "
}]
const ScatterPlot = () => {
    const {lifeExpectanciesData} = useData();
    const diseases = ["measles", "polio", "hepatitis_b", "diphtheria", "hiv/aids"];
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
                <div className="legend" >
                    <div className="legend__item">
                        <div className="legend__color" style={{backgroundColor: DEVELOPING_COLOR}}/>
                        <div className="legend__label">Developing</div>
                    </div>
                    <div className="legend__item">
                        <div className="legend__color" style={{backgroundColor: DEVELOPED_COLOR}}/>
                        <div className="legend__label">Developed</div>
                    </div>
                </div>
                <ScatterPlotChart
                    developingData={developingPlotData}
                    developedData={developedPlotData}
                    xTitle={chosenOption.toUpperCase()}
                    width={scale * 5}
                    height={scale * 5}
                    radius={5}
                />
                <div className="textbox">
                    <h3>Conclusion</h3>
                    <p>{review[0][chosenOption]}</p>
                </div>
            </div>
        </div>
    )
}
export default ScatterPlot;