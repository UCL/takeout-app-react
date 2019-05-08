import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
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
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: theme.typography.body1.fontSize,
  },
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
            If you are signed in to a Google account, Google stores your web searches and stores
            them in files accessible to you. Access is done by going to Google Takeout
          </Typography>
          <Typography variant="body1" gutterBottom>
            <Anchor variant="primary" href="https://takeout.google.com">
              https:&#47;&#47;takeout.google.com
            </Anchor>
          </Typography>
          <Typography variant="body1" gutterBottom>
            where you can download a file that lists each query you have made and the time that you
            made it. Of course, there may be queries you consider private. However, we do not
            collect specific queries. We are only interested in the number of queries you made
            each day. We do not collect any information about what these queries were. The only
            data we receive is a date, e.g. January 1, 2018, together with a number indicating the
            number of queries made to Google on that day. No further information is collected.
          </Typography>
          <Typography variant="body1" gutterBottom>
            To obtain this information, we request that you (i) download your activity file from
            Google Takeout (we will explain how shortly), (ii) go to our
            website <Anchor variant="primary" href="https://takeout.cs.ucl.ac.uk">
              https:&#47;&#47;takeout.cs.ucl.ac.uk
            </Anchor>.
             We will then ask you for the Google Activity file and will process the file on your
             computer. In other words, your Google Activity file will NOT be uploaded to us.
             Instead, a javascript program running on your computer will only send us the dates and
             number of searches made on these dates. Your private Google Activity file will never
             leave your computer and the data sent to us will not include any information on what
             searches you made.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please now follow the steps below:
          </Typography>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 1: Log in to Google Takeout
          </Typography>
          <Typography variant="body1" gutterBottom>
            Visit <Anchor variant="primary" href="https://takeout.google.com">
            https:&#47;&#47;takeout.google.com</Anchor>. You might be asked to log in to your
            Google account.
          </Typography>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 2
          </Typography>
          <Typography variant="body1" gutterBottom>
            Click on "Select None"
          </Typography>
          <Card>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2a} />
          </Card>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 3
          </Typography>
          <Typography variant="body1" gutterBottom>
            Scroll down and select “My Activity” by clicking on the button on the right of the row.
          </Typography>
          <Card>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2b} />
          </Card>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 4
          </Typography>
          <Typography variant="body1" gutterBottom>
            Click on the menu "All Activity HTML format". You will be presented with an option
            to select the activity data to download. Click on "Select specific activity data".
          </Typography>
          <Card>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2c} />
          </Card>
          <Typography variant="body1" gutterBottom>
            A new menu titled "Activity data" will be displayed. Click on "Toggle all" to clear
            all the items from the list.
          </Typography>
          <Card>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2d} />
          </Card>
          <Typography variant="body1" gutterBottom>
            Select "Search" and click "OK" to confirm.
          </Typography>
          <Card>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2e} />
          </Card>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 5
          </Typography>
          <Typography variant="body1" gutterBottom>
            Next, click on the menu next to "My activity" and select "JSON".
          </Typography>
          <Card>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2f} />
          </Card>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 6
          </Typography>
          <Typography variant="body1" gutterBottom>
            Then scroll down and click "Next".
          </Typography>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 7
          </Typography>
          <Typography variant="body1" gutterBottom>
            Under “Delivery Method” select "Send download link via email".
          </Typography>
          <Card>
            <CardMedia className={classes.imgcardmedia} component="img" src={assets.i2g} />
          </Card>
          <Divider className={classes.divider} />
          <Typography component="h2" variant="h5" align="left" gutterBottom>
            Step 8
          </Typography>
          <Typography variant="body1" gutterBottom>
            Click on the “Create Archive” button.
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="body1" gutterBottom>
            The Google Takeout service usually takes a couple of minutes to generate the report.
            You will then receive an email containing a link to download the report file.
            Follow the instructions in the email and save the zip file in your computer (browsers
            usually save files
            in <span className={classes.mono}>"&#47;Users&#47;your user name&#47;Downloads"</span>
            in Mac OS X or <span className={classes.mono}>"C:&#92;your name&#92;downloads"</span>
            in Windows. Next step will be the calculation of aggregate data.
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
