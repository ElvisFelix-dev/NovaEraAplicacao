import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' }, // 🆕 campo avatar
    role: { type: String, enum: ['admin', 'user'], default: 'admin' },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
)

// 🔹 Criptografar senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// 🔹 Comparar senha
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// 🔹 Gerar token de reset de senha
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash do token para salvar no DB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Expira em 1 hora
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000

  return resetToken
}

export default mongoose.model('User', userSchema)
