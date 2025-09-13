import express from 'express'
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  filterProperties,
  removePropertyImage,
  deletePropertyImage,
} from '../controllers/propertyController.js'
import { upload } from '../utils/upload.js'
import protect from '../middlewares/authMiddleware.js'

const router = express.Router()

// Criação de imóvel com imagens
router.post(
  '/create-property',
  protect,
  upload.array('images', 10),
  createProperty,
)

// CRUD
// router.post('/create', protect, createProperty)
router.get('/', protect, getProperties)
router.get('/:id', getPropertyById)
router.put('/:id', protect, updateProperty)
router.delete('/:id/images', protect, removePropertyImage)
router.delete('/:id/images/:public_id', protect, deletePropertyImage)

// Filtro
router.get('/search/filter', protect, filterProperties)

export default router
