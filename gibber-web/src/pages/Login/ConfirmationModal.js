import React from "react";
import { Modal, Button } from "react-bootstrap";
import { languages } from "../../utils/languages";

function ConfirmationModal(props) {
  const { show, onCancel, onConfirm, lang } = props;
  function getLanguageName(languageCode) {
    const language = languages.find((lang) => lang.language === languageCode);
    return language ? language.name : "";
  }
  const languageName = getLanguageName(lang);
  return (
    <Modal className="modal-sm" show={show} onHide={onCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Try a different language</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-sm">
          <p>We recommend that you choose a language other than english to truly experience the power of our app</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onConfirm}>
            OK
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
