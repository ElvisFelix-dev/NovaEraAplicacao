import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Função para enviar e-mail de boas-vindas
export const sendWelcomeEmail = async (to, name) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <table align="center" cellpadding="0" cellspacing="0" width="600"
            style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <tr>
          <td align="center" bgcolor="#2e4fbbff" style="padding: 20px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Equipe Visionários 🚀</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px; color: #333;">
            <h2 style="margin-top: 0;">Olá, ${name}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Seja muito bem-vindo a <strong>Equipe Visionários 🚀</strong>.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              A partir de agora, você terá acesso a uma plataforma <strong>moderna</strong> e
              <strong>prática</strong> para gerenciar <strong>imóveis</strong>
              de forma simples e eficiente.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Nossa equipe está à disposição para ajudar você a aproveitar ao máximo todos os recursos.
            </p>
            <br/>
            <p style="font-size: 16px;">Atenciosamente,</p>
            <p style="font-weight: bold; font-size: 16px; margin: 0;"> Equipe Visionários 🚀</p>
          </td>
        </tr>
        <tr>
        <td align="center" bgcolor="#f4f6f8" style="padding: 15px; font-size: 12px; color: #666;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Equipe Visionários - Todos os direitos reservados</p>
        </td>
      </tr>
      </table>
    </div>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Equipe Visionários 🏡" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Bem-vindo a Equipe Visionários 🚀',
      html: htmlContent,
    })
    console.log('✅ Email enviado:', info.messageId)
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    throw error
  }
}

export const sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `http://localhost:5173/reset-password/${token}`
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">

      <h2 style="color: #333333; text-align: center;">Redefinição de senha</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        Você solicitou redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}"
          style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
          Redefinir Senha
        </a>
      </div>

      <p style="color: #999999; font-size: 14px; line-height: 1.5; text-align: center;">
        Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.
      </p>

      <p style="color: #999999; font-size: 12px; line-height: 1.5; text-align: center; margin-top: 20px;">
        &copy; ${new Date().getFullYear()} Equipe Visionários 🚀. Todos os direitos reservados.
      </p>
    </div>
  </div>
`

  await transporter.sendMail({
    from: `"Equipe Visionários 🏡" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Redefinição de senha Equipe Visionários',
    html: htmlContent,
  })
}
