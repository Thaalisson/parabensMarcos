const crypto = require('crypto');

exports.handler = async (event, context) => {
  try {
    const { timestamp } = JSON.parse(event.body);

    const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!timestamp) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "timestamp obrigatório" }),
      };
    }

    // Gera a assinatura usando SHA-1
    const signature = crypto
      .createHash('sha1')
      .update(`timestamp=${timestamp}${cloudinaryApiSecret}`)
      .digest('hex');

    return {
      statusCode: 200,
      body: JSON.stringify({ signature }),
    };
  } catch (error) {
    console.error("Erro ao gerar assinatura:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno ao gerar assinatura" }),
    };
  }
};
