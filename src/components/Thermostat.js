import React, { Component } from 'react';
import './Thermostat.css';
import { connect } from 'react-redux';
import { changeThermostatState, getThermostatState } from '../actions/thermostat-actions';
import { getCurrentTemperatureInside, getCurrentTemperatureOutside } from '../actions/current-temperature-actions';
import { toast } from "react-toastify";

class Thermostat extends Component {
  fetchDataIntervalID;
  TOAST_MESSAGE = {
    COOLING: "Cannot switch thermostat to cooling since the current outside temperature is below 0˚C",
    AUTO_MODE_DESIRED_TEMP_NULL: "Please select a desired temperature to switch to AUTO",
    SWITCHING_STATE_IN_AUTO_MODE: "Please turn Auto Off to switch to manual mode"
  };

  toastSettings = {
    position: "bottom-center",
    autoClose: 3000
  }
  
  THERMOSTAT_STATES = {
    OFF: 'off',
    HEAT: 'heat',
    COOL: 'cool',
    AUTO_HEAT: 'auto_heat',
    AUTO_COOL: 'auto_cool',
    AUTO_STANDBY: 'auto_standby'
  };

  constructor(props) {
    super(props);
    this.state = {
      desiredTemperature: "",
      isAutoEnabled: false
    }
  }

  componentDidMount() {
    this.props.onGetThermostatState(this.props.thermostatID);
    this.props.onGetCurrentTemperatureInside();
    this.props.onGetCurrentTemperatureOutside();
    this.setTimeoutFunctionToRefreshData();
    this.setState({
      isAutoEnabled: (localStorage.getItem("isAutoEnabled") === "false" || localStorage.getItem("isAutoEnabled") === null) ? false : true,
      desiredTemperature: localStorage.getItem("desiredTemperature") || ""
    });
  }

  setTimeoutFunctionToRefreshData = () => {
    this.props.onGetThermostatState(this.props.thermostatID);
    this.props.onGetCurrentTemperatureInside();
    this.props.onGetCurrentTemperatureOutside();
    this.fetchDataIntervalID = setTimeout(this.setTimeoutFunctionToRefreshData.bind(this), 60000);
  }
  
  componentWillUnmount = () => {
    clearTimeout(this.fetchDataIntervalID);
  }

  handleThermostatAutoState = (event) => {
    var desiredTemperature = this.state.desiredTemperature;
    var isAutoEnabled = this.state.isAutoEnabled;
    var setThermostateState;
    if(event.target.id === "desired-temperature") {
      desiredTemperature = document.getElementById("desired-temperature").value;
      localStorage.setItem("desiredTemperature", desiredTemperature);
      this.setState({
        desiredTemperature: desiredTemperature,
      });
    }
    else if(event.target.id === "thermostat-auto") {
      isAutoEnabled = !this.state.isAutoEnabled;
      localStorage.setItem("isAutoEnabled", isAutoEnabled);
      this.setState({
        isAutoEnabled: isAutoEnabled
      });
    }

    if(isAutoEnabled && desiredTemperature) {
      console.log(isAutoEnabled)
      if(this.props.currentTemperatureInside < desiredTemperature) {
        setThermostateState = this.THERMOSTAT_STATES.AUTO_HEAT;
      }
      else if(this.props.currentTemperatureInside > desiredTemperature) {
        if(this.props.currentTemperatureOutside < 0) {
          setThermostateState = this.THERMOSTAT_STATES.AUTO_STANDBY;
        }
        else {
          setThermostateState = this.THERMOSTAT_STATES.AUTO_COOL;
        }
      }
    }
    else if(!isAutoEnabled) {
      setThermostateState = this.THERMOSTAT_STATES.OFF;
    }
    else if(!desiredTemperature) {
      toast(this.TOAST_MESSAGE.AUTO_MODE_DESIRED_TEMP_NULL, this.toastSettings);
    }
    this.props.onChangeThermostatState(setThermostateState, this.props.thermostatID);    
  }

  handleThermostatStateChange = (event) => {
    // I have assumed that the user shall not be allowed to change the thermostat state
    // when AUTO Mode is switched on. The user shall be allowed to change the state 
    // upon switching off the Auto mode.
    if(!this.state.isAutoEnabled) {
      var stateValue = event.target.value;
      var setThermostateState;
  
      switch(stateValue) {
        case this.THERMOSTAT_STATES.COOL:
          if(this.props.currentTemperatureOutside >= 0) {
            setThermostateState = this.THERMOSTAT_STATES.COOL;
          }
          else {
            toast(this.TOAST_MESSAGE.COOLING, this.toastSettings);
          }
          break;
        case this.THERMOSTAT_STATES.HEAT:
          setThermostateState = this.THERMOSTAT_STATES.HEAT;
          break;
        case this.THERMOSTAT_STATES.OFF:
          setThermostateState = this.THERMOSTAT_STATES.OFF;
          break;
        default:
          setThermostateState = this.THERMOSTAT_STATES.OFF;
          break;
      }
      this.props.onChangeThermostatState(setThermostateState, this.props.thermostatID);
    }
    else {
      toast(this.TOAST_MESSAGE.SWITCHING_STATE_IN_AUTO_MODE, this.toastSettings);
    }
  }

  render() {
    return (
      <div className="thermostat-data-container">
        <h1>
          HOME AUTOMATION APP
        </h1>
        <div className="thermostat-readings-container">
          <div className="thermostat-state-container">
            <h4><strong>Mode</strong></h4>
            <div>{ this.props.thermostatState }</div>
          </div>
          <div className="thermostat-inside-temp-container">
            <h4><strong>Inside Temp</strong></h4>
            <div>{ parseFloat(this.props.currentTemperatureInside).toFixed(2) }<span>&#176;C</span></div>
          </div>
          <div className="thermostat-outside-temp-container">
            <h4><strong>Outside Temp</strong></h4>
            <div>{ parseFloat(this.props.currentTemperatureOutside).toFixed(2) }<span>&#176;C</span></div>
          </div>
        </div>
        <div className="second-row">
          <div className="auto-container">
            <div className='switch-field'>
              <div>
                <label htmlFor="thermostat-off">OFF</label> 
                <label htmlFor="thermostat-heat">HEAT</label>
                <label htmlFor="thermostat-cool">COOL</label>
              </div>
              <div>
                <input type="radio" id="thermostat-off" name="thermostat-state" value="off" 
                  checked={ ( this.props.thermostatState === this.THERMOSTAT_STATES.OFF ) 
                        || ( this.props.thermostatState === this.THERMOSTAT_STATES.AUTO_STANDBY )} 
                  onChange={ this.handleThermostatStateChange } />
                <input type="radio" id="thermostat-heat" name="thermostat-state" value="heat" 
                  checked={ (this.props.thermostatState === this.THERMOSTAT_STATES.HEAT) 
                        || ( this.props.thermostatState === this.THERMOSTAT_STATES.AUTO_HEAT)} 
                  onChange={ this.handleThermostatStateChange } />
                <input type="radio" id="thermostat-cool" name="thermostat-state" value="cool" 
                  checked={ (this.props.thermostatState === this.THERMOSTAT_STATES.COOL) 
                        || ( this.props.thermostatState === this.THERMOSTAT_STATES.AUTO_COOL)} 
                  onChange={ this.handleThermostatStateChange } />
              </div>
            </div>
          </div>
          <div className="desired-temperature-parent">
            <div className="desired-temperature-container">
              <h4><strong>Desired Temperature</strong></h4>
              <div>{ this.state.desiredTemperature }<span>&#176;C</span></div>
              <input id="desired-temperature" type="range" min={0} max={50} step={0.5} value = { this.state.desiredTemperature }
              onChange={ this.handleThermostatAutoState }></input>
            </div>
            <div>
              <span>AUTO </span>
              <label className="slider-container" htmlFor="thermostat-auto">
                <input type="checkbox" id="thermostat-auto" name="thermostat-auto-state" value="auto" checked={ this.state.isAutoEnabled }
                onChange={ this.handleThermostatAutoState } />
                <div className="slider-dot round"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    currentTemperatureInside: state.currentTemperatureInside,
    currentTemperatureOutside: state.currentTemperatureOutside,
    thermostatState: state.thermostatState,
    thermostatID: props.thermostatID
  };
}

const mapActionsToProps = {
  onGetThermostatState: getThermostatState,
  onChangeThermostatState: changeThermostatState,
  onGetCurrentTemperatureInside: getCurrentTemperatureInside,
  onGetCurrentTemperatureOutside: getCurrentTemperatureOutside
}

export default connect(mapStateToProps, mapActionsToProps)(Thermostat);
