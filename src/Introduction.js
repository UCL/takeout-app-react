import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
  imgcard: {
    paddingLeft: theme.spacing.unit * 6,
    paddingRight: theme.spacing.unit * 6,
  }
});

class IntroductionComponent extends React.Component {

  render() {
    const { classes } = this.props;

    return(
      <React.Fragment>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Download your search logs from Google Takeout
          </Typography>
          <Typography variant="body1" gutterBottom>
            Paragraph explaining the whole process
          </Typography>
          <Card>
            <CardMedia component="video" src="steps.mp4" type="video/mp4" controls />
          </Card>
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
              <Typography variant="body1" gutterBottom>
                By default, Google Takeout exports data from all the services in the list. Click
                on "Select None" to remove all items from the list.
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcard} component="img" src="step2a.png" />
          </Card>
          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Scroll down and toggle "My Activity".
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcard} component="img" src="step2b.png" />
          </Card>
          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Click on the menu "All Activity HTML format". You will presented with an option to
                select the activity data to download. Click on "Select specific activity data".
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcard} component="img" src="step2c.png" />
          </Card>
          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                A new menu titled "Activity data" will be displayed. Click on "Toggle all" to clear
                all the items from the list.
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcard} component="img" src="step2d.png" />
          </Card>
          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Select "Search" and click "OK" to confirm.
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcard} component="img" src="step2e.png" />
          </Card>
          <Card>
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Next, click on the menu next to "My activity" and select "JSON". Then scroll down
                and click "Next".
              </Typography>
            </CardContent>
            <CardMedia className={classes.imgcard} component="img" src="step2f.png" />
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
            <CardMedia className={classes.imgcard} component="img" src="step2g.png" />
          </Card>
        </Paper>
      </React.Fragment>
    );
  }

}

IntroductionComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  tabCallback: PropTypes.object.isRequired,
};

export const Introduction = withStyles(styles)(IntroductionComponent);
