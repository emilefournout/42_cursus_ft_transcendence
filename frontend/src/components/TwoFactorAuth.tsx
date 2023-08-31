import { useEffect, useState } from "react";
import { Dialog } from "./Dialog";
import Cookies from "js-cookie";

function TwoFactorAuth({ username }: { username: string | null }) {
	// TODO maybe we can get username or other value from cookies or localstore to make the secret
	const [code, setCode] = useState("");
	const [qrImage, setQrImage] = useState("");
	const [dialog, setDialog] = useState<string | undefined>(undefined);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_BACKEND}/auth/qr-image?user=${username}`)
			.then((response: Response) => {
				if (!response.ok) throw new Error("Error fetching qr image");
				return response.blob();
			})
			.then((data: Blob) => data.text())
			.then((image: string) => setQrImage(image));
	}, [username]);

	function set2FA() {
		fetch(`${process.env.REACT_APP_BACKEND}/auth/set-2fa?user=${username}&code=${code}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response: Response) => {
				response.ok ? setDialog("Good") : setDialog("Incorrect code");
			})
			.catch((error) => console.log("Error on setting 2FA"));
	}

	return (
		<div className="settings-2fa-wrapper">
			<Dialog dialog={dialog} setDialog={setDialog} />
			<img src={qrImage} />
			<input
				type="text"
				placeholder="Code"
				onChange={(event) => setCode(event.target.value)}
			/>
			<button className="btn btn-bottom" onClick={set2FA}>Send</button>
		</div>
	);
}

export default TwoFactorAuth;
