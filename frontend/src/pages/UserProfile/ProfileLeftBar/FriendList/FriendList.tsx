import React from "react";
import {
	AcceptedFriendCard,
	FriendCardProps,
} from "./FriendCard/AcceptedFriendCard/AcceptedFriendCard";
import { ProfilePageContext, RequestType } from "../../UserProfilePage";
import { ProfileBarContext } from "../ProfileLeftBar";
import { PendingFriendCard } from "./FriendCard/PendingFriendCard";
import { ReceivedFriendCard } from "./FriendCard/ReceivedFriendCard";
import { User } from "../../../Board/Board";
import "./FriendList.css";
import FriendLessImg from "./NoFriends.png";

export function FriendList() {
	const profileBarContext = React.useContext(ProfileBarContext);
	const profilePageContext = React.useContext(ProfilePageContext);
	const isEnabled = () =>
		profileBarContext.requestsType === RequestType.enabled;
	const isEnabledUndefined = () =>
		isEnabled() && profilePageContext.acceptedFriends === undefined;

	const isPending = () =>
		profileBarContext.requestsType === RequestType.pending;
	const isPendingUndefined = () =>
		isPending() &&
		(profilePageContext.pendingFriends === undefined ||
			profilePageContext.receivedFriends === undefined);

	const isEnabledEmpty = () =>
		isEnabled() && profilePageContext.acceptedFriends!.length === 0;

	const isPendingEmpty = () =>
		isPending() &&
		profilePageContext.pendingFriends!.length === 0 &&
		profilePageContext.receivedFriends!.length === 0;

	const buildFriendList = (
		FriendCard: (props: FriendCardProps) => React.JSX.Element,
		friends: User[]
	) => {
		return (
			<>
				{friends.map((userInfo: User, index) => {
					return <div className="friendcard-container" key={index}>{<FriendCard userInfo={userInfo} />}</div>;
				})}
			</>
		);
	};

	if (isEnabledUndefined() || isPendingUndefined()) {
		return <div className="friendlist-wrapper">Loading...</div>;
	} else if (isEnabledEmpty()) {
		return (
			<div className="friendlist-wrapper">
				Friendless
				<img src={FriendLessImg} />
			</div>
		);
	} else if (isPendingEmpty()) {
		return <div className="friendlist-wrapper">No Pending Requests!</div>;
	} else if (isEnabled()) {
		return buildFriendList(
			AcceptedFriendCard,
			profilePageContext.acceptedFriends!
		);
	} else {
		return (
			<div className="friendlist-wrapper">
				{buildFriendList(
					ReceivedFriendCard,
					profilePageContext.receivedFriends!
				)}
				{buildFriendList(
					PendingFriendCard,
					profilePageContext.pendingFriends!
				)}
			</div>
		);
	}
}
