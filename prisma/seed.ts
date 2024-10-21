import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const categories = [
  { name: 'Salary', type: 'income' },
  { name: 'Freelance Work', type: 'income' },
  { name: 'Investment Returns', type: 'income' },
  { name: 'Rental Income', type: 'income' },
  { name: 'Business Revenue', type: 'income' },
  { name: 'Food', type: 'expense' },
  { name: 'Rent', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Transportation', type: 'expense' },
  { name: 'Subscriptions', type: 'expense' },
  { name: 'Groceries', type: 'expense' },
];

async function main() {
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
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

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          user_uuid: user.uuid,
          name: category.name,
          type: category.type,
        },
      }),
    ),
  );

  for (let i = 0; i < 20; i++) {
    const category = faker.helpers.arrayElement(createdCategories);

    await prisma.transaction.create({
      data: {
        user_uuid: user.uuid,
        category_uuid: category.uuid,
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
