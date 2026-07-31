import { Resend } from 'resend'
import { env } from '../config/env.js'

const resend = new Resend(env.RESEND_API_KEY)

const GMAIL_DESTINO = 'aleojda861@gmail.com'

const sendEditRequestEmail = async ({ nombre, apellido, email, cambios }) => {
    const asunto = `Solicitud de edición de datos - ${nombre} ${apellido}`

    const cuerpoHtml = `
        <p>El usuario <strong>${nombre} ${apellido}</strong> (${email}) solicita estos cambios en sus datos:</p>
        <ul>
            ${cambios.map((c) => `<li><strong>${c.campo}:</strong> "${c.antes}" &rarr; "${c.ahora}"</li>`).join('')}
        </ul>
    `

    await resend.emails.send({
        from: 'Solicitudes <onboarding@resend.dev>', // cambiar por tu dominio verificado cuando lo tengas
        to: GMAIL_DESTINO,
        subject: asunto,
        html: cuerpoHtml,
    })
}

export { sendEditRequestEmail }