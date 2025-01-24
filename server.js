const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
// mongoose.connect("mongodb://localhost:27017/loginApp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));





// MongoDB connection atlas
mongoose.connect("mongodb+srv://akshada115:Test1234@cluster0.ez0pz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));



// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  if (req.session.user) {
    res.render("home", { username: req.session.user.username });
  } else {
    res.redirect("/");
  }
});

// Login POST
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    res.redirect("/home");
  } else {
    res.send("Invalid credentials, please try again.");
  }
});

// Signup POST
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
  });

  await newUser.save();
  res.redirect("/");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
