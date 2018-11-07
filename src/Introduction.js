import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = (theme) => {

}

class IntroductionComponent extends React.Component {

  render() {
    const { classes } = this.props;

    return(
      <React.Fragment>
        <Paper className={classes.paper}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom>
            Download your search logs from Google Takeout
          </Typography>
        </Paper>
      </React.Fragment>
    );
  }

}

export const Introduction = withStyles(styles)(IntroductionComponent);
