import React, { Component } from 'react';
import './App.css';
import Thermostat from './Thermostat';
import { Transition } from 'react-transition-group';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thermostatID: null
    }
    this.uuidHash = null;
  }

  componentDidMount() {
    this.uuidHash = localStorage.getItem("thermostatID") || null;
    if(this.uuidHash) {
      this.setState({thermostatID: this.uuidHash});
    }
  }

  registerThermostat = () => {
    fetch('https://api-staging.paritygo.com/sensors/api/thermostat/register/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      localStorage.setItem("thermostatID", data.uid_hash);
      return data.uid_hash;
    }).then((uid_hash) => this.setState({ thermostatID: uid_hash }));
  }

  render() {
    return (
      <div className="App">
        <ToastContainer />
        { this.state.thermostatID !== null ? 
          <Transition appear={ true } timeout={ 3000 } >
            <Thermostat data-testid="thermostat-component" thermostatID = { this.state.thermostatID } />
          </Transition> : 
          <div>
            <header>
              Welcome to Home Automation App
            </header>
            <button data-testid="register-button" onClick = { this.registerThermostat } >Register</button>
          </div>
        }
      </div>
    );
  }
}

export default App;