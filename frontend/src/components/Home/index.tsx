import React, { useEffect, useState, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";
import { Sidebar, UserProfile, Pins } from "../";
import { client } from "../../client";
import { userQuery } from "../../utils/data";
import logo from "../../assets/logo.svg";
import { fetchUser } from "../../utils/fetchUser";

export function Home() {
  const [ToggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<any>(null);
  const userInfo = fetchUser()

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} closeToggle={setToggleSidebar} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to={"/"}>
          <div className="flex flex-row items-center justify-center gap-2">
          <img src={logo} alt="logo" className="w-10" />
          <h1>Socialmedia</h1>
          </div>
          </Link>
          <Link to={`/user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </div>
        {ToggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
        
      </div>
      

      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path={`user-profile/:userId`} element={<UserProfile />} />
          <Route path={`/*`} element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
}
