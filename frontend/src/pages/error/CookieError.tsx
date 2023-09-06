import { Link } from "react-router-dom";

export function CookieError() {
  return (
    <>
      <h1 className="title">Cookie error</h1>
      <h2 className="title">
        It seems that the 42 API is not working properly.
      </h2>
      <Link to="/">
        <button>Come back to home</button>
      </Link>
    </>
  );
}
