import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import JSZip from 'jszip';
import './App.css';

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
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 400,
  }
});

const takeoutNameRe = (name) => { 
  return /takeout-20[1-2]\d[0-1]\d[0-3]\dT[0-2]\d[0-6]\d[0-6]\dZ-\d{3}\.zip/.test(name);
}

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      display_report: false,
      total_queries: 0,
      min_date: new Date(),
      total_by_date: {},
      missing_activity_json: false,
      invalid_file_name: false
    };
    this.extractAggregatesFromZip = this.extractAggregatesFromZip.bind(this);
  }
  
  async extractAggregatesFromZip(file) {
    
    const isValidTakeoutName = takeoutNameRe(file.name);
    
    this.setState({invalid_file_name: true});
    
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
          this.setState({missing_activity_json: true});
          console.log(err);
        });
      }, (err) => {console.log(err);});
      
      const minDate = parsed.reduce((min, item) => item.time < min ? item.time : min, parsed[0].time);
      
      const sumByDate = parsed.reduce(
        (acc, item) => ({ ...acc, [item['time'].substring(0,10)]: (acc[item['time'].substring(0,10)] || 0) + 1 }),
        {}
      );
      
      this.setState({
        total_queries: parsed.length,
        min_date: new Date(Date.parse(minDate)),
        total_by_date: sumByDate,
        display_report: true
      });
    } else {
      this.setState({display_report: false});
    }
    
  }
  
  render() {
    const { classes } = this.props;
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
            <Typography component="h1" variant="h4" align="center" gutterBottom>
            Extract aggregate data from Takeout
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary">
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
                <Button variant="outlined" component="span">
                  Select ZIP file
                </Button>
              </label>
            </div>
          </Paper>
          <Grow in={this.state.display_report}>
          <Paper className={classes.paper}>
            <Typography variant="body2" align="left">
              Total number of queries: {this.state.total_queries}
            </Typography>
            <Typography variant="body2" align="left">
              Min date: {this.state.min_date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}
            </Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Number of queries</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Object.keys(this.state.total_by_date).sort().map((key, idx = 0) => {
                    const date = new Date(Date.parse(key));
                    return (<TableRow key={++idx}>
                      <TableCell>{date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</TableCell>
                      <TableCell>{this.state.total_by_date[key]}</TableCell>
                    </TableRow>);  
                  })
                }
              </TableBody>
            </Table>
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
