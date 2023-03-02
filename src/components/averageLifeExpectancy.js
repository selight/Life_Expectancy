import {BarChart} from "./BarChart";
import {useData} from "./DataCollection";
import {useState} from "react";

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}
export const AverageLifeExpectancy = () => {
    const {lifeExpectanciesData} = useData();
    const diseases = ["measles", "polio", "hepatitis_b", "diphtheria", "hiv/aids"];
    const mortality = ["infant_deaths", "under-five_deaths", "adult_mortality"];
   const [mortalityOption, setMortalityOption] = useState(mortality[0])
    let groupedData = groupBy(lifeExpectanciesData.data, (country) => country.country);

    //find the mean life expectancy of each country and store it in an array

    let diseaseMortalityCorrelation = [];
    if (!lifeExpectanciesData.loading ) {
        groupedData.forEach((value, key) => {
            let mortalitySum = 0;
            let lifeExpectancySum = 0;
            let diseaseSum = Array.from([...diseases], (disease) => {
                return {disease: disease, ratio: 0}
            });
          value.forEach((country) => {
              mortalitySum += parseFloat(country[mortalityOption])
                lifeExpectancySum += parseFloat(country.life_expectancy)
                diseaseSum.forEach((disease) => {
                    disease.ratio += parseFloat(country[disease.disease])
                })
          });
          // calculate the average of each disease ratio and sort them in descending order
            let sortedDisease = diseaseSum.map((disease) => {
                return {disease: disease.disease, ratio: disease.ratio / value.length}
            }).sort((a, b) => b.ratio - a.ratio)

           diseaseMortalityCorrelation.push({label: key, value: mortalitySum / value.length, life_expectancy: lifeExpectancySum / value.length, highestAffectingDiseases: sortedDisease.slice(0, 3)})
        })
        }
    const sortedDiseaseMortalityCorrelation = diseaseMortalityCorrelation.sort((a, b) => b.value - a.value)
    const handleMortalityChange = (event) => {
        setMortalityOption(event.target.value)
    }

    return (
        <div>
            <h1>Average Life Expectancy</h1>
            <div>
            <select value={mortalityOption} onChange={handleMortalityChange}>{
                mortality.map((x, y) =>
                    <option key={y} value={x}>{x}</option>)
            }</select>
            </div>
            <BarChart data={sortedDiseaseMortalityCorrelation} />
<div>
    <h2>Top 5 countries with highest average {mortalityOption} deaths</h2>
    <table>
        <thead>
        <tr>
            <th>Country</th>
            <th>Mortality</th>
            <th>Life Expectancy</th>
            <th>Status</th>
            <th>Ratio of most Affecting Diseases</th>

        </tr>
        </thead>
        <tbody>
        {sortedDiseaseMortalityCorrelation.slice(0,5).map((country, index) => {
            return (
                <tr key={index}>
                    <td>{country.label}</td>
                    <td>{country.value}</td>
                    <td>{parseInt(country.life_expectancy)}</td>
                    <td>{country.life_expectancy > 70 ? "Developed" : "Developing"}</td>
                    <td>{country.highestAffectingDiseases.map((disease) => {
                        return <div>{disease.disease} : {parseInt(disease.ratio)}</div>
                    })}</td>
                </tr>
            )

        })}
        </tbody>
    </table>

</div>
        </div>
    );
}