import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
  unmountComponentAtNode(div);
});

describe("USER NOT REGISTERED", () => {
  it("should render Register button", () => {
    const { getByTestId } = render(<App />);
    var uid = localStorage.getItem("thermostatID");
    if(uid === null) {
      expect(getByTestId(/register-button/i).textContent).toBe("Register")
    }
  });

  it("should not render Thermostat Component", () => {
    const { queryByTestId } = render(<App />);
    var uid = localStorage.getItem("thermostatID");
    if(uid === null) {
      expect(queryByTestId(/thermostat-component/i)).toBeNull();
    }
  });
});

describe("USER REGISTERED", () => {
  it("should not render Register button", () => {
    const { queryByTestId } = render(<App />);
    var uid = localStorage.getItem("thermostatID");
    if(uid !== null) {
      expect(queryByTestId(/register-button/i)).toBeNull();
    }
  });

  it("should render Thermostat Component", () => {
    const { queryByTestId } = render(<App />);
    var uid = localStorage.getItem("thermostatID");
    if(uid !== null) {
      expect(queryByTestId(/thermostat-component/i)).toBeTruthy();
    }
  });
});
