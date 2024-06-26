import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../config";
import { fetchUser } from "../store/features/user/User";

export default function EditUserModal() {
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    username: "",
  });

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const editUser = await axios({
        method: "put",
        url: "/user/" + userData.id,
        data: user,
        headers: {
          authorization: "Bearer " + localStorage.access_token,
        },
      });
      dispatch(fetchUser());
      setIsModalOpen(!isModalOpen);
    } catch (error) {
      console.log("ERROR GANNN >>>>>>", error);
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div>
        <button
          onClick={handleModalToggle}
          data-modal-target="crud-modal"
          data-modal-toggle="crud-modal"
          className="fixed sm:ml-80 xl:mr-96 md:mr-0 bottom-8 right-8 z-40 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Edit User
        </button>

        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className={`${
            isModalOpen ? "block" : "hidden"
          } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 bg-zinc-500/50 flex justify-center w-full md:inset-0 h-full max-h-full`}
        >
          <div className="relative grid content-center p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Post
                </h3>
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Bias:
                    </label>
                    <select
                      id="username"
                      name="username"
                      value={user.username}
                      onChange={handlePostChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                      <option defaultValue="">Select category</option>
                      <option value="cat">Cat</option>
                      <option value="dog">Dog</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Edit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
