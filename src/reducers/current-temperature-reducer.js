import { GET_INSIDE_TEMPERATURE, GET_OUTSIDE_TEMPERATURE } from '../actions/current-temperature-actions';

export function currentTemperatureInsideReducer(state = "", {type, payload}) {
    switch (type) {
        case GET_INSIDE_TEMPERATURE:
            return payload.currentTemperatureInside
        default:
            return state
    }
}

export function currentTemperatureOutsideReducer(state = "", {type, payload}) {
    switch (type) {
        case GET_OUTSIDE_TEMPERATURE:
            return payload.currentTemperatureOutside
        default:
            return state
    }
}