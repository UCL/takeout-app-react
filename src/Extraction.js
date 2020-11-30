import React from 'react';
import PropTypes from 'prop-types';

import 'date-fns';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import DateFnsUtils from '@date-io/date-fns';
import DescriptionIcon from '@material-ui/icons/Description';
import ErrorIcon from '@material-ui/icons/Error';
import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import InputLabel from '@material-ui/core/InputLabel';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./filterWorker";

import {ReportQueries} from './ReportQueries';

const styles = (theme) => ({
  input: {
    display: 'none'
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  table: {
    minWidth: 400,
  },
  error: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.error.light,
  },
  paper: {
    alignItems: 'center',
  },
  dialogButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(3)
  },
  dialogText: {
    paddingBottom: 0
  },
  list: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: theme.typography.body1.fontSize,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  }
});

const formatDate = (date) => {
  return date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
}

const convertJsonToCsv = (jsonarr) => {
  const headers = 'date,query\n';
  const csvbody = jsonarr.map((item) => `"${item.date}","${item.query}"`)
    .join('\n');
  return headers + csvbody;
}

const generateDownloadUrl = (filteredQueries) => {
  const csvContent = convertJsonToCsv(filteredQueries);
  const blob = new Blob([csvContent], {type: 'text/csv'});
  return URL.createObjectURL(blob);
}

class ExtractionComponent extends React.Component {

  state = {
      displayReport: false,
      totalsByDate: {},
      missingActivityJson: false,
      invalidFileName: false,
      disableSubmitButton: false,
      filteredQueries: [],
      success: false,
      loading: false,
      presentationDate: new Date()
  }

  filterWebWorker = (event) => {
    const file = event.target.files[0];
    const { presentationDate } = this.state;

    this.setState({loading: true});

    this.worker.postMessage({
        file,
        presentationDate
    });

    this.worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.success) {
        this.setState({
          success: true,
          filteredQueries: msg.result,
          displayReport: true
        });
      }
      this.setState({loading: false});
    }
  }

  componentDidMount = () => {
    this.worker = new Worker();
  }

  handleDateChange = (date) => {
    this.setState({presentationDate: date});
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
      filteredQueries,
      invalidFileName,
      loading,
      missingActivityJson,
      presentationDate,
      success
    } = this.state;

    const downloadUrl = generateDownloadUrl(filteredQueries);

    return (
      <React.Fragment>
        <Paper className={classes.paper}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom>
            Filter search queries from Google Takeout
          </Typography>
          <Typography
            variant="body1"
            align="left"
            gutterBottom>
            Once you have received the report file from Google, you can extract the health-related data
            using one of the options below. The extraction process is done locally on your browser.
            The app extracts the following data fields:
          </Typography>
          <List disablePadding={true} className={classes.list}>
            <ListItem>
              <ListItemText primary="Timestamp of the query" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Text of the query" />
            </ListItem>
          </List>
          <Typography
            variant="body1"
            align="left"
            gutterBottom>
            To filter the health-related data from the report downloaded from Google Takeout, click
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
          <div className={classes.wrapper}>
            <InputLabel htmlFor="presentation-date">Date of first presentation</InputLabel>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                id="presentation-date"
                variant="inline"
                format="dd/MM/yyyy"
                value={presentationDate}
                onChange={this.handleDateChange}
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.wrapper}>
            <Fab color="primary">
              {success ? <CheckIcon/> : <DescriptionIcon />}
            </Fab>
            {loading && <CircularProgress size={68} color="primary" className={classes.fabProgress} />}
          </div>
          <div>
            <input
              accept="application/zip, application/json"
              className={classes.input}
              id="takeout-input"
              type="file"
              // onChange={ (e) => this.filterQueries(e.target.files[0]) }
              onChange={this.filterWebWorker}
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
              Number of queries selected: {filteredQueries.length}
            </Typography>
            <Typography variant="body1" align="left" gutterBottom>
              Date of first presentation: {formatDate(presentationDate)}
            </Typography>
            <ReportQueries
              className={classes.paper}
              filteredQueries={filteredQueries}
            />
            <Typography variant="body1" align="left" gutterBottom style={{marginTop: `2em`}}>
              Clicking on "Download filtered queries" will generate a CSV file with the filtered
              queries.
            </Typography>
            <div>
              <Button
                href={downloadUrl}
                className={classes.submit}
                variant="contained"
                // download="test.csv"
              >
                Download filtered queries
              </Button>
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
