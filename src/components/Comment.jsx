import React from 'react'
import Img from './Image'
import { format } from 'timeago.js'
import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

function Comment({comment, postId}) {

   const {user} = useUser()
   const { getToken } = useAuth();
   const role = user?.publicMetadata?.role;

   const queryClient = useQueryClient()
   
      //  const {isPending, error, data} = useQuery({
     
      //    queryKey:  ["comments", postId],
      //    queryFn : () => fetchComments(postId),
      //    enabled: !!postId, // ⬅️ IMPORTANT
     
      //  });
   
   
       const mutation = useMutation({
           mutationFn: async() => {
   
             const token = await getToken()
       
             return axios.delete(`${import.meta.env.VITE_API_URL}/comments/${comment._id}`, {
               headers:{
                 Authorization: `Bearer ${token}`
               }
             })
           },
           onSuccess: () => {
               queryClient.invalidateQueries({queryKey:  ["comments", postId]})
               toast.success("Comment deleted successfully!")
             },
   
           onError: (error) => {
             toast.error(error.response.data)
           }
         })
     
   

  return (
    <div className='p-4 bg-slate-50 rounded-xl mb-8'>
        <div className='flex items-center gap-4'>
            {comment.user.img && <Img src={comment.user.img} className="w-10 h-10 rounded-full object-cover" w="40"/>}
            <span className='font-medium'>{comment.user.username}</span>
            <span className='text-sm text-gray-500'>{format(comment.createdAt)}</span>
            {user &&(comment.user.username === user.username || role === "admin") && <span className='text-xs text-red-400 hover:text-red-600 cursor-pointer' onClick={()=>mutation.mutate()}>delete  {mutation.isPending && <span>(in progress)</span>}</span>
           
            }
        </div>
        <div className='mt-4'>
            <p>
                {comment.desc}
            </p>
        </div>
    </div>
  )
}

export default Comment
