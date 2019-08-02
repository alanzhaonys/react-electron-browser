import React from 'react';
import { version } from '../../package.json'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { Page } from './base/Page';
import { AboutWidget } from './AboutWidget';

export class Footer extends Page {
  render() {
    return (
      <footer>
        <Container>
          <Row>
            <Col className="col-left" md={6}>
              &copy; All Rights Reserved 2019. Version {version}.
            </Col>
            <Col className="col-right" md={6}>
              <AboutWidget />
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}
