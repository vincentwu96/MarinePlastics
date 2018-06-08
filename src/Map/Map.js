import React, { Component } from 'react';
import ReactDOM from "react-dom";
import axios from 'axios';
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";


class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
    this.pollInterval = null;
    this.url = 'https://marineplasticsdb.herokuapp.com/api/comments';
  }

  loadCommentsFromServer() {
    axios.get(this.url)
      .then(res => {
        this.setState({ data: res.data });
      })
  }

  componentDidMount() {
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadCommentsFromServer, 2000)
    }
  }

  //when incorporating into another project
  //(with react-router for instance),
  //this will prevent error messages every 2 seconds
  //once the SurveyBox is unmounted
  componentWillUnmount() {
    // eslint-disable-next-line
    this.pollInterval && clearInterval(this.pollInterval);
    this.pollInterval = null;
  }
  render() {
      const GoogleMapsMarkers= this.state.data.map((marker, index)=> {
        return(
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lon }}
        />
      )
    })
    const MapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 36.976652, lng: -121.932416 }}
    >
    {GoogleMapsMarkers}
    </GoogleMap>
    ));
    return (
      <div>
        <MapComponent
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC0KMFMCzYY0TZKQSSGyJ7gDW6dfBIDIDA"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `600px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          
        />
      </div>
    )
  }
}

export default Map;