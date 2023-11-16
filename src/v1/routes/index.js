const routers = require('express').Router()
const multer = require('multer');

const authenticationRoutes = require('./authentication')
const userRoutes = require('./user')
const adminRoutes = require('./admin')
const { searchDocuments, insertDocument } = require('../controllers/elastic')

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
routers.get('/searchDocuments', searchDocuments)
routers.post('/insertDocumnet', upload.single('file') ,insertDocument);

module.exports = routers
