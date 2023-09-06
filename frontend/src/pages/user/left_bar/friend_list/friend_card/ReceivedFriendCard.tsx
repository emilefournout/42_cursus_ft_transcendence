import React, { useContext } from "react";
import "./FriendCard.css";
import { ProfilePageContext } from "../../../UserProfilePage";
import { Avatar } from "../../../../../components/Avatar";
import { FriendCardProps } from "./accepted_friend_card/AcceptedFriendCard";
import { DialogContext } from "../../../../root/Root";
import { testing } from "../../../../../services/core";

export function ReceivedFriendCard(props: FriendCardProps) {
	const profilePageContext = React.useContext(ProfilePageContext);
	const dialogContext = useContext(DialogContext);
	const setDialog = dialogContext.setDialog;
	const accept = async () => {
		fetch(
			`${process.env.REACT_APP_BACKEND}/user/friends/accept/${props.userInfo.id}`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			}
		)
			.then((response) => {
				if (response.ok) {
					setDialog("Friend request accepted");
				} else {
					throw new Error("Error accepting friend request");
				}
			})
			.catch((e) => {
				if (testing) console.log(e);
			});
	};
	const decline = async () => {
		fetch(
			`${process.env.REACT_APP_BACKEND}/user/friends/decline/${props.userInfo.id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			}
		)
			.then((response) => {
				if (response.ok) {
					setDialog("Friend request declined");
				} else {
					throw new Error("Error declining friend request");
				}
			})
			.catch((e) => {
				if (testing) console.log(e);
			});
	};
	const handleFriendRequest = async (action: () => Promise<void>) => {
		action().then(() => setTimeout(profilePageContext.updateFriends, 500));
	};

	return (
		<>
			<div className="friend-card">
				<div className="friend-card-avatar">
					<Avatar
						url={props.userInfo.avatar}
						size="48px"
						upload={false}
						download={true}
					/>
				</div>
				<div className="friend-card-username ellipsed-txt">
					{props.userInfo.username}
				</div>
				<button onClick={() => handleFriendRequest(accept)}>Accept</button>
				<button onClick={() => handleFriendRequest(decline)}>Decline</button>
			</div>
		</>
	);
}
