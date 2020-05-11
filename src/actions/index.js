import axios from "axios";

export const FETCHING_DATA = "FETCHING_DATA";
export const FETCH_CDATA_SUCCESS = "FETCH_CDATA_SUCCESS"
export const FETCH_CDATAYD_SUCCESS = "FETC_GDATAYD_SUCCESS"
export const FETCH_DATA_FAIL = "FETCH_DATA_FAIL";

export const fetchNovelDataCountry = () => dispatch => {
    dispatch({ type: FETCHING_DATA })
    axios
        .get("https://disease.sh/v2/countries?yesterday=false")
        .then(res => {
                dispatch({ type: FETCH_CDATA_SUCCESS, payload: res.data })
                console.log("country", res.data)
            }
        )
        .catch(err => dispatch({ type: FETCH_DATA_FAIL, payload: err }))
};

export const fetchNovelDataCountryYD = () => dispatch => {
    dispatch({ type: FETCHING_DATA })
    axios
        .get("https://disease.sh/v2/countries?yesterday=true")
        .then(res => {
                dispatch({ type: FETCH_CDATAYD_SUCCESS, payload: res.data })
                console.log("countryyd", res.data)
            }
        )
        .catch(err => dispatch({ type: FETCH_DATA_FAIL, payload: err }))
};
