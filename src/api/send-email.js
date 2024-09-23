// src/pages/api/send-email.js
import nodemailer from 'nodemailer';

export async function post({ request }) {
  const formData = await request.formData();

  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message');

  // Verifica que todos los campos estén presentes
  if (!name || !email || !phone || !message) {
    return new Response(JSON.stringify({ success: false, error: "Faltan campos obligatorios" }), { status: 400 });
  }

  // Configurar el transportador de nodemailer
  let transporter = nodemailer.createTransport({
    host: 'smtp.tu-host-de-email.com', // Cambia esto por tu host de email
    port: 465, // Puerto SMTP seguro
    secure: true, // Usa SSL
    auth: {
      user: 'tu-correo@tu-dominio.com', // Tu correo electrónico
      pass: 'tu-contraseña', // Tu contraseña
    },
  });

  try {
    // Enviar el correo
    let info = await transporter.sendMail({
      from: '"Formulario de Contacto" <tu-correo@tu-dominio.com>', // Dirección del remitente
      to: 'destinatario@tu-dominio.com', // Dirección de destino (puedes usar tu propio email)
      subject: 'Nuevo Mensaje de Contacto', // Asunto del correo
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    });

    console.log("Mensaje enviado: %s", info.messageId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error enviando correo: ', error);
    return new Response(JSON.stringify({ success: false, error: "Error enviando correo" }), { status: 500 });
  }
}
