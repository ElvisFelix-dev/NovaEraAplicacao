import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    region: { type: String, required: true }, // Ex: Zona Sul
    bedrooms: { type: Number, required: true },
    garage: { type: Number, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    builder: { type: String },
    status: {
      type: String,
      enum: ['planta', 'construcao', 'pronto'],
      default: 'planta',
    },
    images: [{ type: String }],
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true },
)

export default mongoose.model('Property', propertySchema)
