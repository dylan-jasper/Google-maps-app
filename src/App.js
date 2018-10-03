import React, { Component, Fragment } from "react";
import "./App.css";
import { config } from "./config";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

class App extends Component {
  state = {
    venues: [],
    markers: [],
    sidebar: true
  };

  // create instance of map
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 47.6062, lng: -122.332 },
      zoom: 10
    });
    // create info window
    var infowindow = new window.google.maps.InfoWindow({
      content: null
    });
    // create markers array
    var markers = [];
    // display list of markers from venues array in state
    this.state.venues.map(v => {
      // get position of each venue
      const pos = { lat: v.venue.location.lat, lng: v.venue.location.lng };
      // create marker and assisgn position and map
      const marker = new window.google.maps.Marker({
        position: pos,
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: v.venue.name
      });

      const content = `${v.venue.name} <br> 
        ${v.venue.location.address} <br>
          ${v.venue.location.city}, ${v.venue.location.state} 
          ${v.venue.location.postalCode}`;

      // update marker content

      infowindow.setContent(content);
      // add listener for marker click event
      marker.addListener("click", function() {
        // add content to infowindow
        infowindow.open(map, marker);
        // marker animation - source: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 750);
        }
      });
      markers.push(marker);
      this.setState({ markers });
    });
  };

  renderMap = () => {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script
    loadJS();
  };

  getVenues = () => {
    fetch(
      "https://api.foursquare.com/v2/venues/explore?client_id=CQ05ERMDJAWYWLX0UNC3R5B1XB43G3C0YUMRWD0PVZQI4KAO&client_secret=3ZBI3S4FNTZH2R4YTPYUG4CIWIX05APWJVNLCRETVIHP4D33&v=20180323&limit=15&near=Seattle,WA&query=trending"
    )
      .then(response => {
        // Code for handling API response
        return response.json();
      })
      .then(data => {
        // Code for setting state with venues
        const venues = data.response.groups[0].items;
        this.setState(
          {
            venues
          },
          this.renderMap()
        );
      })
      .catch(err => {
        // Code for handling errors
        console.log("error: ", err);
      });
  };

  componentDidMount() {
    this.getVenues();
  }

  // click event for sidebar change
  changeSideBar = () => {
    this.setState({
      sidebar: !this.state.sidebar
    });
  };

  // click event for menu in header

  render() {
    return (
      <Fragment>
        <Header changeSideBar={this.changeSideBar} />
        {this.state.sidebar && <SideBar changeSideBar={this.changeSideBar} />}
        <div id="map" className="App" />
      </Fragment>
    );
  }
}

// source: https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
function loadJS() {
  var API = config.key;
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=initMap`;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
}

export default App;
