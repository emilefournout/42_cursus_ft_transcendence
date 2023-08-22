import React, { useCallback, useEffect, useState } from "react";
import iconVect from "../common/change-icon.svg"

interface AvatarProps {
	url?: string;
}

export function Avatar(props: AvatarProps) {
	const [img, setImg] = useState<string>();
	const downloadAvatar = useCallback(async () => {
		const avatarUrl: string | null =
			props.url !== undefined
				? props.url
				: await fetch(`${process.env.REACT_APP_BACKEND}/user/me`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${localStorage.getItem("access_token")}`,
						},
					})
						.then((response) => response.json())
						.then((data) => data.avatar);

		fetch(`${process.env.REACT_APP_BACKEND}/profile/${avatarUrl}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response) => response.blob())
			.then((blob) => {
				const url = URL.createObjectURL(blob);
				setImg(url);
			});
	}, [props.url]);

	useEffect(() => {
		downloadAvatar().catch((e) => console.log(e));
		return () => {};
	}, [downloadAvatar]);

	return (
		<div className="wrapper-img">
			<img
				src={img}
				style={{"--img-size": "72px"} as React.CSSProperties}
				className="user-avatar"
				alt="Avatar of the user"
			/>
			<img
				id="change-img"
				src={iconVect}
				alt="Selecting the avatar icon"
			/>
		</div>
	);
}
