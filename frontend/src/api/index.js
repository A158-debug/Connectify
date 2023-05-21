import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    console.log(req.headers.Authorization)
  }
  return req;
});

export const fetchNotes = () => API.get('/posts');
export const createNote = (newPost) => API.post('/posts', newPost);
export const likeNote = (id) => API.patch(`/posts/${id}/likePost`);
export const updateNote = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deleteNote = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);


