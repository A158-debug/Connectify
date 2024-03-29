import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  ButtonBase,
} from "@mui/material";

import { likePost, deletePost, getPost } from "../actions/posts";
import moment from "moment";

import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const classes = {
  media: {
    height: "2.5rem",
    paddingTop: "56.25%", // 16:9 aspect ratio (change this value according to your needs)
    position: "relative",
    overflow: "hidden",
    background: "black"
  },
  mediaImage: {
    // Make the image responsive
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    opacity: "0.7",
    top: 0,
    left: 0,
  },
  border: {
    border: "solid",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "10px",
    height: "100%",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "white",
  },
  grid: {
    display: "flex",
  },
  details: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
  },
  title: {
    padding: "0 16px",
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-around",
  },
  cardAction: {
    display: "block",
    textAlign: "initial",
  },
};

const ImageURL =
  "https://images.unsplash.com/photo-1686226347032-b82efa11af93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60";

const Note = ({ post, setCurrentId, visible, setVisible }) => {
  console.log("Post: ", post);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post?.likes);

  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result.sub || user?.result?._id;

  // In likes we are storing ids, here we are finding either we have liked that post or not.
  const hasLikedPost = post?.likes?.find((like) => like === userId);

  const openPost = (e) => {
    dispatch(getPost(post._id));
    navigate(`/posts/${post._id}`);
  };

  const showAlert = () => {
    setVisible((prev) => !prev);
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  };

  const handleLike = async () => {
    if (!userId) {
      // Handle the case when the user is not authenticated
      // You can show a message or redirect the user to the login page
      // console.log("Please login to like a post.")
      showAlert();
      return;
    }
    dispatch(likePost(post._id));
    
    // console.log("hasLikedPost: ", hasLikedPost);
    if (hasLikedPost) {
      // if I again click on it after like then it will dislike it
      // it remove the id from the list
      // console.log("Remove id in like array");
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      // console.log("Add id in like array");
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    // if there is some like on the post
    // then two cases arise either
    //          1) I have already liked that post or
    //          2) I have not liked that post till know

    if (likes.length > 0) {
      return likes?.find((like) => like === userId) ? (
        // if our id present in like, then 2 cases
        // like --> [ your_id,....many more]
        // like --> [ your_id, some_one_else_id] only 2 like ---> This case arise when we like first time
        <>
          <ThumbUpIcon fontSize="small" />
          &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like ${likes.length > 1 ? "s" : ""}`}
        </>
      ) : (

        // If our id is not present in like
        // Mean I have not liked that post till now
        <>
          <ThumbUpOffAltIcon fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    // If there is no like in the post (new post) then it just only show Like button
    return (
      <>
        <ThumbUpOffAltIcon fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  return (
    <Card sx={{ padding: "0.5rem" }} style={classes.card}>
      <ButtonBase
        component="span"
        name="test"
        onClick={openPost}
        style={classes.cardAction}
      >
        <div style={classes.media}>
          <img
            src={post?.selectedFile || ImageURL}
            alt={post?.title}
            style={classes.mediaImage}
          />
        </div>

        <div style={classes.overlay}>
          <Typography variant="inherit">{post?.name}</Typography>
          <Typography variant="body2">
            {moment(post?.createdAt).fromNow()}
          </Typography>
        </div>

        <div style={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">
            {post?.tags.map((tag) => `#${tag} `)}
          </Typography>
        </div>

        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          style={classes.title}
        >
          {post?.title}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {post?.message}
          </Typography>
        </CardContent>
      </ButtonBase>

      <CardActions style={classes.cardActions}>
        <Button size="small" color="primary" onClick={handleLike}>
          <Likes />
        </Button>
        {(user?.result?.sub === post?.creator ||
          user?.result?._id === post?.creator) && (
          <div>
            <Button
              size="small"
              color="primary"
              onClick={() => setCurrentId(post._id)}
            >
              <MoreHorizIcon fontSize="small" /> Update
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={() => dispatch(deletePost(post._id))}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </div>
        )}
      </CardActions>
    </Card>
  );
};

export default Note;
