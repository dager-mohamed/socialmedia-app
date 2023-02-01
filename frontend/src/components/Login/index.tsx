import React, { useEffect } from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "@leecheuk/react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../../assets/share.mp4";
import { gapi } from "gapi-script";
import { client } from "../../client";


export function Login() {
  const navigate = useNavigate()
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  function responseGoogle(response: any) {
    localStorage.user = JSON.stringify(response.profileObj);
    const { name, googleId, imageUrl } = response.profileObj;
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl
    }
    client.createIfNotExists(doc)
    .then(() => {
      navigate('/',{replace: true})
    })
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          loop
          muted
          autoPlay
          controls={false}
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              cookiePolicy={"single_host_origin"}
              scope="email"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              render={(renderProps) => (
                <button
                  type="button"
                  disabled={renderProps.disabled}
                  onClick={renderProps.onClick}
                  className="flex transition-all flex-row items-center justify-center rounded-md text-sm font-semibold py-3 px-4 bg-slate-200 text-black hover:bg-slate-300"
                >
                  <FcGoogle className="mr-4" size={20} /> Sign in with Google
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
