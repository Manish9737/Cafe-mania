import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "../Assets/CSS/customModal.css"

const CustomModal = ({ show, handleClose, title, inputs, handleChange, handleSubmit }) => {
  return (
    <div id='custom-modal'>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {inputs.map((input, index) => (
              <Form.Group key={index}>
                {input.type === 'text' && (
                  <Form.Control
                    type="text"
                    value={input.value}
                    onChange={(e) => handleChange(input.id, e.target.value)}
                    className="form-control mb-2"
                    placeholder={input.placeholder}
                  />
                )}
                {input.type === 'email' && (
                  <Form.Control
                    type="email"
                    value={input.value}
                    onChange={(e) => handleChange(input.id, e.target.value)}
                    className="form-control mb-2"
                    placeholder={input.placeholder}
                  />
                )}
                {input.type === 'password' && (
                  <Form.Control
                    type="password"
                    value={input.value}
                    onChange={(e) => handleChange(input.id, e.target.value)}
                    className="form-control mb-2"
                    placeholder={input.placeholder}
                  />
                )}
                {input.type === 'number' && (
                  <Form.Control
                    type="number"
                    value={input.value}
                    onChange={(e) => handleChange(input.id, e.target.value)}
                    className="form-control mb-2"
                    placeholder={input.placeholder}
                  />
                )}
                {input.type === 'file' && (
                  <Form.Control
                    type="file"
                    onChange={(e) => handleChange(input.id, e.target.files)}
                    className="form-control mb-2"
                  />
                )}
                {input.type === 'select' && (
                  <Form.Control
                    as="select"
                    value={input.value}
                    onChange={(e) => handleChange(input.id, e.target.value)}
                    className="form-control mb-2"
                  >
                    {input.options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="brown" onClick={handleSubmit}>{title}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomModal;
