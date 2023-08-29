import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfilePageContext } from "../../../../UserProfilePage";

interface CardActionProps {
	userId: number;
}

export function CardAction(props: CardActionProps) {
	const [deleteIsSelected, setDeleteIsSelected] = useState<boolean>(false);
	const profilePageContext = React.useContext(ProfilePageContext);
	const deleteUser = () => {
		fetch(
			`${process.env.REACT_APP_BACKEND}/user/friends/delete/${props.userId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
				},
			}
		)
			.then((response) => {
				if (response.ok) {
					setTimeout(profilePageContext.updateFriends, 500);
				} else {
					throw new Error("Error deleting friend");
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};
	return (
		<>
			{deleteIsSelected ? (
				<div className="friend-card-delete-txt">
					You sure?
					<button onClick={deleteUser}>yes</button>
					<button onClick={() => setDeleteIsSelected((isSelected) => !isSelected)}>no</button>
				</div>
			) : (
				<button className="friend-card-subtitle-2" onClick={() => setDeleteIsSelected((isSelected) => !isSelected)}>
					Delete
				</button>
			)}
		</>
	);
}
