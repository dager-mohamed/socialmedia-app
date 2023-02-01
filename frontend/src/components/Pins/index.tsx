import React, {useState, useEffect} from "react";
import {Routes, Route} from 'react-router-dom'
import { Navbar, Feed, PinDetail, CreatePin, Search } from '../'


export function Pins(props:{user: any}){
    const [searchTerm, setSearchTerm] = useState('')
    return(
        <div className="px-2 md:px-5">
            <div className="bg-gray-50">
                <Navbar user={props.user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            <div className="h-full">
                <Routes>
                    <Route path="/" element={<Feed/>} />
                    <Route path="/category/:categoryId" element={<Feed/>} />
                    <Route path="/pin-detail/:pinId" element={<PinDetail user={props.user}/>} />
                    <Route path="/create-pin" element={<CreatePin user={props.user}/>} />
                    <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>} />
                </Routes>
            </div>
        </div>
    )
}