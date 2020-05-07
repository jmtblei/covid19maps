import axios from "axios";

export const FETCHING_DATA = "FETCHING_DATA";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";
export const FETCH_DATA_FAIL = "FETCH_DATA_FAIL";

export const fetchSummaryData = () => dispatch => {
    dispatch({ type: FETCHING_DATA })
    axios
        .get("https://api.covid19api.com/summary")
        .then(res => {
                dispatch({ type: FETCH_DATA_SUCCESS, payload: res.data })
            }
        )
        .catch(err => dispatch({ type: FETCH_DATA_FAIL, payload: err }))
};
