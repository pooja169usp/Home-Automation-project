export const UPDATE_THERMOSTAT_STATE = 'thermostat:updateState';

export function updateThermostatState(thermostatState) {
    return {
        type: UPDATE_THERMOSTAT_STATE,
        payload: {
            thermostatState: thermostatState
        }
    }
}

export function changeThermostatState(setToState, thermostatID) {
    return dispatch => {
        var urlToUpdateThermostatState = "https://api-staging.paritygo.com/sensors/api/thermostat/" + thermostatID + "/"
        fetch(urlToUpdateThermostatState, {
          method: 'PATCH',
          body: JSON.stringify({
            state: setToState
          }),
          headers: {
            'Content-Type': 'application/json'
          },
        }).then((response) => {
          return response.json();
        }).then((data) => {
          dispatch(updateThermostatState(data.state));
        });
    }
}

export function getThermostatState(thermostatID) {
    return dispatch => {
        var urlToGetThermostatState = "https://api-staging.paritygo.com/sensors/api/thermostat/" + thermostatID + "/"
        fetch(urlToGetThermostatState, {
          method: 'GET'
        }).then((response) => {
          return response.json();
        }).then((data) => {
            dispatch(updateThermostatState(data.state));
        });
    }
}