import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
      <dl className="grid grid-cols-3 gap-3">
        <dt className="font-medium">Name</dt>
        <dd className="col-span-2">{user?.name}</dd>
        <dt className="font-medium">Email</dt>
        <dd className="col-span-2">{user?.email}</dd>
        <dt className="font-medium">Role</dt>
        <dd className="col-span-2 capitalize">{user?.role}</dd>
      </dl>
    </div>
  );
}

export default Profile;