const asyncHandler = require('../middleware/async');

const axios = require('axios');

const accessKey = process.env.UNSPALSH_ACCESS_KEY

const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com/',
  headers: {
    'Authorization': `Client-ID ${process.env.UNSPALSH_ACCESS_KEY}`,
  },
});


// @desc Get photo from unsplash
// @route POST /api/v1/photo/getPhoto/:keyword
// @access public
exports.getSitePhoto = asyncHandler(async (req, res, next) => {
    await unsplash.get(`search/photos?query=${req.body.keyword}`)
        .then((response) => {
            const count = response.data.total;
            const photos = response.data.results.slice(0, 5).map((photo) => ({
            id: photo.id,
            url: photo.urls.regular,
            }));
            
            res.status(200).json({ success: true, count: count, data: photos });
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ success: false, error: 'An error occurred while fetching photos.' });
        })
})