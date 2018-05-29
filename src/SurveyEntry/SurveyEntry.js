import React, { Component } from 'react';
import Auth from '../Auth';
import axios from 'axios';

import SurveyTableRow from './SurveyTableRow';

class SurveyEntry extends Component {
  constructor(props) {
    super(props);
    this.state = { comment: {} };

    this.handleCommentDelete = this.handleCommentDelete.bind(this);
    // this.deleteComment = this.deleteComment.bind(this);
    this.getComment = this.getComment.bind(this);
    this.auth = new Auth();
    this.url = 'https://marineplasticsdb.herokuapp.com/api/comments';
  }

  getComment() {
    // get the id of the comment by splitting the current path (which is stored in the props) by '/'
    let splitURL = (this.props.location.pathname).split('/');
    // the id is the last part of the path, so pop the last element of the splitURL array
    let entryID = splitURL.pop();
    // call DB to get entry with the same id
    axios.get(`${this.url}/${entryID}`)
    .then(res => {
      this.setState({ comment: res.data.comment });
    })
    .catch(err => {
      console.log(err);
    });
  }

  // once the component is on the page, gets the comment from the server
  componentDidMount() {
    this.getComment();
  }

  // not sure if this works, also no users have ability to delete data as of now.
  handleCommentDelete(id) {
    axios.delete(`${this.url}/${id}`)
    .then(res => {
      console.log('Comment deleted');
    })
    .catch(err => {
      console.error(err);
    });
  }

  // // in theory, deletes comment
  // deleteComment(e) {
  //   e.preventDefault();
  //   if (this.auth.getAccessToken() === this.state.comment.user_id) {
  //     let id = this.state.comment._id;
  //     this.handleCommentDelete(id);
  //     console.log('deleted');
  //     this.setState({ toRedirect: true  });
  //   } else {
  //     window.alert('Can only delete your own entries.');
  //   }
  // }

  render() {
    // initializes to null because when component mounts, there is no data yet
    let SRSRows = null;
    let ASRows = null;

    // if there is data (which is once the component mounts)
    if (this.state.comment.SRSData) {
      // for every type of trash, return a surveyTableRow component with the data
      SRSRows = this.state.comment.SRSData.map(type => {
        return(
          <SurveyTableRow
            key={type._id}
            name={type.name}
            fresh={type.fresh}
            weathered={type.weathered}
          />
        );
      });

      ASRows = this.state.comment.ASData.map(type => {
        return(
          <SurveyTableRow
            key={type._id}
            name={type.name}
            fresh={type.fresh}
            weathered={type.weathered}
          />
        );
      });
    }

    return (
      <div>
        <h2>{ this.state.comment.beach }: { this.state.comment.date }</h2>
        <div className="uk-card uk-card-default uk-card-body uk-width-1-3">
          <h3 className="uk-card-title">Team Information</h3>
          <p><strong>Team Leader:</strong> { this.state.comment.user }</p>
          <p><strong>Organization:</strong> { this.state.comment.org }</p>
          <p><strong>Email:</strong> { this.state.comment.email }</p>
        </div>
        <div className="uk-card uk-card-default uk-card-body uk-width-1-3">
          <h3 className="uk-card-title">Survey Area</h3>
          {
            this.state.comment.lat && this.state.comment.lon
            ? <p><strong>GPS Coordinates:</strong> { this.state.comment.lat.toFixed(2) }, { this.state.comment.lon.toFixed(2) }</p> : null
          }
          {
            this.state.comment.reason
            ? <p><strong>Reason for Location Choice:</strong> { this.state.comment.reason }</p> : null
          }
          {
            this.state.comment.st
            ? <p><strong>Substrate Type:</strong> { this.state.comment.st }</p> : null
          }
          {
            this.state.comment.slope
            ? <p><strong>Beach Slope:</strong> { this.state.comment.slope }</p> : null
          }
        </div>


        <p>
          <b>Nearest River Output ~ Name: </b>
          <i>{this.state.comment.nroName}</i>
          <b> Distance: </b>
          <i>{this.state.comment.nroDist}m</i>
        </p>
        <p>
          <b>Aspect: </b>
          <i>{this.state.comment.aspect}</i>
        </p>
        <p>
          <b>Last Tide and Height: </b>
          <i>{this.state.comment.lastTide}</i>
          <b> Next Tide and Height: </b>
          <i>{this.state.comment.nextTide}</i>
        </p>
        <p>
          <b>Wind Direction: </b>
          <i>{this.state.comment.windDir}</i>
        </p>
        <p>
          <b>Major Usage: </b>
          <i>{this.state.comment.majorUse}</i>
        </p>

        <h3> Basic Cleanup </h3>
        <p><b> Total Weight (in pounds): </b><i>{this.state.comment.weight}</i></p>
        <p><b> Number of People: </b><i>{this.state.comment.NumberOfPeople}</i></p>

        <h3>Surface Rib Scan Survey</h3>
        <table className="uk-table uk-table-striped">
          <thead>
            <tr>
              <th>Debris Type</th>
              <th>Amount Fresh</th>
              <th>Amount Weathered</th>
            </tr>
          </thead>
          <tbody>
            { SRSRows }
          </tbody>
        </table>

        <h3>Accumulation Survey</h3>
        <table className="uk-table uk-table-striped">
          <thead>
            <tr>
              <th>Debris Type</th>
              <th>Amount Fresh</th>
              <th>Amount Weathered</th>
            </tr>
          </thead>
          <tbody>
            { ASRows }
          </tbody>
        </table>
      </div>
    );
  }
}

export default SurveyEntry;
