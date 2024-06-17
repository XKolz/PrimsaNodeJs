
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function main() {
//   // Fetch all posts with their comments and authors
//   const posts = await prisma.post.findMany({
//     include: {
//       author: true,
//       comments: {
//         include: {
//           author: true,
//         },
//       },
//     },
//   });
//   console.log('All posts with comments and authors:', JSON.stringify(posts, null, 2));

//   // Fetch a specific user with their posts and comments
//   const user = await prisma.user.findUnique({
//     where: {
//       email: 'alice@example.com',
//     },
//     include: {
//       posts: {
//         include: {
//           comments: true,
//         },
//       },
//       comments: true,
//     },
//   });
//   console.log('User with posts and comments:', JSON.stringify(user, null, 2));

//   //new
//   const userCount = await prisma.user.count();
// console.log('Total number of users:', userCount);

// const averagePosts = await prisma.post.aggregate({
//   _avg: {
//     id: true,
//   },
// });
// console.log('Average post ID:', averagePosts);

// //new2
// const paginatedPosts = await prisma.post.findMany({
//     skip: 10,
//     take: 5,
//   });
//   console.log('Paginated posts:', paginatedPosts);

//   //new3
//   const rawUsers = await prisma.$queryRaw`SELECT * FROM User`;
// console.log('Users from raw SQL query:', rawUsers);


// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function main() {
  // Existing functionality
  // Fetch all posts with their comments and authors
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });
  console.log('All posts with comments and authors:', JSON.stringify(posts, null, 2));

  // Fetch a specific user with their posts and comments
  const user = await prisma.user.findUnique({
    where: {
      email: 'alice@example.com',
    },
    include: {
      posts: {
        include: {
          comments: true,
        },
      },
      comments: true,
    },
  });
  console.log('User with posts and comments:', JSON.stringify(user, null, 2));

  // Count users
  const userCount = await prisma.user.count();
  console.log('Total number of users:', userCount);

  // Aggregate posts
  const averagePosts = await prisma.post.aggregate({
    _avg: {
      id: true,
    },
  });
  console.log('Average post ID:', averagePosts);

  // Paginated posts
  const paginatedPosts = await prisma.post.findMany({
    skip: 10,
    take: 5,
  });
  console.log('Paginated posts:', paginatedPosts);

  // Raw SQL query
  const rawUsers = await prisma.$queryRaw`SELECT * FROM User`;
  console.log('Users from raw SQL query:', rawUsers);
}

// Call the main function to execute existing functionality
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// REST API endpoints

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email, bio } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, bio },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, bio } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, bio },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
// app.delete('/users/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await prisma.user.delete({
//       where: { id: parseInt(id) },
//     });
//     res.status(204).end();
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
//custom
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Delete the user
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: `User with ID ${id} deleted successfully`, user: deletedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
