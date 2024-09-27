const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

async function routes(fastify, options) {
  
  fastify.post('/', async (request, reply) => {
    const { username, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      const token = fastify.jwt.sign({ id: user.id, username: user.username });
      return { token };
    } catch (error) {
      reply.status(500).send({ error: 'User creation failed' });
    }
  });

  
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;

    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign({ id: user.id, username: user.username });
      return { token };
    } catch (error) {
      reply.status(500).send({ error: 'Login failed' });
    }
  });
}

module.exports = routes;
