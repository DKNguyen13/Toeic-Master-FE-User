import api from '../config/axios.js';

export const getExam = async (sortBy, page, limit) => {
  try{
    const response = await api.get(`/exams`, {
      params: { sortBy, page, limit },
    });
    return response.data;
  }
  catch (error){
    throw error;
  }
}

export const getWishList = async () => {
  try{
    const response = await api.get(`/wishlist`);
    return response.data;
  }
  catch (error){
    throw error;
  }
}

export const addToWishList = async (examId) => {
  try{
    const response = await api.post(`/wishlist`, {}, {
      params: { examId }
    });
    return response.data;
  }
  catch (error){
    throw error;
  }
}