import React, { Component, Fragment } from "react";

class SideBar extends Component {
  triggerMarkerClick = venueName => {
    this.props.markers.map(marker => {
      if (marker.title === venueName) {
        window.google.maps.event.trigger(marker, "click");
      }
    });
  };

  render() {
    return (
      <Fragment>
        <div className="side-bar">
          <span onClick={this.props.changeSideBar} className="btn-close">
            &times;
          </span>
          <input
            type="text"
            value={this.props.query}
            onChange={e => {
              this.props.updateQuery(e.target.value);
            }}
            className="input"
            placeholder="Filter Venues..."
          />
          <ul>
            {this.props.venues.map(v => (
              <li
                className="list-item"
                key={v.venue.id}
                onClick={() => this.triggerMarkerClick(v.venue.name)}
              >
                {v.venue.name}
              </li>
            ))}
          </ul>
        </div>
      </Fragment>
    );
  }
}

export default SideBar;
