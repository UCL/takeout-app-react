import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { Anchor } from './Anchor';


const styles = theme => ({
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
  },
  imgcardmedia: {
    paddingLeft: theme.spacing.unit * 6,
    paddingRight: theme.spacing.unit * 6,
    paddingBottom: theme.spacing.unit * 4,
  },
  paper: {
    marginBottom: theme.spacing.unit * 4,
  },
  buttonContainer: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
  }
});

const assets = {
  i2a: 'https://res.cloudinary.com/uclfmedia/image/upload/v1541776334/takeout-app-react/step2a.png',
  i2b: 'https://res.cloudinary.com/uclfmedia/image/upload/v1541776334/takeout-app-react/step2b.png',
  i2c: 'https://res.cloudinary.com/uclfmedia/image/upload/v1541776334/takeout-app-react/step2c.png',
  i2d: 'https://res.cloudinary.com/uclfmedia/image/upload/v1541776334/takeout-app-react/step2d.png',
  i2e: 'https://res.cloudinary.com/uclfmedia/image/upload/v1541776334/takeout-app-react/step2e.png',
  i2f: 'https://res.cloudinary.com/uclfmedia/image/upload/v1541776334/takeout-app-react/step2f.png',
  i2g: 'https://res.cloudinary.com/uclfmedia/image/upload/v1541776334/takeout-app-react/step2g.png'
}

class IntroductionComponent extends React.Component {

  render() {
    const { classes, tabCallback } = this.props;

    return(
      <React.Fragment>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Download your search logs from Google Takeout
          </Typography>
          <Typography variant="body1" gutterBottom>
            This app extracts anonymous aggregate data from search activity data logs from Google.
            The app runs locally on your browser and does not collect personal information.
          </Typography>
          <Typography variant="body1" gutterBottom>
            The search activity data can be obtained by following the steps described here below.
            Once you have downloaded the ZIP file from Google Takeout, you can continue with the
            next step to extract and calculate aggregate data.
          </Typography>
          <div className={classes.buttonContainer}>
            <Button variant="contained" component="span" onClick={(e) => tabCallback(e, 1)}>
              Next: Extract aggregate data
              <ChevronRight />
            </Button>
          </div>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step one: Log in to Google Takeout
          </Typography>
          <Typography variant="body1" gutterBottom>
            Visit <Anchor variant="primary" href="https://takeout.google.com">
            https:&#47;&#47;takeout.google.com</Anchor>. You might be asked to log in to your
            Google account.
          </Typography>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step two: Select and configure the service to export the data from
          </Typography>
          <Card>
            <CardContent>
              <Typography component="h3" variant="h6" align="left">
                Click on "Select None"
              </Typography>
              <Typography variant="body1" gutterBottom>
                By default, Google Takeout exports data from all the services in the list. Click
                on "Select None" to remove all items from the list.
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2a} />
          </Card>
          <Card>
            <CardContent>
              <Typography component="h3" variant="h6" align="left">
                Select "My Activity"
              </Typography>
              <Typography variant="body1" gutterBottom>
                Scroll down and toggle "My Activity".
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2b} />
          </Card>
          <Card>
            <CardContent>
              <Typography component="h3" variant="h6" align="left">
                Configure the data to download from "My Activity"
              </Typography>
              <Typography variant="body1" gutterBottom>
                Click on the menu "All Activity HTML format". You will presented with an option to
                select the activity data to download. Click on "Select specific activity data".
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2c} />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                A new menu titled "Activity data" will be displayed. Click on "Toggle all" to clear
                all the items from the list.
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2d} />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Select "Search" and click "OK" to confirm.
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2e} />
          </Card>
          <Card>
            <CardContent>
              <Typography component="h3" variant="h6" align="left">
                Configure the file format
              </Typography>
              <Typography variant="body1" gutterBottom>
                Next, click on the menu next to "My activity" and select "JSON". Then scroll down
                and click "Next".
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2f} />
          </Card>

          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step three: Choose how your archive will be delivered
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Select "Send download link via email"
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2g} />
          </Card>
          <Typography variant="body1" gutterBottom>
            The Google Takeout service usually takes a couple of minutes to generate the export
            file and send it to you via email. Follow the instructions in the email and save
            the zip file in your computer. Next step will be the calculation of aggregate data.
          </Typography>
          <div className={classes.buttonContainer}>
            <Button variant="contained" component="span" onClick={(e) => tabCallback(e, 1)}>
              Next: Extract aggregate data
              <ChevronRight />
            </Button>
          </div>
        </Paper>
      </React.Fragment>
    );
  }

}

IntroductionComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  tabCallback: PropTypes.func.isRequired,
};

export const Introduction = withStyles(styles)(IntroductionComponent);
