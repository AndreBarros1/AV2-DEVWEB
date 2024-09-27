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


fastify.register(require('./routes/users'), { prefix: '/users' });


fastify.register(require('./routes/meals'), { prefix: '/meals' });


const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server running at http://localhost:3000/`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
