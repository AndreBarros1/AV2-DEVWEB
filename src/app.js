require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const prisma = require('./prismaClient');
const jwt = require('fastify-jwt');


fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});


fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});


fastify.register(require('./routes/auth'), { prefix: '/auth' }); // Aqui registramos as rotas
fastify.register(require('./routes/users'), { prefix: '/users' });
fastify.register(require('./routes/meals'), { prefix: '/meals' });

module.exports = fastify;
