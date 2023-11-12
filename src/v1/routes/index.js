const routers = require('express').Router()
const multer = require('multer');

const authenticationRoutes = require('./authentication.route')
const userRoutes = require('./user.route')
const adminRoutes = require('./admin.route')
const { searchDocuments, insertDocument } = require('../bussiness_logic/elastic')

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

routers.use('/auth/user', authenticationRoutes)
routers.use('/user', userRoutes)
routers.use('/admin', adminRoutes)
routers.post('/searchDocuments', searchDocuments)
router.post('/insertDocumnet', upload.single('file') ,insertDocument);

module.exports = routers
