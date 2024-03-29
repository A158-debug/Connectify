import React from 'react';
import Note from './SingleNote';
import { CircularProgress, Grid } from '@mui/material';

import { useSelector } from 'react-redux';
// help us to reterive tha data from global store

const Notes = ({ setCurrentId,setVisible,visible }) => {
  const { posts, isLoading } = useSelector((state) => {
    return state.postReducer
  });

  
  if (!posts?.length && !isLoading) return "No Posts"

  return (
    isLoading ? <CircularProgress /> : (
      <Grid container alignItems="stretch"  spacing={1}>
        {posts?.map((post) => (
          <Grid key={post._id} item xs={12} sm={6} md={4}  >
            <Note post={post} setCurrentId={setCurrentId} visible={visible} setVisible={setVisible}/>
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Notes