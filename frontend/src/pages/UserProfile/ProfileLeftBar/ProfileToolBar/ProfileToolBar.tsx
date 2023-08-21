import React, { useState } from "react";
import "../ProfileLeftBar.css";
import { ProfilePageContext, RequestType } from "../../UserProfilePage";
import { RequestTypeButton } from "./RequestTypeButton";
import { useNavigate } from "react-router-dom";
import ReloadBlackIcon from "../../../../common/reload_honey.svg";
import AddFriendIcon from "./AddFriendIcon.svg";

export function ProfileToolBar() {
	const [newFriend, setNewFriend] = useState<string>("");
	const profileContext = React.useContext(ProfilePageContext);
	const navigate = useNavigate();
	const addFriend = () => {
		fetch(`${process.env.REACT_APP_BACKEND}/user/info/username/${newFriend}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response) => {
				if (response.ok) return response.json();
				else {
					alert("User not found");
					throw new Error();
				}
			})
			.then((data) =>
				fetch(`${process.env.REACT_APP_BACKEND}/user/friends/send/${data.id}`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("access_token")}`,
					},
				})
			)
			.then((response) => {
				if (response.ok) {
					alert("Friend request sent");
					profileContext.updateFriends();
					clearState();
				} else {
					response.json().then((data) => alert(data.message));
					throw new Error();
				}
			})
			.catch((error) => console.log(error));
	};

	const clearState = () => {
		setNewFriend("");
	};

	return (
		<div id="prof-tool-bar-container">


			{/* THE MY PROFILE IS REDUNDANT SINCE THE USER CAN CLICK THENT ICON IN THE NAVBAR. THE RANKING ONE IS BETTER PLACED INSIDE THE STATS SUBWINDOW  */}

			{/* <div
			  *     style={{
			  *         display: "flex",
			  *         flexDirection: "row",
			  *         gap: "10px",
			  *     }}
			  * >
			  *     <button onClick={() => navigate("/board/userAccount")}>
			  *         my profil
			  *     </button>
			  *     <button onClick={() => navigate("/board/userAccount/ranking")}>
			  *         ranking
			  *     </button>
			  * </div> */}


			<div className="input-add-friend wrapper-row">
				<input
					value={newFriend}
					type="text"
					placeholder="Add Friend!"
					onChange={(e) => setNewFriend(e.target.value)}
				/>
				<img
					className="nav-icons"
					src={AddFriendIcon}
					onClick={addFriend}
				/>
				<img
					className="nav-icons"
					src={ReloadBlackIcon}
					onClick={profileContext.updateFriends}
				/>
			</div>
			<div className="request-type-buttons">
				<div>
					<RequestTypeButton type={RequestType.enabled} />
				</div>
				<div>
					<RequestTypeButton type={RequestType.pending} />
				</div>
			</div>
		</div>
	);
}
