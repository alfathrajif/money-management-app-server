import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const categories = [
  { name: 'salary', type: 'income' },
  { name: 'freelance work', type: 'income' },
  { name: 'investment returns', type: 'income' },
  { name: 'rental income', type: 'income' },
  { name: 'business revenue', type: 'income' },
  { name: 'food', type: 'expense' },
  { name: 'rent', type: 'expense' },
  { name: 'entertainment', type: 'expense' },
  { name: 'transportation', type: 'expense' },
  { name: 'subscriptions', type: 'expense' },
  { name: 'groceries', type: 'expense' },
];

const paymentMethods = [{ name: 'cash' }, { name: 'mobile banking' }];

async function main() {
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.paymentMethod.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'testing@gmail.com',
      password: await bcrypt.hash('Password123', 10),
    },
  });

  await prisma.category.createMany({
    data: categories.map((category) => ({
      user_uuid: user.uuid,
      ...category,
    })),
  });

  await prisma.paymentMethod.createMany({
    data: paymentMethods.map((paymentMethod) => ({
      user_uuid: user.uuid,
      ...paymentMethod,
    })),
  });

  const categoriesData = await prisma.category.findMany();
  const paymentMethodsData = await prisma.paymentMethod.findMany();

  for (let i = 0; i < 20; i++) {
    const category = faker.helpers.arrayElement(categoriesData);
    const paymentMethod = faker.helpers.arrayElement(paymentMethodsData);

    await prisma.transaction.create({
      data: {
        user_uuid: user.uuid,
        category_uuid: category.uuid,
        payment_method_uuid: paymentMethod.uuid,
        type: category.type,
        amount: faker.number.int({
          min: 5000,
          max: 10000000,
          multipleOf: 5000,
        }),
        description: faker.lorem.sentence(),
        date: faker.date.past(),
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
