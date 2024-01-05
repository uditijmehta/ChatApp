import React from 'react';
import {Avatar, ProfileContainer, Close} from "./styles";
import Api from '../../config/axios';
import {getAvatarPath} from "../../utils/helpers";
import {languages} from "../../utils/languages";
import {Icon} from "../index";

function Profile({id, ...props}) {
  const [data, setData] = React.useState(undefined);

  React.useEffect(() => {
    fetchData();
  }, [id]);
  const fetchData = React.useCallback(async () => {
    const res = await Api.get('/user/' + id);
    setData(res.data);
  }, [id]);

  return (
    <ProfileContainer>
      {data ? <>
        <Close onClick={() => props.setProfile(0)}><Icon name="close" size={30} /></Close>
      <Avatar src={getAvatarPath(data.avatar)} />
      <div className="title">{data.name}</div>
      <div>{data.phone}</div>
      <div>{data.email}</div>
      <div>{languages.find(i => i.language === data.language).name}</div>
      </> : <></>}
      
    </ProfileContainer>
  )
}

export default Profile;
