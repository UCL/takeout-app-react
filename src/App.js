import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorIcon from '@material-ui/icons/Error';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import JSZip from 'jszip';

import {ReportAggregates} from './ReportAggregates';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = (theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
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

class App extends Component {
  
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
  
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rows_per_page: event.target.value });
  };
  
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
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
        <AppBar position="absolute" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Project name
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom>
              Extract aggregate data from Takeout
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="textSecondary">
              Quickly build an effective pricing table for your potential customers with this layout.
              It&apos;s built with default Material-UI components with little customization.
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
        </main>
      </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
