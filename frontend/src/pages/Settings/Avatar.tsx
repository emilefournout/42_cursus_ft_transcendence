import React, { useEffect, useState } from "react";

export function Avatar() {
  const [img, setImg] = useState<string>();
  const id = localStorage.getItem("user_id");
  useEffect(() => {
    fetch(`http://localhost:3000/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => data.avatar)
      .then((filename) =>
        fetch(`http://localhost:3000/profile/${filename}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
      )
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImg(url);
      });
    return () => {};
  }, []);

  return (
    <>
      <img src={img} />
    </>
  );
}
