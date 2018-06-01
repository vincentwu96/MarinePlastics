import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';

import { PieChart } from 'react-easy-chart';

// to get the pin styles
import '../Map/Map.css';

import Chart from '../Location/BarChart.jsx';

import { sumDebrisTypes } from '../_helpers/ChartHelpers'

class Location extends Component {
  constructor(props) {
    super(props);
    // the data is passed from ../Home/Home.js from the Link
    // this.props.location.state is where the Link passes the state to
    this.state = {
      data: this.props.location.state.data || {},
    }
  }

  render() {
    // for every entry, returns a link to the entry page
    // text is the date cleanup happened
    let entries = this.state.data.entries.map((entry) => {
      return(
        <li key={entry._id}>
          <Link to={{ pathname: `/entry/${entry._id}` }}>
            { entry.date }
          </Link>
        </li>
      );
    });

    console.log(sumDebrisTypes(this.state.data));

    let checkRange = (num, isLat) => {
     let isInRange = false;
     if (isLat && num < 91 && num > -91) isInRange = true;
     else if (!isLat && num < 181 && num > -181) isInRange = true;
     return isInRange;
   }

    // the marker for the location on the map
    const CustomMarker = ({ name }) => <div className="custom-marker"><p>{ name }</p></div>;
    return(
      <div>
        <h1>{ this.state.data.name }</h1>
        <div className="uk-grid">
          <div>
            {
              this.state.data.lat && this.state.data.lon && checkRange(this.state.data.lat, true) && checkRange(this.state.data.lon, false) ?
              (<div style={{height: '500px', width: '500px'}} className="uk-card uk-card-default uk-card-body">
                <GoogleMapReact
                  defaultCenter={{
                    lat: this.state.data.lat,
                    lng: this.state.data.lon,
                  }}
                  defaultZoom={13}
                  bootstrapURLKeys={{
                    key: ['AIzaSyC0KMFMCzYY0TZKQSSGyJ7gDW6dfBIDIDA']
                  }}
                >
                  <CustomMarker
                    lat={ this.state.data.lat }
                    lng={ this.state.data.lon }
                    name={ this.state.data.name }
                  />
                </GoogleMapReact>
              </div>) : null
            }

          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body">
              <h3 className="uk-card-title">Survey Entries</h3>
              <ul>
                { entries }
              </ul>
            </div><br />
              <div className="App-header">
              <h3>Surface Rib Scan</h3>
              </div>
              <div className="App-chart-container">
                <Chart
                  data={this.state.data}
                  isSRS={true}
                />

              </div>
            </div>
            </div><br />
              <div className="App-header">
              <h3>Accumulation Sweep</h3>
              </div>
              <div className="App-chart-container">
                <Chart
                  data={this.state.data}
                  isSRS={false}
                />

              </div>
            </div>
    );
  }
}

export default Location;
