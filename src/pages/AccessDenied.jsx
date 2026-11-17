import { Link } from "react-router-dom";

function AccessDenied() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="mb-2 text-6xl font-bold">403</h1>
      <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
        Access denied. You don't have permission to see this page.
      </p>
      <Link
        to="/"
        className="rounded-md bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default AccessDenied;