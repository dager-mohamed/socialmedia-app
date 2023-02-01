import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import logo from "../../assets/logo.svg";

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitaliza'
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitaliza'

import { categories } from "../../utils/data";

export function Sidebar(props: {
  user: any;
  closeToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleCloseSidebar() {
    if (props.closeToggle) props.closeToggle(false);
  }
  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <div className="flex flex-row items-center justify-center gap-2">
          <img src={logo} alt="logo" className="w-10" />
          <h1>Socialmedia</h1>
          </div>
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink to="/" className={(a) => a.isActive ? isActiveStyle : isNotActiveStyle}>
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover categories</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink to={`/category/${category.name}`} className={(a) => a.isActive ? isActiveStyle : isNotActiveStyle} key={category.name}>
                <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" alt="category-image"/>
                {category.name}
            </NavLink>
          ))}
        </div>
      </div>

      {props.user && (
        <Link to={`user-profile/${props.user._id}`} className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3" onClick={handleCloseSidebar}>
            <img src={props.user.image} className='w-10 h-10 rounded-full' alt="user-image" />
            <p>{props.user.userName}</p>
        </Link>
      )}
    </div>
  );
}
