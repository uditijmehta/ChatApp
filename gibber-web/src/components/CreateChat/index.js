import React from 'react';
import {Container, Search} from "./styles";
import Icon from "../Icon";
import debounce from 'lodash.debounce';
import {Row} from "../../utils/sharedStyles";
import {Avatar, ChatList, Item, UserName} from "../Sidebar/styles";
import {getAvatarPath} from "../../utils/helpers";
import Api from '../../config/axios';
import GroupChatModal from './GroupChatModal';
import './index.css';


function CreateChat({close, user, ...props}) {
  const [search, setSearch] = React.useState('');
  const [searchDb, setSearchDb] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('search-name');
  const [getSent, setGetSent] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);


  const debouncedSave = React.useCallback(debounce(nextValue => setSearchDb(nextValue), 1000), []);
  const handleChange = val => {setSearch(val); debouncedSave(val)};

  React.useEffect(() => {
    searchUser();
  }, [searchDb, selectedOption]);

  React.useEffect(() => {
    fetchAllSentInvites();
    setRefresh(false);
  }, [refresh]);

  const fetchAllSentInvites = async () => {
    const res = await Api.get(`/friend-request/sent/${user._id}`);
    setGetSent(res.data);
  }

  const searchUser = React.useCallback(async () => {
    if (searchDb.length > 2) {
      const res = await Api.get('/user/search?q=' + searchDb + '&by=' + selectedOption);
      setUsers(res.data);
    }
  }, [searchDb, selectedOption]);

  const onClick = React.useCallback(async (target) => {
    const res = (await Api.get('/chat/conversation-exist/' + target._id)).data;
    if (res.isExist)
      props.setChatId(res.conversationId);
    // else {
    //   const data = (await Api.post('/chat/conversation/' + target._id)).data;
    //   props.setChatId(data._id);
    //   props.createChat(data);
    // }
    close();
  }, []);

  const handleOpen = () => {
    setShowModal(true);
  }

  const handleClose = () => {
    setShowModal(false);
  }

  const handleSearch = (event) => {
    setSelectedOption(event.target.value);
    searchUser()
  }

  const handleRequest = async (event) => {
    try {
      const sender = user._id, receiver = event.target.value
      const res = await Api.post('/friend-request/create', { sender, receiver });
      setRefresh(true);
    } catch (error) {
      console.log(error);
    }
  }

  const renderItem = React.useCallback(item => {
    const receiverCheck = getSent && getSent.requests?.some((invite) => invite.receiver === item._id);
    const alreadyFriends = user.friends?.includes(item._id);
    let button;
    if (!receiverCheck) {
      button = <button value={item._id} className='request-btn' onClick={handleRequest}>Request</button>;
    } else {
      button = <button value={item._id} className="requested-btn"  disabled>Requested</button>;
    }
    if (alreadyFriends) {
      button = null;
    }

    return (
      <Item onClick={button ? null : () => onClick(item)} key={item._id}>
        <Row>
          <Avatar src={getAvatarPath(item.avatar)} />
          <div>
            <UserName>{item.name}</UserName>
            <div className="subTxt">{selectedOption === 'search-phone' ? item.phone : item.email}</div>
          </div>
          {button}
        </Row>
      </Item>
    );
  }, [getSent, selectedOption]);

  return (
    <Container>
      <Row align="center" justify="space-between" className="head">
        <h3>Contacts</h3>
        <div onClick={close}><Icon name="close" /></div>
      </Row>
      <div className="searchContainer">
        <div className="icon"><Icon name="search" size={21} /></div>
        <Search placeholder="Search" value={search} onChange={e => handleChange(e.target.value)} />
      </div>
      <div className="form-check">
        <div>
          <input className="form-check-input" type="checkbox" value="search-name" checked={selectedOption === 'search-name'} onChange={handleSearch} />
          <label className="form-check-label" >
            Name
          </label>
        </div>
        <div>
          <input className="form-check-input" type="checkbox" value="search-email" checked={selectedOption === 'search-email'} onChange={handleSearch} />
          <label className="form-check-label" >
            Email
          </label>
        </div>
        <div>
          <input className="form-check-input" type="checkbox" value="search-phone" checked={selectedOption === 'search-phone'} onChange={handleSearch} />
          <label className="form-check-label" >
            Phone
          </label>
        </div>
      </div>
      <ChatList style={{paddingBottom: 140}}>
        <button onClick={handleOpen} style={{
          marginLeft: '85px',
          backgroundColor: '#338bcf',
          color: '#fff',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
        }}>
          Create Group Chat
        </button>
        {!search && user.contacts.filter(i => i.email !== 'teamgibber@test.com').map(renderItem)}
        {!!users.length && users.filter(i => i.email !== 'teamgibber@test.com').map(renderItem)}
      </ChatList>
      <GroupChatModal user={user} show={showModal} handleClose={handleClose} />
    </Container>
  )
}

export default CreateChat;
