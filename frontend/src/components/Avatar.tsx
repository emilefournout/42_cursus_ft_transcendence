import React, { useCallback, useEffect, useState } from "react";
import iconVect from "../common/change-icon.svg";

type AvatarProps = {
	url?: string;
	size?: string;
	upload: boolean;
	setImg?: React.Dispatch<React.SetStateAction<File | undefined>>
	download: boolean;
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
						.then((response) => {
							if (response.ok) return response.json();
							else throw new Error("Error fetching avatar");
						})
						.then((data) => data.avatar)
            .catch((e) => {});

		fetch(`${process.env.REACT_APP_BACKEND}/profile/${avatarUrl}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response) => {
				if (!response.ok) throw new Error("Error fetching avatar");
				return response.blob();
			})
			.then((blob) => {
				const url = URL.createObjectURL(blob);
				setImg(url);
			})
      .catch((e) => {});
	}, [props.url]);

	useEffect(() => {
		if (props.download) {
			downloadAvatar().catch((e) => console.log("Error when downloading the avatar"));
			return () => {};
		}
	}, [downloadAvatar]);

	function saveImage(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files?.length) {
			setImg(URL.createObjectURL(event.target.files[0]));
			if (props.setImg) props.setImg(event.target.files[0])
		}
	}

	if (img === undefined)
		setImg("https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg");

	return (
		<>
			{props.upload ? (
				<div
					className="wrapper-img"
					style={ props.size === undefined ? {} : { "--img-size": props.size } as React.CSSProperties}
				>
					<label htmlFor="upload">
						<img
							src={img}
							className="user-avatar"
							alt="Avatar of the user"
							style={ props.size === undefined ? {} : { "--img-size": props.size } as React.CSSProperties}
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
					className="user-avatar user-avatar-no-edit"
					style={ props.size === undefined ? {} : { "--img-size": props.size } as React.CSSProperties}
					alt="Avatar of the user"
				/>
			)}
		</>
	);
}
