import React from 'react'
import PostListItem from './PostListItem'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSearchParams } from 'react-router-dom'


const fetchpost = async(pageParam, searchParams) => {

  const searchParamsObj = Object.fromEntries([...searchParams])

  console.log(searchParamsObj)

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`,{
    params: {page: pageParam, limit : 10, ...searchParamsObj} 
  })
  return res.data;
}

function PostList() {

  const [searchParams, setSearchParams] = useSearchParams() 

// const query = useQuery({ 
  
//   queryKey: ['repoData'], 
//   queryFn: () => fetchpost()

// })

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', searchParams.toString()],
    queryFn: ({pageParam=1})=>fetchpost(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
  })

  console.log(data)

  const allPosts = data?.pages?.flatMap(page=>page.posts) || [];

  if(status === 'loading')
  {
    return "Loading..."
  }

  if(status === "error")
  {
    return "Something Went Wrong!"
  }

// console.log(query.data)

  return (
   <InfiniteScroll
  dataLength={allPosts.length} //This is important field to render the next data
  next={fetchNextPage}
  hasMore={!!hasNextPage}
  loader={<h4>Loading more posts...</h4>}
  endMessage={
    <p style={{ textAlign: 'center' }}>
      <b>All post loaded!</b>
    </p>
  }
  
>
  {
      allPosts.map(post=>(<PostListItem key={post._id} post={post}/>))
  }
</InfiniteScroll>
    
       
    
  )
}

export default PostList
