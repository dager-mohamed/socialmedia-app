import React from "react";
import {Circles} from 'react-loader-spinner'

export function Spinner(props:{message: string}){
    return(
        <div className="flex flex-col justify-center items-center w-full h-full">
            <Circles color="#00BFFF" height={50} width={200} wrapperClass="m-5" />
            <p className="text-lg text-center px-2">{props.message}</p>
        </div>
    )
}