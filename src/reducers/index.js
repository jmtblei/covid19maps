import {
    FETCHING_DATA,
    FETCH_CDATA_SUCCESS,
    FETCH_CDATAYD_SUCCESS,
    FETCH_DATA_FAIL
} from "../actions/index";

const initialState = {
    error: "",
    isFetching: false,
    isFetched: false,
    isFetched2: false,
};

export default(state = initialState, action) => {
    switch (action.type) {
        case FETCHING_DATA: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case FETCH_CDATA_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                isFetched: true,
                countryData: action.payload
            }
        }
        case FETCH_CDATAYD_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                isFetched2: true,
                countryDataYD: action.payload
            }
        }
        case FETCH_DATA_FAIL: {
            return {
                ...state,
                isFetching: false,
                error: action.payload
            }
        }
        default: {
            return state
        }
    }
}
