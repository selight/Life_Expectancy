import {csv, json} from "d3-request";
import {useEffect, useState} from "react";
import {feature} from "topojson-client";
export const useData = function () {
    const [worldMapData, setWorldMapData] = useState({
        data: [],
        loading: true,
    });
    const [countryCodesData, setCountryCodesData] = useState({
        data: {},
        loading: true,
    });
    const [lifeExpectanciesData, setLifeExpectanciesData] = useState({
        data: [],
        loading: true,
    });
    useEffect(() => {
        json('./world-110m.v1.json', (data) => {
            data=feature(data,data.objects.countries).features
            setWorldMapData((prevState) => {
                return {...prevState, data: data, loading: false};
            });
        });


        csv('./country-codes.csv', (data) => {
            setCountryCodesData((prevState) => {
                return {...prevState, data: data, loading: false};
            });
        });
        csv('./LifeExpectancyDataWinsorized.csv', (data) => {
            setLifeExpectanciesData((prevState) => {
                return {...prevState, data: data, loading: false};
            });
        })
    },[])
    return {worldMapData, countryCodesData, lifeExpectanciesData};
}
