import { useContext, useEffect, useState } from "react";
import { DialogContext } from "../pages/root/Root";
import { devlog } from "../services/core";

function TwoFactorAuth({ username }: { username: string | null }) {
  // TODO maybe we can get username or other value from cookies or localstore to make the secret
  const [code, setCode] = useState("");
  const [qrImage, setQrImage] = useState("");
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
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
    fetch(
      `${process.env.REACT_APP_BACKEND}/auth/set-2fa?user=${username}&code=${code}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((response: Response) => {
        response.ok ? setDialog("Good") : setDialog("Incorrect code");
      })
      .catch((error) => {
        devlog("Error on setting 2FA");
      });
  }

  return (
    <div className="settings-2fa-wrapper">
      <img src={qrImage} alt="QR for setting 2FA" />
      <input
        type="text"
        placeholder="Code"
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={(event) => {
          event.key === "Enter" && set2FA();
        }}
      />
      <button
        className="btn btn-bottom"
        style={{ height: "2em" }}
        onClick={set2FA}
      >
        Send
      </button>
    </div>
  );
}

export default TwoFactorAuth;
