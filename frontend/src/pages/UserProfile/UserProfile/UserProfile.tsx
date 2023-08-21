import React from "react";
import { Profile } from "./Profile/Profile";
import { useParams } from "react-router-dom";
import { ProfilePageContext } from "../UserProfilePage";
import { BoardContext } from "../../Board/Board";

export function UserProfile() {
	const boardContext = React.useContext(BoardContext);
	const { id } = useParams();
	const profilePageContext = React.useContext(ProfilePageContext);
	const userInfo =
		id === undefined
			? boardContext?.me
			: profilePageContext.acceptedFriends?.find(
					(user) => user.id === parseInt(id)
				);

	if (userInfo === undefined) {
		return <>user not found</>;
	} else {
		return (
			<>
				<Profile userInfo={userInfo} />
				{/* Create navigation between Profile and FullAchievement*/}
			</>
		);
	}
}
