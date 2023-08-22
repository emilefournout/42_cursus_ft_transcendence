import React, { useCallback, useEffect, useState } from "react";
import iconVect from "../common/change-icon.svg"

interface AvatarProps {
	url?: string;
	size: string;
	upload: boolean;
}

export function Avatar(props: AvatarProps) {
	const [img, setImg] = useState<string>();
	const [image, setImage] = useState<File>();
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

	function saveImage(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files?.length) {
			// setImage(URL.createObjectURL(event.target.files[0]))
			setImage(event.target.files[0]);
		}
	}

	return (
		<>{ props.upload ? (
			<div className="wrapper-img" style={{"--img-size": props.size} as React.CSSProperties}>
				<label htmlFor="upload">
					<img
						src={img}
						className="user-avatar"
						alt="Avatar of the user"
					/>
					<img
						id="change-img"
						src={iconVect}
						alt="Selecting the avatar icon"
					/>
					<input
						type="file"
						id="upload"
						name="avatar"
						style={{ display: "none" }}
						onChange={saveImage}
					/>
				</label>
			</div>
		) : (
			<img
				src={img}
				style={{"--img-size": props.size} as React.CSSProperties}
				className="user-avatar user-avatar-no-edit"
				alt="Avatar of the user"
			/>
		)}</>
	);
}
