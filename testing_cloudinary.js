// THIS IS JUST FOR PRACTICE

require('dotenv').config()

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  api_key: process.env.CLOUDINARY_API_KEY
});

// Log the configuration
console.log(cloudinary.config());

/////////////////////////
// Uploads an image file
/////////////////////////
// const imagePath = 'testing_cloudinary_image.jpg'
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload('testing_cloudinary_image.jpg', options);
      console.log(result);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
};

// uploadImage()