import React from "react";
import { useSelector } from "react-redux";

export default () => {
    const summaryData = useSelector(state => state.summaryData)
    console.log("state data check", summaryData)
    
    return (
        <div>
            View Page
        </div>
    );
}