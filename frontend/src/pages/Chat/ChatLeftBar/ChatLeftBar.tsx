import React from "react";
import "./ChatLeftBar.css";
import "./Conversations/Conversations.css";
import NewChatIcon from "./NewChatIcon.svg";
import ReloadBlackIcon from "../../../common/reload_black.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../Chat";
import { Visibility } from "../Room/RoomCreate/RoomCreate";
import { Conversations } from "./Conversations/Conversations";

export interface LeftBarProps {
  chats: Array<ChatInfo> | undefined;
}

export function LeftBar(props: LeftBarProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const chatPageContext = React.useContext(ChatPageContext);

  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <Link to="/board/chats/create">
          <img className="nav-icons" src={NewChatIcon} />
        </Link>
        <img
          className="nav-icons"
          src={ReloadBlackIcon}
          onClick={chatPageContext.updateChat}
        />
      </div>
      {/* <Link to="/chats/room">*/}
      <div id="lb-bot-wrapper">
        {props.chats &&
          props.chats.map((chat: ChatInfo) => {
            return <Conversations chat={chat} key={chat.id} />;
          })}
      </div>
      {/*</Link>*/}
    </div>
  );
}
