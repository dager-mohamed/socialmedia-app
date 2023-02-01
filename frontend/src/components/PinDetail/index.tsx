import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { client, urlFor } from "../../client";
import { pinDetailMorePinQuery, pinDetailQuery } from "../../utils/data";
import { Spinner } from "../Spinner";

export function PinDetail(props: { user: any }) {
  const [pins, setPins] = useState<any>(null);
  const [pinDetail, setPinDetail] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId as any);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);
        console.log(data[0]);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);

          client.fetch(query1).then((res) => {
            console.log(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  function addComment() {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId as any)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuid(),
            postedBy: {
              _type: "postedBy",
              _ref: props.user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  }

  if (!pinDetail) return <Spinner message="Loading pin..." />;
  return (
    <>
      <div
        className="flex xl-flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail.image && urlFor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg max-w-2xl"
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                className="bg-white w-9 h-9 rounded-full"
                onClick={(e) => e.stopPropagation()}
                href={`${pinDetail.image.asset.url}?dl=`}
                download
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            to={`/user-profile/${props.user._id}`}
          >
            <img
              src={pinDetail.postedBy.image}
              className="w-8 h-8 rounded-full object-cover"
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment: any, i: any) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${props.user._id}`}>
              <img
                src={pinDetail.postedBy.image}
                className="w-10 h-10 rounded-full cursor-pointer"
                alt="user-profile"
              />
            </Link>
            <input
              type={"text"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
            />
            <button
              type="button"
              onClick={addComment}
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
