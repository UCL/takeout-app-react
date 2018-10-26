import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import withStyles from '@material-ui/core/styles/withStyles';

import {TablePaginationActionsWrapped} from './TablePaginationActions';

const styles = theme => ({
  table: {
    minWidth: 400,
  }
});

class ReportAggregatesComponent extends React.Component {
  
  state = {
    page: 0,
    rowsPerPage: 10
  }
  
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  
  formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
  }
  
  render() {
    
    const { classes, totalsByDate } = this.props;
    
    const { page, rowsPerPage } = this.state;
    
    const totalCount = Object.keys(totalsByDate).length;
    
    return (
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Number of queries</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object.keys(totalsByDate)
              .sort()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((key, idx = 0) => {
                const date = new Date(Date.parse(key));
                return (<TableRow key={++idx}>
                  <TableCell>{this.formatDate(date)}</TableCell>
                  <TableCell>{totalsByDate[key]}</TableCell>
                </TableRow>);  
              })
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={2}
                count={totalCount} 
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                ActionsComponent={TablePaginationActionsWrapped} 
                />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
    
  }
  
}

ReportAggregatesComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  totalsByDate: PropTypes.object.isRequired
};

export const ReportAggregates = withStyles(styles, { withTheme: true })(
  ReportAggregatesComponent
);
