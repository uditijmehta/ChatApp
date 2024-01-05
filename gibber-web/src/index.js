import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga';

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

export const GAevent = ({ id, name, value }) => {
  ReactGA.event({       
      category: 'Web Vitals',  // Required
      action: name,       // Required
      label: id,       
      value: value,       
      nonInteraction: false     
  });   
}

reportWebVitals(GAevent);
