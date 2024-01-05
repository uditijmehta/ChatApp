import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Api from "../../config/axios";
import { toast } from "react-toastify";

function GroupChatModal({ user, show, handleClose }) {
  const [groupChatName, setGroupChatName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

  const ChangeGroupName = (event) => {
    setGroupChatName(event.target.value);
  };

  const handleUserSelection = (e) => {
    const selectedNameOptions = Array.from(e.target.selectedOptions).map((option) => option.text)
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectedUsers(selectedOptions);
    setSelectedNames(selectedNameOptions);
  }

  const handleSubmit = async () => {
    if (!groupChatName) {
      return toast.warn('Input Group Chat Name');
    } else if (selectedUsers.length === 0) {
      return toast.warn('Invalid Number of Selected Users!')
    }
    try {
      const res = await Api.post('/chat/group-conversation/', { participants: selectedUsers, name: groupChatName });
      const groupChat = res.data;
      handleClose();
      setSelectedUsers([]);
      setSelectedNames([]);
      setGroupChatName("");
    } catch (error) {
      console.warn(error);
    }
  }

  const handleModalClose = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSelectedNames([]);
    handleClose();
  };

  const fetchAllUsers = async () => {
    try {
      const res = await Api.get('/user/allUsers');
      setAllUsers(res.data.filter(u => u.email !== 'teamgibber@test.com' && u.email !== user.email && user.friends.some(e => u._id === e)));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Group Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formGroupName">
            <Form.Label>Group Chat Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group chat name"
              value={groupChatName}
              onChange={ChangeGroupName}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formUsers">
            <Form.Label>Select Users to Add:</Form.Label>
            <Form.Control as="select" multiple onChange={handleUserSelection} className="mb-3">
              {allUsers.map((user) => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </Form.Control>
            <p style={{fontSize: 10}}>* You can only create a group with participants who are your friends</p>

            <p style={{ fontSize: "14px" }}>Selected Users: {selectedNames.join(', ')}</p>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GroupChatModal;
