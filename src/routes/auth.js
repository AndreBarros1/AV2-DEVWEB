const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const { userSchema } = require('../validators/userValidator');

async function authRoutes(fastify, options) {
  
  fastify.post('/register', async (request, reply) => {
    const { error } = userSchema.validate(request.body);
    if (error) {
      console.log("Validation error during registration:", error.details); 
      return reply.status(400).send({ error: error.details[0].message });
    }

    const { name, email, password } = request.body; 
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      const token = fastify.jwt.sign({ id: user.id, name: user.name });
      return { token };
    } catch (error) {
      console.error("Error during user registration:", error); 
      reply.status(500).send({ error: 'User registration failed' });
    }
  });

 
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body; 

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign({ id: user.id, name: user.name });
      return { token };
    } catch (error) {
      console.error("Error during user login:", error); 
      reply.status(500).send({ error: 'Login failed' });
    }
  });
}

module.exports = authRoutes;
