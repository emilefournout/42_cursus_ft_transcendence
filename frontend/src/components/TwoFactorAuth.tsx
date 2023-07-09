import { useEffect, useState } from "react"

function TwoFactorAuth({username}: {username: string}) { // TODO maybe we can get username or other value from cookies or localstore to make the secret
  const [code, setCode] = useState('')
  const [qrImage, setQrImage] = useState('')

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/auth/qr-image?user=${username}`)
      .then((response: Response) => response.blob())
      .then((data: Blob) => data.text())
      .then((image: string) => setQrImage(image))
  }, [username])

  function set2FA() {
    fetch(`${process.env.REACT_APP_BACKEND}/auth/set-2fa?user=${username}&code=${code}`)
      .then((response: Response) => {
        console.log(response.status)
        return response.text()
      })
      .then((data: string) => {
        data == 'OK'
        ? window.alert('Good')
        : window.alert('Incorrect code')
      })
      .catch(error => console.log(error))
  }

  return (
    <>
      <img src={qrImage} />
      <br></br>
      <input
        type="text"
        placeholder="Code"
        onChange={event => setCode(event.target.value)}
      />
      <button onClick={set2FA}>Send</button>
    </>
  )
}

export default TwoFactorAuth
