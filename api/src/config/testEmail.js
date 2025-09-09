import { transporter } from './email.js'

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Equipe Visinários" <${process.env.EMAIL_USER}>`,
      to: 'elvisfelix_575@hotmail.com',
      subject: 'Teste Nodemailer',
      text: 'Funcionou!',
    })
    console.log('Email enviado:', info.messageId)
  } catch (error) {
    console.error('Erro ao enviar:', error)
  }
}

sendTestEmail()
