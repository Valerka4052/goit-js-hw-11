const axios = require('axios').default;

export async function fetchItems(searchItems, numOfPage) {
  try {
    const options = {
      baseURL: 'https://pixabay.com/api/',
      params: {
        key: '33181746-c383b02523a4c167923538d20',
        q: `${searchItems}`,
        image_type: "photo",
        orientation: "horisontal",
        safesearch: true,
        per_page: 16,
        page: numOfPage,
      },
    };
    const response = await axios(options);
    return response.data;
    } catch (error) {
    console.error(error);
  };
};

