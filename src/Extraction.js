import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import JSZip from 'jszip';

import {ReportAggregates} from './ReportAggregates';


const styles = (theme) => ({
  input: {
    display: 'none'
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 400,
  },
  error: {
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.palette.error.light,
  }
});

const takeoutNameRe = (name) => {
  return /takeout-20[1-2]\d[0-1]\d[0-3]\dT[0-2]\d[0-6]\d[0-6]\dZ-\d{3}\.zip/.test(name);
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
}

class ExtractionComponent extends React.Component {

  state = {
      displayReport: false,
      totalQueries: 0,
      startDate: new Date(),
      totalsByDate: {},
      missingActivityJson: false,
      invalidFileName: false
  }

  async extractAggregatesFromZip(file) {

    const isValidTakeoutName = takeoutNameRe(file.name);

    if (isValidTakeoutName) {
      const parsed = await JSZip.loadAsync(file)
      .then( (zip) => {
        const zipobject = zip.file('Takeout/My Activity/Search/MyActivity.json');

        return zipobject.async("string")
        .then(JSON.parse)
        .then((data) => {
          return data.filter(
            (item) => { return item.title.startsWith('Searched for ') }
          );
        })
        .catch((err) => {
          this.setState({missingActivityJson: true});
          console.log(err);
        });
      }, (err) => {console.log(err);});

      const minDate = parsed.reduce((min, p) => p.time < min ? p.time : min, parsed[0].time);

      const sumByDate = parsed.reduce(
        (acc, item) => (
          { ...acc, [item['time'].substring(0,10)]: (acc[item['time'].substring(0,10)] || 0) + 1 }
        ),
        {}
      );

      this.setState({
        totalQueries: parsed.length,
        startDate: new Date(Date.parse(minDate)),
        totalsByDate: sumByDate,
        displayReport: true
      });
    } else {
      this.setState({
        displayReport: false,
        invalidFileName: true
      });
    }

  }

  render() {

    const { classes } = this.props;

    const {
      displayReport,
      invalidFileName,
      missingActivityJson,
      startDate,
      totalQueries,
      totalsByDate
    } = this.state;

    return (
      <React.Fragment>
        <Paper className={classes.paper}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom>
            Extract aggregate data from Takeout
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textSecondary">
            A paragraph explaining users in lay terms what the app does, that the process is run
            locally on the browser and the only data that will be submitted is anonymous and
            users will be able to review the data before clicking submit.
          </Typography>
          <div>
            <input
              accept="application/zip"
              className={classes.input}
              id="zipfile-input"
              type="file"
              onChange={ (e) => this.extractAggregatesFromZip(e.target.files[0]) }
              />
            <label htmlFor="zipfile-input">
              <Button className={classes.submit} variant="outlined" component="span">
                Select ZIP file
              </Button>
            </label>
          </div>
          {
            (invalidFileName || missingActivityJson) &&

            <SnackbarContent
              className={classes.error}
              message={
                <span>
                  <ErrorIcon /> Invalid file
                  </span>
              } />
          }
        </Paper>
        <Grow in={displayReport}>

          <Paper className={classes.paper}>
            <Typography variant="body2" align="left">
              Total number of queries: {totalQueries}
            </Typography>
            <Typography variant="body2" align="left">
              Start date: {formatDate(startDate)}
            </Typography>
            <ReportAggregates
              className={classes.paper}
              totalsByDate={totalsByDate}
              />

          </Paper>
        </Grow>
      </React.Fragment>
    );
  }

}

ExtractionComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export const Extraction = withStyles(styles)(ExtractionComponent);
