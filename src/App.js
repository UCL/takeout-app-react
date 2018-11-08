import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import {Extraction} from './Extraction';
import {Introduction} from './Introduction';

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
    marginBottom: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
});

class App extends Component {

  state = {
      tabIndex: 0
  }

  handleTabChange = (event, value) => {
    this.setState({ tabIndex: value})
  };

  render() {
    const { classes } = this.props;

    const {
      tabIndex
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
        <AppBar position="absolute" color="default" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Google Search Counter
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.layout}>
          <Paper square className={classes.tab}>
            <Tabs value={tabIndex} indicatorColor="primary" onChange={this.handleTabChange} centered>
              <Tab label="Introduction" />
              <Tab label="Extract data" />
            </Tabs>
          </Paper>
          {tabIndex === 0 &&
            <Introduction classes={{paper: classes.paper}} tabCallback={this.handleTabChange} />}
          {tabIndex === 1 && <Extraction classes={{paper: classes.paper}} />}
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
