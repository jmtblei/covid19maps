import {
    FETCHING_DATA,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_FAIL
} from "../actions/index";

const initialState = {
    error: "",
    isFetching: false,
    isFetched: false,
};

export default(state = initialState, action) => {
    switch (action.type) {
        case FETCHING_DATA: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case FETCH_DATA_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                isFetched: true,
                summaryData: action.payload
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
