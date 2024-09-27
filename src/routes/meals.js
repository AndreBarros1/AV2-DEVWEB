const prisma = require('../prismaClient');
const { mealSchema } = require('../validators/userValidator');

async function mealRoutes(fastify, options) {
  fastify.addHook('onRequest', fastify.authenticate);

  
  fastify.post('/', async (request, reply) => {
    const { error } = mealSchema.validate(request.body);
    if (error) {
      return reply.status(400).send({ error: error.details[0].message });
    }

    const { name, description, dateTime, inDiet } = request.body;
    const userId = request.user.id;

    try {
      const meal = await prisma.meal.create({
        data: {
          name,
          description,
          dateTime: new Date(dateTime),
          inDiet,
          userId,
        },
      });
      return meal;
    } catch (error) {
      reply.status(500).send({ error: 'Meal registration failed' });
    }
  });

  
  fastify.get('/', async (request, reply) => {
    const userId = request.user.id;

    try {
      const meals = await prisma.meal.findMany({ where: { userId } });
      return meals;
    } catch (error) {
      reply.status(500).send({ error: 'Could not fetch meals' });
    }
  });

  
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params;
    const { name, description, dateTime, inDiet } = request.body;
    const userId = request.user.id;

    try {
      const meal = await prisma.meal.updateMany({
        where: { id: parseInt(id), userId },
        data: { name, description, dateTime: new Date(dateTime), inDiet },
      });
      return meal;
    } catch (error) {
      reply.status(500).send({ error: 'Meal update failed' });
    }
  });


  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.id;

    try {
      await prisma.meal.deleteMany({ where: { id: parseInt(id), userId } });
      reply.send({ message: 'Meal deleted successfully' });
    } catch (error) {
      reply.status(500).send({ error: 'Meal deletion failed' });
    }
  });


  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.id;

    try {
      const meal = await prisma.meal.findFirst({
        where: { id: parseInt(id), userId },
      });
      return meal;
    } catch (error) {
      reply.status(500).send({ error: 'Could not fetch meal' });
    }
  });


  fastify.get('/metrics', async (request, reply) => {
    const userId = request.user.id;

    try {
      const totalMeals = await prisma.meal.count({ where: { userId } });
      const inDietMeals = await prisma.meal.count({
        where: { userId, inDiet: true },
      });
      const outDietMeals = totalMeals - inDietMeals;
      return { totalMeals, inDietMeals, outDietMeals };
    } catch (error) {
      reply.status(500).send({ error: 'Could not fetch metrics' });
    }
  });
}

module.exports = mealRoutes;
