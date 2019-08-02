import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Page } from './base/Page';

export class Home extends Page {
  render() {
    return (
      <div className="page">
          <Container>
            <Row>
              <Col md={12}>
                Home
              </Col>
            </Row>
          </Container>
      </div>
    );
  }
}
