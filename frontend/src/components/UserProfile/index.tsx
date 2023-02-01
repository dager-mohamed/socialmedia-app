import React, { useState, useEffect } from "react";
import { Sidebar } from "../";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "@leecheuk/react-google-login";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../../utils/data";
import { client } from "../../client";
import { MasonryLayout } from "../";
import { Spinner } from "../";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

  const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
  const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none'


export function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [pins, setPins] = useState<any>(null);
  const [text, setText] = useState<any>("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId as any);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);
  useEffect(() => {
    if(text === 'Created'){
        const createdPinsQuery = userCreatedPinsQuery(userId!)
        client.fetch(createdPinsQuery)
        .then((data) => {
            setPins(data)
        })
    }else{
        const savedPinsQuery = userSavedPinsQuery(userId!)
        client.fetch(savedPinsQuery)
        .then((data) => {
            setPins(data)
        })
    }
  },[text, userId])
  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-150 shadow-lg object-cover"
              alt="banner-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <GoogleLogout
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  onLogoutSuccess={logout}
                  render={(renderProps) => (
                    <button
                      type="button"
                      disabled={renderProps.disabled}
                      onClick={renderProps.onClick}
                      className="bg-white p-2 rouned-full cursor-pointer outline-none shadow-md"
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button type="button" onClick={(e: any) => {
                setText(e.target.textContent)
                setActiveBtn('created')
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
            >
                Created
            </button>
            <button type="button" onClick={(e: any) => {
                setText(e.target.textConent)
                setActiveBtn('saved')
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
            >
                Saved
            </button>
          </div>
          {pins?.length ? (
                      <div className="px-2">
                      <MasonryLayout pins={pins} />
                    </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No pins found
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
