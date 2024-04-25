import { Link } from "react-router-dom";
import axios from "../config";
import socket from "../socket";
import { useDispatch } from "react-redux";
import { fetchFollowingPost, fetchPost } from "../store/features/post/Post";
import { useEffect, useState } from "react";
// import { BiLike, BiSolidLike, BiDislike, BiSolidDislike  } from "react-icons/bi";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const [time, setTime] = useState(post.createdAt);
  const [alreadyVote, setAlreadyVote] = useState(false)

  const deleteHandler = async () => {
    try {
      await axios({
        method: "delete",
        url: `/post/${post.id}`,
        headers: {
          authorization: `Bearer ` + localStorage.access_token,
        },
      });
      console.log("Massssukkk")
      socket.emit("new-post");
      dispatch(fetchPost());
    } catch (error) {
      console.log("")
    }
  };

  const voteHandler = async (e) => {
    try {
      console.log(e.target.value, "valuuuuuueeee")
      if (!alreadyVote) {
        console.log("masukk boyyyy")
        await axios({
          method: "put",
          url: `/post/${post.id}/vote`,
          data: {
            vote: e.target.value,
          },
          headers: {
            authorization: "Bearer " + localStorage.access_token,
          },
        });
      }

      socket.emit("new-vote");
      setAlreadyVote(!alreadyVote)
      dispatch(fetchPostByCategory(post.Category.id));
      dispatch(fetchPost());
      dispatch(fetchFollowingPost());
    } catch (error) {
      console.log(error);
    }
  };
  console.log(alreadyVote, "status  sssssssssssssss")

  const timeFormat = () => {
    const dateString = new Date(time);
    const hours = dateString.getHours();
    const minutes = dateString.getMinutes();
    setTime(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  };

  // console.log(post.Category, "ini ada <<<<<<<<");

  useEffect(() => {
    timeFormat();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <Link
          to={`/post/${post.id}`}
          className="block w-100 p-6 bg-white rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800  dark:hover:bg-gray-700 "
        >
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {post.Category && post?.Category?.name}
          </p>
          <div className="">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              {post.title}
            </h5>
          </div>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Votes: {post.votes} Created at: {!time.includes("NaN") && time}
          </p>
        </Link>
        <button onClick={voteHandler} value={alreadyVote ? 1 : -1} >{alreadyVote ? "<BiLike />"
          : "<BiSolidLike />"}</button>
        <button onClick={voteHandler} value={alreadyVote ? -1 : 1} >{alreadyVote ? "<BiSolidDislike />"
          : "<BiDislike />"}</button>
          <button onClick={deleteHandler}>Delete boyy</button>
      </div>
      {/* 
      <button
        onClick={deleteHandler}
        type="button"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Delete
      </button>
      <button
        onClick={voteHandler}
        value={1}
        type="button"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Upvote
      </button>
      <button
        onClick={voteHandler}
        value={-1}
        type="button"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Downvote
      </button> */}
    </>
  );
}
