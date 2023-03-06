**How do develop using Prisma**

Prisma is a tool for accessing, modifying, and manipulating databases.

I recommend installing the prisma VSCode extensions (VSCode will prompt to install it once you open the /prisma/schema.prisma file)

Before anything, ensure that Prisma is in sync with the database:
>npx prisma db pull

or
>npm run prisma-pull

(they do the same thing.)

Then you can modify the schema.prisma file to:
*     Change table schemas.
*     Add new tables.
*     Remove Tables

Then, to push the changes to the database, type;
>npx prisma db push

or
>npm run prisma-push

To view the changes on the database, Use a tool like HeidiSQL or https://cloud.prisma.io
**(The login for the database is included in ./backend/.env)**

To change the data and not the schemas, visit the **PrismaClient.ts** file.

The online Prisma documentation will include all the relevant functions. Make sure you look up the functions for MySQL, as prisma will also offer schemas and tables for other types like NoSQL, PostgreSQl, etc.


