import { useState} from 'react'
import {geoEqualEarth, geoPath} from 'd3-geo'
import "./worldMapAtlas.css"
import {handleMouseMove, handleMouseOut, handleMouseOver} from "./tootlTip";
import * as d3 from "d3"
import {useData} from "./DataCollection";
const uuid = require('react-uuid')
const scale = 200
const cx = 400
const cy = 150
const WorldMapAtlas = () => {
    const [year,setYear]=useState("2015")
    const {worldMapData, countryCodesData, lifeExpectanciesData} = useData();
    if(!countryCodesData.loading && !lifeExpectanciesData.loading && !worldMapData.loading) {
        //map life expectancy data to world geometry using country-codes
        worldMapData.data.map(countryFeature => {
            const iso3166Code = countryFeature.id;
            const name=  countryCodesData.data.find(
                codes => codes['country-code'] === iso3166Code
            )?.['name'];
            countryFeature.properties = lifeExpectanciesData.data.find(data => data['country'] === name && data['year'] === year
            );
            return countryFeature;
        });
    }
    const projection = geoEqualEarth().scale(scale).translate([cx, cy]).rotate([0, 0])
    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("style", "position: absolute; opacity: 0");
    const handleSliderChange = (e) =>{
        setYear(e.target.value)
    }

    const color = d3.scaleLinear()
        .domain([40,50,60,65,70,75,80,85])
        .range(['#d53e4f','#f46d43','#fdae61','#fee08b','#e6f598','#abdda4','#66c2a5','#3288bd']);
//A function that returns the color gradient from red to green based on the life expectancy
    const handleColor = (lifeExpectancy) => {
        if (lifeExpectancy === undefined) {
            return "#ccc"
        }
        return color(lifeExpectancy)
    }

    return (
        <>
            <div className="slideContainer">
               Year Slider: <input type="range" onChange={handleSliderChange} min="2000" max="2015" value={year} className="slider" id="myRange"/>
                <span>{year}</span>

            </div>
            Life Expectancy Legend: <div className="legend">
                {color.ticks().map((tick, i) => (
                    <div key={i} className="legend__item">
                        <div
                            className="legend__color"
                            style={{ backgroundColor: color(tick) }}
                        />
                        <div className="legend__label">{tick}</div>
                    </div>
                ))}
            </div>

            <svg width={scale * 5} height={scale * 5} viewBox="0 0 800 450">
                    {worldMapData.data.map((d, i) => (
                        <g key={i}>
                        <path
                            key={`path-${uuid()}`}
                            d={geoPath().projection(projection)(d)}
                            fill={handleColor(d?.properties?.life_expectancy)}
                            stroke="aliceblue"
                            strokeWidth={0.5}
                            onMouseOver={() => {
                                handleMouseOver({countryName: d?.properties?.country, lifeExpectancy: d?.properties?.life_expectancy
                            });
                            }}
                            onMouseOut={handleMouseOut}
                            onMouseMove={(event) => {
                                handleMouseMove(event);
                            }}
                        />
                        </g>
                    ))}

            </svg>
        </>
    )
}

export default WorldMapAtlas

