import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import JSZip from 'jszip';
import './App.css';

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
  }
});

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      zipfile: undefined
    };
    this.extractAggregatesFromZip = this.extractAggregatesFromZip.bind(this);
  }
  
  async extractAggregatesFromZip(file) {
    this.setState({zipfile: file.name});
    
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
                        console.log(err);
                      });
    }, (err) => {console.log(err);});
    console.log(parsed[124]);
  }
  
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
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
            <Typography variant="body1" align="center" color="textSecondary">
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
            <Divider />
            {this.state.zipfile}
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
