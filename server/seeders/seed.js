const db = require('../config/connection');
const {
  User
} = require('../models');

db.once('open', async () => {
  await User.deleteMany({});

  await User.create({
    username: "bob",
    email: "bob@mail.com",
    password: "password",
    savedBooks: []
  });

  console.log('all done!');
  process.exit(0);
});
