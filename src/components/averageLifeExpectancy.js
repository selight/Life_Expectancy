import {BarChart} from "./BarChart";
import {useData} from "./DataCollection";

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
    //find the mean life expectancy of each country and store it in an array
    let countryLifeExpectancies = [];
    if (!lifeExpectanciesData.loading) {
        groupBy(lifeExpectanciesData.data, (data) => data.country).forEach((value, key) => {
            let sum = 0;
            value.forEach((country) => sum += parseFloat(country.life_expectancy));
            countryLifeExpectancies.push({label: key, value: sum / value.length})
        })
    }
    return (
        <div>
            <h1>Average Life Expectancy</h1>
            <BarChart data={countryLifeExpectancies.sort((a, b) => a.value - b.value)} />
        </div>
    );
}