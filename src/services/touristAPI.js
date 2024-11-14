import axios from 'axios';

const API_KEY = 'fsq3vMdSyCu+nO3jWHNSbVdaFZLRPpydr9qZasf0Bj7QEB8=';
const BASE_URL = 'https://api.foursquare.com/v3/places';

export const fetchTouristSpots = async (latitude, longitude) => {
  const response = await axios.get(`${BASE_URL}/nearby`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    params: {
      ll: `${latitude},${longitude}`,
      radius: 5000, // 5km de raio
    },
  });
  return response.data.results;
};
