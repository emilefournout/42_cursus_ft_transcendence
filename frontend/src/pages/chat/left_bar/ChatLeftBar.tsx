import React from "react";
import "./ChatLeftBar.css";
import "./conversations/Conversations.css";
import NewChatIcon from "../../../common/PlusIcon.svg";
import ReloadBlackIcon from "../../../common/reload_black.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../Chat";
import { Visibility } from "../room/add/create/RoomCreate";
import { Conversations } from "./conversations/Conversations";

export function LeftBar() {
  const chatPageContext = React.useContext(ChatPageContext);
  const chats = chatPageContext.chats;

  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <Link to="/board/chats/add">
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
        {chats &&
          chats.map((chat: ChatInfo) => {
            return <Conversations chat={chat} key={chat.id} />;
          })}
      </div>
      {/*</Link>*/}
    </div>
  );
}
