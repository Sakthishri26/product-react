import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-6 text-xl text-gray-600">Page not found</p>
      <Link
        to="/"
        className="rounded-md bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </section>
  );
}

export default NotFound;
