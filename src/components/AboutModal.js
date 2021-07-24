import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export class AboutModal extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="about-modal"
        centered
        id="about-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            About
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please checkout MakerAL.com for more goodies.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
