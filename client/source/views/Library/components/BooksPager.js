import * as React from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

class Pager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    this.setState({ current: pageNumber });
    this.props.onChangePage(pageNumber);
  }

  render() {
    return (
      <div>
        <Pagination
          onChange={this.handlePageChange}
          current={this.state.current}
          total={this.props.books}
        />
      </div>
    );
  }
}

export default Pager;
