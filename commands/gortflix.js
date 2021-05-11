const User = require('../database/userModel');
const jwt = require('jsonwebtoken');
const token_secret = "jasfuiheyuiohef89037y213vbg2d7";
const systools = require('../systools');

async function requestAddAccount(message) {
  let args = message.content.split(' ');
  args.shift();
  let username = args[0];
  let password = jwt.sign(username, token_secret);
  const user = new User({username, password});

  user.save(async (err) => {
    if (err) {
      systools.saveLogs("create_user", err.toString());
      message.author.send('goddamnit tell gort his bots broken. log type CREATE_USER @ '+new Date(Date.now()));
    } else {
      systools.saveLogs("new_user", `Created new user for discord user ${message.author.username}`);
      message.author.send(`your temporary password is ${password}`);
    }
  });
}

async function test(message) {
  let args = message.content.split(' ');
  args.shift();

  let username = args[0];
  let password = args[1];

  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error("no user found");

    user.isCorrectPassword(password, (err, same) => {
      if (err) {
        systools.saveLogs("login", err.toString());
        return message.author.send("fuck you. tell gort his bots fucked up.");
      }
      if (!same) {
        systools.saveLogs("login", message.author.username+" tried to login with the WRONG PASSWORD");
        return message.author.send("not the same passwd");
      }
      message.author.send(`"logged in" hehe`);
    });
  } catch (err) {
    systools.saveLogs("login", err.toString);
    message.author.send('fuck you tell gort his bots broken.');
  }

}

module.exports = {
  requestAddAccount,
  test
}