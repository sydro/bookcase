import * as React from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { Grid, Row, Col, Badge } from "react-bootstrap";

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
    if (this.props.books != 0) {
      return (
        <div id="pagination">
          <Row>
            <Col xs={12} md={8}>
              <Pagination
                onChange={this.handlePageChange}
                current={this.state.current}
                total={this.props.total}
              />
            </Col>
            <Col xs={12} md={4}>
              <label>
                Total Books: <Badge>{this.props.total}</Badge>
              </label>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <p>No books!</p>
        </div>
      );
    }
  }
}

export default Pager;
