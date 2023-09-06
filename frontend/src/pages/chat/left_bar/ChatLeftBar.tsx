import React from "react";
import "./ChatLeftBar.css";
import "./conversations/Conversations.css";
import NewChatIcon from "../../../common/PlusIcon.svg";
import ReloadBlackIcon from "../../../common/reload_black.svg";
import { Link } from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../Chat";
import { Conversations } from "./conversations/Conversations";
import { devlog } from "../../../services/core";

export function LeftBar() {
  const chatPageContext = React.useContext(ChatPageContext);
  const chats = chatPageContext.chats;

  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <Link to="/board/chats/add">
          <img className="nav-icons" src={NewChatIcon} alt="New chat icon" />
        </Link>
        <img
          className="nav-icons"
          src={ReloadBlackIcon}
          onClick={() =>
            chatPageContext.updateChat().catch((error) => {
              devlog(error);
            })
          }
          alt="Reload icon"
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
