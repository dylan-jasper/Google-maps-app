import React, { Component, Fragment } from "react";

class SideBar extends Component {
  triggerMarkerClick = venueName => {
    this.props.markers.forEach(marker => {
      if (marker.title === venueName) {
        window.google.maps.event.trigger(marker, "click");
      }
    });
  };

  render() {
    return (
      <Fragment>
        <div className="side-bar">
          <span
            aria-label="close"
            tabIndex="0"
            onClick={this.props.changeSideBar}
            className="btn-close"
          >
            &times;
          </span>
          <input
            aria-label="filter venues"
            type="text"
            value={this.props.query}
            onChange={e => {
              this.props.updateQuery(e.target.value);
            }}
            className="input"
            placeholder="Filter Venues..."
          />
          <ul>
            {this.props.venues.map(v => {
              return (
                <li
                  tabIndex="0"
                  role="link"
                  className="list-item"
                  key={v.venue.id}
                  onClick={() => this.triggerMarkerClick(v.venue.name)}
                >
                  {v.venue.name}
                </li>
              );
            })}
          </ul>
        </div>
      </Fragment>
    );
  }
}

export default SideBar;
