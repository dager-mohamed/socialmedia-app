import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { urlFor, client } from "../../client";
import { fetchUser } from "../../utils/fetchUser";

export function Pin(props: { pin: any; className: string }) {
  const navigate = useNavigate();
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const user = fetchUser();

  let alreadySaved = false;
  if (props.pin.save.length == 0) alreadySaved = false;
  else alreadySaved = true;

  const savePin = (id: any) => {
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            key: uuidv4(),
            userId: user.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id: any) => {
    client.delete(id).then(() => {
        window.location.reload()
    })
  }

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${props.pin._id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user-post"
          src={urlFor(props.pin.image).width(250).url()}
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${props.pin.image.asset.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {props.pin.save.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(props.pin._id);
                  }}
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {savingPost ? "Saving..." : "Save"}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {props.pin.destination && (
                <a
                  href={props.pin.destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md"
                >
                    <BsFillArrowUpRightCircleFill />
                    {props.pin.destination.length > 20 ? props.pin.destination.slice(8, 20) : props.pin.destination.slice(8)}
                </a>
              )}
              {props.pin.postedBy._id === user.googleId && (
                <button 
                className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold  text-base rounded-3xl hover:shadow-md outline-none"                   
                onClick={(e) => {
                    e.stopPropagation();
                    deletePin(props.pin._id);
                  }}
                  type="button"
                  >
                    <AiTwotoneDelete/>
                  </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`user-profile/${props.pin.postedBy._id}`} className="flex gap-2 mt-2 items-center">
        <img className="w-8 h-8 rounded-full object-cover" src={props.pin.postedBy.image} alt="user-image" />
        <p className="font-semibold capitalize">{props.pin.postedBy.userName}</p>
      </Link>
    </div>
  );
}
