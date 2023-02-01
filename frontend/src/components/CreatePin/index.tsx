import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { client } from "../../client";
import { Spinner } from "../Spinner";
import { categories, userQuery } from "../../utils/data";
import { SanityImageAssetDocument } from "@sanity/client";

export function CreatePin(props: { user: any }) {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<boolean | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [imageAsset, setImageAsset] = useState<SanityImageAssetDocument | null>(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files![0];
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true)

      client.assets.upload('image', selectedFile, {contentType: selectedFile.type, filename: selectedFile.name})
      .then((document) => {
        setImageAsset(document)
        setLoading(false)
      }).catch(err => {
        console.log('Image upload error', err)
      })
    } else {
      setWrongImageType(true);
    }
  };
  const savePin = () => {
    if(title && about && destination && imageAsset?._id && category){
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset:{
            _type:'reference',
            _ref: imageAsset?._id
          }
        },
        userId: props.user._id,
        postedBy:{
          _type:'postedBy',
          _ref: props.user._id
        },
        category
      }
      client.create(doc).then(() => {
        navigate('/')
      })
    }else{
      setFields(true)
      setTimeout(() => setFields(false),2000)
    }
  }
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition duration-150 ease-in">
          Please fill in all the fields.
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor rounded-md p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner message="" />}
            {wrongImageType && <p>Wrong Image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg select-none">Click to Upload</p>
                  </div>
                  <p className="mt-32 text-gray-400 select-none">
                    Recommendation: Use high-quality JPG, PNG, SVG or TIFF less
                    than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  accept="image/png, image/jpg, image/svg, image/tiff, image/jpeg"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img src={imageAsset.url} alt="upload-image" className="h-full w-full" />
                <button type="button"
                 className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                 onClick={() => setImageAsset(null)}
                 >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input type={"text"}
           className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
           value={title} 
           onChange={(e) => setTitle(e.target.value)} 
           placeholder="Add your title here"
           />
           {props.user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img src={props.user.image} className="w-10 h-10 rounded-full" alt="" />
              <p className="font-bold">{props.user.username}</p>
            </div>
           )}
                     <input type={"text"}
           className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
           value={about} 
           onChange={(e) => setAbout(e.target.value)} 
           placeholder="What is your pin about?"
           />
                                <input type={"text"}
           className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
           value={destination} 
           onChange={(e) => setDestination(e.target.value)} 
           placeholder="Add a destination link"
           />
           <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">Choose Pin category</p>
              <select
              onChange={(e) => setCategory(e.target.value)}
              className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value={'other' } className="bg-white">Select a category</option>
                {categories.map((category) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black">{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
              onClick={savePin}
              className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
           </div>
           
        </div>
      </div>
    </div>
  );
}
