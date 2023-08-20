import React, { useCallback, useEffect, useState } from "react";

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
		<>
			<img src={img} className="user-avatar" alt="Avatar of the user"/>
		</>
	);
}
