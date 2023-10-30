require('dotenv').config()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

// configure cloudinary
cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY
})

// configure the storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'debeechat/profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{width: 200, height: 200, crop: 'limit'}]
    }
})

// create a multer instance of the storage
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Invalid file format. Only JPEG and PNG images are allowed.'), false);
        }
      }
})

// async function uploadToServer (req, file) {
//     try {
//         const storage = multer.diskStorage({
//             destination: function(req, file, cb) {
//                 cb(null, 'public/images/')
//             },
//             filename: function(req, file, cb) {
//                 console.log(file.mimetype);
//                 const mimeExt = file.mimetype.split('/')[1]
//                 cb(null, `debeechat${Date.now()}.${mimeExt}`)
//             }
//         })
//         const upload = multer({storage: storage})
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function uploadToCloud (filePath) {
//     try {
//         const options = {
//             use_filename: true,
//             unique_filename: false,
//             overwrite: true
//         }
//         const result = await cloudinary.uploader.upload(filePath, options)
//         console.log(result)
//         return result
//     } catch (error) {
//         console.log(error)
//     }
// }

// module.exports = {uploadToServer, uploadToCloud}
module.exports = upload
