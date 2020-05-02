import React from "react";
import { useSelector } from "react-redux";

export default () => {
    const globalData = useSelector(state => state.summaryData.Global);
    console.log("state check", globalData);
    console.log("global death check", globalData.TotalDeaths);

    const countryData = useSelector(state => state.summaryData.Countries);
    console.log("state data check", countryData);

    const top50CasesByCountry = countryData.filter(data => data.TotalConfirmed > 0).sort((a, b) => b.TotalConfirmed - a.TotalConfirmed).slice(0, 50)
    console.log("top 50 countries by #cases", top50CasesByCountry);

    const top50New = countryData.filter(data => data.NewConfirmed > 0).sort((a, b) => b.NewConfirmed - a.NewConfirmed).slice(0, 50)
    console.log("top 50 countries by #new confirmed cases", top50New);
    
    const top50DeathsByCountry = countryData.filter(data => data.TotalDeaths > 0).sort((a, b) => b.TotalDeaths - a.TotalDeaths).slice(0, 50);
    console.log("top 50 countries by #deaths", top50DeathsByCountry);

    const top50NewDeaths = countryData.filter(data => data.NewDeaths > 0).sort((a, b) => b.NewDeaths - a.NewDeaths).slice(0, 50)
    console.log("top 50 countries by #new deaths", top50NewDeaths);

    return (
        <div>
            View Page
        </div>
    );
}