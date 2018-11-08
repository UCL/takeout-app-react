import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		color: 'inherit',
		textDecoration: 'inherit',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
	primary: {
		color: theme.palette.primary.main,
	},
});

const AnchorComponent = (props) => {

	const { children, classes, className, variant, ...other } = props;

	return (
		<a
      className={classNames(
        classes.root,
        {
          [classes.primary]: variant === 'primary',
        },
        className,
      )}
      {...other}
    >
      {children}
		</a>
	);

};

AnchorComponent.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary']),
};

export const Anchor = withStyles(styles)(AnchorComponent);
