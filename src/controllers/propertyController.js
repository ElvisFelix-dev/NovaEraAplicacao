import { v2 as cloudinary } from 'cloudinary'

import { getCoordinatesFromAddress } from '../utils/geocode.js'
import Property from '../models/Property.js'

/**
 * Criar Property
 */
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      region,
      bedrooms,
      garage,
      price,
      countInStock,
      builder,
      status,
    } = req.body

    if (!address) {
      return res.status(400).json({ message: 'O endereço é obrigatório' })
    }

    // 🔹 Buscar coordenadas do endereço
    const coordinates = await getCoordinatesFromAddress(address)
    if (!coordinates) {
      return res
        .status(400)
        .json({ message: 'Não foi possível obter a localização' })
    }

    // 🔹 Pegar imagens enviadas pelo multer (Cloudinary)
    const images = req.files ? req.files.map((file) => file.path) : []

    // 🔹 Criar a property
    const property = new Property({
      title,
      description,
      address,
      region,
      bedrooms,
      garage,
      price,
      countInStock,
      builder,
      status,
      images,
      location: coordinates,
      createdBy: req.user._id, // middleware protect garante que req.user exista
    })

    const savedProperty = await property.save()
    res.status(201).json(savedProperty)
  } catch (error) {
    console.error('❌ Erro ao criar propriedade:', error)
    res.status(500).json({ message: 'Erro ao criar propriedade' })
  }
}

/**
 * Listar todas as Properties
 */
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('createdBy', 'name email')
    res.json(properties)
  } catch (error) {
    console.error('❌ Erro ao buscar propriedades:', error)
    res.status(500).json({ message: 'Erro ao buscar propriedades' })
  }
}

/**
 * Buscar Property por ID
 */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'createdBy',
      'name email',
    )
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' })
    }
    res.json(property)
  } catch (error) {
    console.error('❌ Erro ao buscar propriedade:', error)
    res.status(500).json({ message: 'Erro ao buscar propriedade' })
  }
}

/**
 * Atualizar Property
 */
// 📌 Atualizar Property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params

    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' })
    }

    // 🔒 Garantir que só o criador (ou admin, se você quiser) edite
    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Não autorizado' })
    }

    // Se vierem novas imagens no upload
    let newImages = property.images
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map((file) => file.path)
      newImages = [...newImages, ...uploadedUrls] // adiciona sem apagar as antigas
    }

    // Atualiza os campos (fallback para valores já existentes)
    property.title = req.body.title || property.title
    property.description = req.body.description || property.description
    property.address = req.body.address || property.address
    property.region = req.body.region || property.region
    property.bedrooms = req.body.bedrooms || property.bedrooms
    property.garage = req.body.garage || property.garage
    property.price = req.body.price || property.price
    property.countInStock = req.body.countInStock || property.countInStock
    property.builder = req.body.builder || property.builder
    property.status = req.body.status || property.status
    property.images = newImages

    const updatedProperty = await property.save()

    res.json(updatedProperty)
  } catch (error) {
    console.error('❌ Erro ao atualizar propriedade:', error)
    res.status(500).json({ message: 'Erro ao atualizar propriedade' })
  }
}

/**
 * Deletar Property
 */
export const deletePropertyImage = async (req, res) => {
  try {
    const { id, public_id } = req.params // id = propertyId, public_id = Cloudinary image ID

    // 1️⃣ Buscar a property
    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' })
    }

    // 2️⃣ Deletar a imagem do Cloudinary
    await cloudinary.uploader.destroy(public_id)

    // 3️⃣ Remover do array de imagens no MongoDB
    property.images = property.images.filter(
      (img) => img.public_id !== public_id,
    )
    await property.save()

    res.json({ message: 'Imagem removida com sucesso', property })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao deletar imagem', error })
  }
}

/**
 * Filtros de pesquisa
 * Query params: region, bedrooms, garage, status
 */
export const filterProperties = async (req, res) => {
  try {
    const { region, bedrooms, garage, status } = req.query
    const filter = {}

    if (region) filter.region = region
    if (bedrooms) filter.bedrooms = bedrooms
    if (garage) filter.garage = garage
    if (status) filter.status = status

    const properties = await Property.find(filter).populate(
      'createdBy',
      'name email',
    )

    res.json(properties)
  } catch (error) {
    console.error('❌ Erro ao filtrar propriedades:', error)
    res.status(500).json({ message: 'Erro ao filtrar propriedades' })
  }
}

export const removePropertyImage = async (req, res) => {
  try {
    const { id } = req.params
    const { imageUrl } = req.body // URL da imagem a remover

    if (!imageUrl) {
      return res.status(400).json({ message: 'Informe a URL da imagem' })
    }

    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' })
    }

    // 🔒 Apenas o criador pode remover imagens
    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Não autorizado' })
    }

    // Remove do Cloudinary
    const publicId = imageUrl.split('/').pop().split('.')[0] // pega o ID da imagem
    await cloudinary.uploader.destroy(`properties/${publicId}`)

    // Remove do array do Mongo
    property.images = property.images.filter((img) => img !== imageUrl)
    await property.save()

    res.json({
      message: 'Imagem removida com sucesso',
      images: property.images,
    })
  } catch (error) {
    console.error('❌ Erro ao remover imagem do property:', error)
    res.status(500).json({ message: 'Erro ao remover imagem' })
  }
}
