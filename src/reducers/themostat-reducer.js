import { UPDATE_THERMOSTAT_STATE } from '../actions/thermostat-actions';

export default function thermostatReducer(state = "", {type, payload}) {
    switch (type) {
        case UPDATE_THERMOSTAT_STATE:
            return payload.thermostatState
        default:
            return state
    }
}