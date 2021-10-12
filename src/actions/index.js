import axios from "axios";

export const FETCHING_DATA = "FETCHING_DATA";
export const FETCH_CDATA_SUCCESS = "FETCH_CDATA_SUCCESS";
export const FETCH_CDATAYD_SUCCESS = "FETCH_CDATAYD_SUCCESS";
export const FETCH_NDATA_SUCCESS = "FETCH_NDATA_SUCCESS";
export const FETCH_DATA_FAIL = "FETCH_DATA_FAIL";

export const fetchNovelDataCountry = () => dispatch => {
    dispatch({ type: FETCHING_DATA })
    axios
        .get(`${process.env.REACT_APP_CDATA_URL}`)
        .then(res => {
                dispatch({ type: FETCH_CDATA_SUCCESS, payload: res.data })
            }
        )
        .catch(err => dispatch({ type: FETCH_DATA_FAIL, payload: err }))
};

export const fetchNovelDataCountryYD = () => dispatch => {
    dispatch({ type: FETCHING_DATA })
    axios
        .get(`${process.env.REACT_APP_CDATAYD_URL}`)
        .then(res => {
                dispatch({ type: FETCH_CDATAYD_SUCCESS, payload: res.data })
            }
        )
        .catch(err => dispatch({ type: FETCH_DATA_FAIL, payload: err }))
};

export const fetchNewsData = () => dispatch => {
    dispatch({ type: FETCHING_DATA })
    let newsOptions = {
        params: {q: 'covid', freshness: 'Day', textFormat: 'Raw', safeSearch: 'Off', count: '12'},
        headers: {
        'x-bingapis-sdk': 'true',
        'x-rapidapi-host': `${process.env.REACT_APP_NEWS_URL}`,
        'x-rapidapi-key': `${process.env.REACT_APP_RAPIDAPI_KEY}`
        }
    }
    axios
        .get(`https://${process.env.REACT_APP_NEWS_URL}/news/search`, newsOptions)
        .then(res => {
                dispatch({ type: FETCH_NDATA_SUCCESS, payload: res.data })
            }
        )
        .catch(err => dispatch({ type: FETCH_DATA_FAIL, payload: err }))
};
