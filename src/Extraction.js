import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogTitle';
import ErrorIcon from '@material-ui/icons/Error';
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  table: {
    minWidth: 400,
  },
  error: {
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.palette.error.light,
  },
  paper: {
    alignItems: 'center',
  },
  dialogButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing.unit * 3
  },
  dialogText: {
    paddingBottom: 0
  },
  list: {
    width: '100%',
    marginBottom: theme.spacing.unit
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: theme.typography.body1.fontSize,
  },
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
      invalidFileName: false,
      isSubmitSuccess: false,
      openSubmitDialog: false,
      disableSubmitButton: false
  }

  async extractAggregates(file) {

    if (file.type === 'application/json') {
      this.extractAggregatesFromJson(file);
    } else if (file.type === 'application/zip') {
      this.extractAggregatesFromZip(file);
    } else {
      this.setState({
        invalidFileName: true
      });
    }

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

  async extractAggregatesFromJson(file) {
    const reader = new FileReader();

    reader.onload = event => {
      const infile = event.target.result;

      const parsed = JSON.parse(infile).filter(
        (item) => { return item.title.startsWith('Searched for ') }
      );

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
    }

    reader.readAsText(file);

  }

  submitData = async () => {
    const data = {
      totalQueries: this.state.totalQueries,
      startDate: this.state.startDate,
      totalsByDate: this.state.totalsByDate
    };
    const res = await fetch(process.env.REACT_APP_API_HOST + '/takeout/submit', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.setState({
      isSubmitSuccess: res.ok,
      openSubmitDialog: true,
      disableSubmitButton: true
    });
  }

  closeDialog = () => {
    this.setState({
      openSubmitDialog: false
    });
  }

  render() {

    const { classes } = this.props;

    const {
      displayReport,
      disableSubmitButton,
      invalidFileName,
      isSubmitSuccess,
      missingActivityJson,
      openSubmitDialog,
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
            Extract aggregate data from Google Takeout
          </Typography>
          <Typography
            variant="body1"
            align="left"
            gutterBottom>
            Once you have received the report file from Google, you can extract the aggregate data
            using one of the options below. The extraction process is done locally on your browser
            and no data is sent to our servers until you click "Send aggregate data". The app does
            not collect any text from the search logs. The app extracts the following anonymous
            values:
          </Typography>
          <List disablePadding={true} className={classes.list}>
            <ListItem>
              <ListItemText primary="Total number of queries" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Date of first query in report" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Number of queries grouped by date" />
            </ListItem>
          </List>
          <Typography
            variant="body1"
            align="left"
            gutterBottom>
            To extract the aggregate data from the report downloaded from Google Takeout, click
            "Select Takeout file". The report file could be found by default
            in <span className={classes.mono}>"/Users/your user name/Downloads"</span> in Mac OS X
            or <span className={classes.mono}>"C:\your name\downloads"</span> in Windows, and will
            be either: (i) a ZIP file with the
            name <span className={classes.mono}>"takeout-yyyymmddThhmmssZ-001.zip"</span>
            with <span className={classes.mono}>"yyyymmddThhmmssZ"</span> specifying the date and
            time of generation of the report file, or (ii) if your computer uncompressed the file
            automatically, select the file <span className={classes.mono}>"MyActivity.json"</span>
            in the folder <span className={classes.mono}>"Takeout/My Activity/Search"</span> in Mac
            OS X and <span className={classes.mono}>"Takeout\My Activity\Search"</span> in Windows.
          </Typography>
          <div>
            <input
              accept="application/zip, application/json"
              className={classes.input}
              id="takeout-input"
              type="file"
              onChange={ (e) => this.extractAggregates(e.target.files[0]) }
              />
            <label htmlFor="takeout-input">
              <Button className={classes.submit} variant="contained" component="span">
                Select Takeout file
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
            <Typography variant="h5" component="h2" gutterBottom>
              Report
            </Typography>
            <Typography variant="body1" align="left">
              Total number of queries: {totalQueries}
            </Typography>
            <Typography variant="body1" align="left" gutterBottom>
              Start date: {formatDate(startDate)}
            </Typography>
            <ReportAggregates
              className={classes.paper}
              totalsByDate={totalsByDate}
              />
            <Typography variant="body1" align="left" gutterBottom style={{marginTop: `2em`}}>
              Clicking on "Send aggregate data" will upload this report for processing. Please
              note that no personal data, or location is collected. The information collected by
              this service is anonymous.
            </Typography>
            <div>
              <Button
                onClick={this.submitData}
                disabled={disableSubmitButton}
                className={classes.submit}
                variant="contained"
                component="span">
                Send aggregate data
              </Button>
              <Dialog open={openSubmitDialog}>
                <DialogContent className={classes.dialogtext}>
                  <DialogContentText>
                    {
                      isSubmitSuccess
                      ? 'Your Takeout data was uploaded successfully'
                      : 'Upload failed. Please try again later'
                    }
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={this.closeDialog}
                    className={classes.dialogButton}
                    variant="contained"
                    component="span">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
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
