import React, { useRef, useState } from 'react';
import {useAuth, useUser} from '@clerk/clerk-react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";


    // Create a ref for the file input element to access its files easily

    // Create an AbortController instance to provide an option to cancel the upload if needed.


const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    


function Write() {

  const [cover, setCover] = useState(null);
const [progress, setProgress] = useState(0);
const fileInputRef = useRef(null);

  const {isLoaded, isSignedIn} = useUser();
  const [value, setValue] = useState()
  const {getToken} = useAuth()
  const navigate = useNavigate()


 const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // 1. Get auth params from backend
    const authRes = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);

    if (!authRes.ok) {
      throw new Error("Auth failed");
    }

    const auth = await authRes.json();

    // 2. Upload to ImageKit
    const res = await upload({
      file,
      fileName: file.name,
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
      signature: auth.signature,
      expire: auth.expire,
      token: auth.token,
      onProgress: (evt) => {
        setProgress((evt.loaded / evt.total) * 100);
      },
    });

    setCover(res.url);
    toast.success("Cover image uploaded!");
  } catch (err) {
    console.error(err);
    toast.error("Image upload failed");
  }
};



  const mutation = useMutation({
    mutationFn: async(newPost) => {

      const token = await getToken()

      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
    },
    onSuccess: (res) => {
      toast.success('Post has been created')
      navigate(`/${res.data.slug}`)
    }
  })

  if(!isLoaded)
  {
    return(
      <div className=''>Loding...</div>
    )
  }


  if(isLoaded && !isSignedIn)
  {
    return(
      <div className=''>You should login!</div>
    )
  }

  

  const handleSubmit = (e) => {

    e.preventDefault();
    const formData = new FormData(e.target)

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      catagory: formData.get("catagory"),
      desc: formData.get("desc"),
      content: value,
      cover:cover
    }

    console.log(data)
    mutation.mutate(data)
  }

  return (
    <div className='h-[calc(100vh-64px)] md:[calc(100vh-80px)] flex flex-col gap-6'>
      <h1 className='text-cl font-light'>Create a New Post</h1>
      <form onSubmit={handleSubmit} className='flex flex-1 flex-col gap-6 mb-6'>

        
            {/* Button to trigger the upload process */}
    <button
     type="button"
     onClick={() => fileInputRef.current.click()}
     className="w-max p-2 shadow-md rounded-xl text-sm bg-white"
      >
     Add a cover image
    </button>

    <input
      type="file"
      ref={fileInputRef}
      hidden
      accept="image/*"
      onChange={handleUpload}
    />

    {progress > 0 && progress < 100 && (
    <p className="text-sm text-gray-500">
    Uploading... {Math.round(progress)}%
    </p>
    )}

{cover && (
  <img
    src={cover}
    alt="Cover"
    className="w-full h-48 object-cover rounded-xl"
  />
)}



        <input name="title" className='text-4xl font-semibold bg-transparent outline-none' type='text' placeholder='My Awesome Story'/>
        <div className='flex items-center gap-4'>
          <label htmlFor='' className='text-sm'>Choose a catagory:</label>
          <select name='catagory' id='' className='p-2 rounded-xl bg-white shadow-md'>
              <option value="general">General</option>
              <option value="web-design">Web Design</option>
              <option value="development">Development</option>
              <option value="database">Database</option>
              <option value="seo">Search Engine</option>
              <option value="marketing">Marketing</option>
          </select>

        </div>
        <textarea name='desc' placeholder='A Short Description' className='p-4 rounded-xl bg-white shadow-md'/>
        <div className='flex-1 min-h-[300px]'>
          <ReactQuill className=' rounded-xl bg-white shadow-md h-full' theme="snow" value={value} onChange={setValue} />
        </div>
        
        <button disabled={mutation.isPending} className='bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed'>
          {mutation.isPending?"Loading...":"Send"}
        
        </button>
        {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

      </form>
    </div>
  )
}

export default Write
