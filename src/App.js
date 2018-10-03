import React, { Component } from 'react';
import './App.css';
import { config } from './config'


class App extends Component {
  state = {
    venues: ['text']
  }
 
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
    // Asynchronously load the Google Maps script
    loadJS()
}

getVenues = () => {
    fetch("https://api.foursquare.com/v2/venues/explore?client_id=CQ05ERMDJAWYWLX0UNC3R5B1XB43G3C0YUMRWD0PVZQI4KAO&client_secret=3ZBI3S4FNTZH2R4YTPYUG4CIWIX05APWJVNLCRETVIHP4D33&v=20180323&limit=15&near=Seattle,WA&query=trending")
    .then((response)=> {
        // Code for handling API response
        return response.json()
    }).then((data)=>{
      const venues = data.response.groups[0].items
      this.setState({
        venues
      })
    })
    .catch((err)=> {
        // Code for handling errors
        console.log('error: ', err)
    });
}

  componentDidMount() {
  this.getVenues()
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
