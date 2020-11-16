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

class ReportQueriesComponent extends React.Component {

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

    const { classes, filteredQueries } = this.props;

    const { page, rowsPerPage } = this.state;

    return (
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Search query</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              filteredQueries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, idx = 0) => {
                const date = new Date(Date.parse(item.date));
                return (
                  <TableRow key={++idx}>
                    <TableCell>{this.formatDate(date)}</TableCell>
                    <TableCell>{item.query}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={2}
                count={filteredQueries.length}
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

ReportQueriesComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  filteredQueries: PropTypes.array.isRequired
}

export const ReportQueries = withStyles(styles, { withTheme: true }) (
  ReportQueriesComponent
);
