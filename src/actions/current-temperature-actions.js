export const GET_INSIDE_TEMPERATURE = 'currentTemperature:getInsideTemperature';
export const GET_OUTSIDE_TEMPERATURE = 'currentTemperature:getOutsideTemperature';
export const SENSOR_SLUG = {
    INSIDE: 'inside-1',
    OUTSIDE: 'outside-1',
    HUMIDITY: 'humidity'
}

export function getCurrentTemperatureInside() {
    return dispatch => {
        var urlToFetchInsideTemperature = getURL(SENSOR_SLUG.INSIDE);
        fetch(urlToFetchInsideTemperature, {
          method: 'GET'
        }).then((response) => { 
          return response.json();
        }).then((data) => {
          var insideTemperature = getCurrentTemperature(data.data_points);
          dispatch(showCurrentTemperatureInside(insideTemperature));
        })
    }
}

export function showCurrentTemperatureInside(temperature) {
    return {
        type: GET_INSIDE_TEMPERATURE,
        payload: {
            currentTemperatureInside: temperature
        }
    }
}

export function getCurrentTemperatureOutside() {
    return dispatch => {
        var urlToFetchInsideTemperature = getURL(SENSOR_SLUG.OUTSIDE);
        fetch(urlToFetchInsideTemperature, {
          method: 'GET'
        }).then((response) => { 
          return response.json();
        }).then((data) => {
          var outsideTemperature = getCurrentTemperature(data.data_points);
          dispatch(showCurrentTemperatureOutside(outsideTemperature));
        })
    }
}

export function showCurrentTemperatureOutside(temperature) {
    return {
        type: GET_OUTSIDE_TEMPERATURE,
        payload: {
            currentTemperatureOutside: temperature
        }
    }
}

export function getURL(sensorSlug) {
    var baseURL = sensorSlug === 'inside-1' ? "https://api-staging.paritygo.com/sensors/api/sensors/indoor-1/?begin=" : "https://api-staging.paritygo.com/sensors/api/sensors/outdoor-1/?begin="
    var now = new Date();
    var beginTime = new Date(new Date().getTime() - now.getTimezoneOffset() * 60000 - (15 * 60000)).toISOString();
    var endTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    return baseURL + beginTime + "&end=" + endTime;
}

export function getCurrentTemperature(dataPoints) {
    var dataPointValues = dataPoints.map((r) => parseFloat(r.value));
    var currentTemperature = getAverageOfArray(dataPointValues);
    return currentTemperature;
}

export function getAverageOfArray(arr) {
  return arr.reduce((a,b) => a + b, 0) / arr.length
}
