import React, { Component, Fragment } from "react";
import "./App.css";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

class App extends Component {
  state = {
    venues: [],
    filteredVenues: [],
    markers: [],
    sidebar: true,
    query: ""
  };

  // create instance of map
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 47.6062, lng: -122.332 },
      zoom: 10
    });

    // create markers array
    const markers = [];
    // create info window
    const infowindow = new window.google.maps.InfoWindow();
    // display list of markers from venues array in state
    this.state.venues.forEach(v => {
      // get position of each venue
      const pos = { lat: v.venue.location.lat, lng: v.venue.location.lng };
      // create marker and assisgn position and map
      const marker = new window.google.maps.Marker({
        position: pos,
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: v.venue.name
      });

      let contentString = `
      ${v.venue.name}
      <br>
      ${
        v.venue.location.address
          ? v.venue.location.address
          : "Address not found"
      }
        <br>
        ${v.venue.location.city}, ${v.venue.location.state}
        ${v.venue.location.postalCode}`;

      // add listener for marker click event
      marker.addListener("click", function() {
        // update marker content
        infowindow.setContent(contentString);
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
            venues: venues,
            filteredVenues: venues
          },
          this.renderMap()
        );
      })
      .catch(err => {
        // Code for handling fetch errors
        console.log("Error: ", err);
        alert("Error: Foursquare API failed to load");
      });
  };
  // Handle authentication error with the Google Maps API
  gm_authFailure() {
    window.alert("Google Maps authentication error!");
  }

  componentDidMount() {
    // Bind the gm_authFailure function to the window context
    window.gm_authFailure = this.gm_authFailure;

    this.getVenues();
  }

  // click event for sidebar change
  changeSideBar = () => {
    this.setState({
      sidebar: !this.state.sidebar
    });
  };

  updateQuery = query => {
    if (query) {
      this.setState({ query: query });
      this.filterVenues(query);
    } else {
      this.setState({ query: "" });
      this.setState({ filteredVenues: this.state.venues });
      this.state.markers.forEach(m => m.setVisible(true));
    }
  };

  // Filter displayed markers and items
  filterVenues = query => {
    this.setState({
      filteredVenues: this.state.venues.filter(v => {
        return v.venue.name.toLowerCase().includes(query.toLowerCase());
      })
    });
    this.state.markers.forEach(m => {
      m.title.toLowerCase().includes(query.toLowerCase())
        ? m.setVisible(true)
        : m.setVisible(false);
    });
  };

  render() {
    return (
      <Fragment>
        <Header changeSideBar={this.changeSideBar} />
        {this.state.sidebar && (
          <SideBar
            changeSideBar={this.changeSideBar}
            venues={this.state.filteredVenues}
            query={this.state.query}
            updateQuery={this.updateQuery}
            markers={this.state.markers}
          />
        )}
        <main>
          <div id="map" className="App" />
        </main>
      </Fragment>
    );
  }
}

// source: https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
function loadJS() {
  var API = "AIzaSyDWh_B0TV_SGragJUkIYYaWyZAghX0VIk4";
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=initMap`;
  script.async = true;
  script.onerror = function() {
    alert("Error Google Maps API failed to load. \n" + this.src); // Error loading https://example.com/404.js
  };
  ref.parentNode.insertBefore(script, ref);
}

export default App;
