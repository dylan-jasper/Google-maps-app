import React, { Component } from 'react';
import './App.css';
import { config } from './config'


class App extends Component {


  // create instance of map 
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }

  renderMap = () => {
   // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS()
}

  componentDidMount() {
  this.renderMap()

  }


  render() {
    return (
      <div id="map" className="App">
      </div>
    );
  }
}


// source: https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
function loadJS() {
  var API = config.key
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=initMap`;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
}

export default App;
