import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendWelcomeEmail, sendResetPasswordEmail } from '../config/email.js'

// =========================
// 📌 Registrar usuário
// =========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists)
      return res.status(400).json({ message: 'Usuário já registrado' })

    const newUser = await User.create({ name, email, password }) // senha pura, será hasheada no pre-save

    // Envia email de boas-vindas (não bloqueia resposta)
    sendWelcomeEmail(newUser.email, newUser.name).catch((err) =>
      console.error('Erro ao enviar email de boas-vindas:', err),
    )

    res.status(201).json({
      message:
        'Usuário registrado com sucesso! Um email de boas-vindas foi enviado.',
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    })
  } catch (error) {
    console.error('❌ Erro no registro:', error)
    res.status(500).json({ message: 'Erro ao registrar usuário' })
  }
}

// =========================
// 📌 Login de usuário
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: 'Usuário não encontrado' })

    const isMatch = await user.matchPassword(password) // usa método do schema
    if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 🔹 Agora envia a role
      },
    })
  } catch (error) {
    console.error('❌ Erro no login:', error)
    res.status(500).json({ message: 'Erro no login' })
  }
}

// =========================
// 🔹 Solicitar reset de senha
// =========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado' })

    const resetToken = user.getResetPasswordToken()
    await user.save()

    await sendResetPasswordEmail(user.email, resetToken)

    res.json({ message: 'Token de reset enviado para seu e-mail' })
  } catch (error) {
    console.error('❌ Erro ao enviar token de reset:', error)
    res.status(500).json({ message: 'Erro ao enviar token de reset' })
  }
}

// =========================
// 🔹 Resetar senha usando token
// =========================
export const resetPassword = async (req, res) => {
  try {
    console.log('📩 Token recebido:', req.params.token)
    console.log('📩 Body recebido:', req.body)

    const { token } = req.params
    const { password } = req.body

    if (!token) return res.status(400).json({ message: 'Token é obrigatório' })

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user)
      return res.status(400).json({ message: 'Token inválido ou expirado' })

    user.password = password // será hasheada no pre-save
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ message: 'Senha redefinida com sucesso!' })
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error)
    res.status(500).json({ message: 'Erro ao resetar senha' })
  }
}

// =========================
// 📌 Perfil do usuário logado
// =========================
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user)
      return res.status(404).json({ message: 'Usuário não encontrado' })
    res.json(req.user)
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error)
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário' })
  }
}
