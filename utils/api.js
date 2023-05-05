import axios from 'axios';

export const getPosts = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return data.slice(0, 20);
};

export const createPost = async (payload) => {
  const { data } = await axios.post('https://jsonplaceholder.typicode.com/posts', payload);
  return data;
};

export const editPost = async (payload) => {
  const { data } = await axios.put(`https://jsonplaceholder.typicode.com/posts/${payload.id}`, payload);
  return data;
};

export const deletePost = async (payload) => {
  const { data } = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${payload.id}`);
  return data;
};