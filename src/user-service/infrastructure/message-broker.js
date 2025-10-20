// src/user-service/infrastructure/message-broker.js
const amqp = require('amqplib');

let channel = null;
let connection = null;

/**
 * Conecta a RabbitMQ y crea un canal.
 */
const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Conectado a RabbitMQ exitosamente.');
  } catch (error) {
    console.error('Error al conectar con RabbitMQ:', error.message);
    throw error;
  }
};

/**
 * Publica un mensaje en una cola específica.
 * @param {string} queue - El nombre de la cola.
 * @param {string} message - El mensaje a enviar (como string).
 */
const publishMessage = async (queue, message) => {
  if (!channel) {
    throw new Error('No hay un canal de RabbitMQ disponible.');
  }
  try {
    // 1. Asegura que la cola exista
    await channel.assertQueue(queue, { durable: true });
    // 2. Envía el mensaje
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  } catch (error) {
    console.error(`Error al publicar mensaje en ${queue}:`, error.message);
  }
};

/**
 * Consume mensajes de una cola específica.
 * @param {string} queue - El nombre de la cola.
 * @param {function} onMessage - La función a ejecutar con el mensaje.
 */
const consumeMessage = async (queue, onMessage) => {
  if (!channel) {
    throw new Error('No hay un canal de RabbitMQ disponible.');
  }
  try {
    await channel.assertQueue(queue, { durable: true });
    
    console.log(`[*] Esperando mensajes en la cola: ${queue}.`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        onMessage(msg);
        channel.ack(msg); // Confirma que el mensaje fue procesado
      }
    });
  } catch (error) {
    console.error(`Error al consumir de la cola ${queue}:`, error.message);
  }
};

module.exports = {
  connectRabbitMQ,
  publishMessage,
  consumeMessage,
  // (Opcional: exportar 'connection' y 'channel' si se necesita gestión avanzada)
};