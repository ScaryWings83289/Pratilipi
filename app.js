// Libraries
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const cors = require("cors");
const app = express();

// Routes
const UserRouter = require("./controllers/user");
const ContentRouter = require("./controllers/content");
const InteractionRouter = require("./controllers/interaction");

// MongoDB Configuration
const mongo_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pratilipi_users";
mongoose
  .connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log(err));

// Configuring Sessions
const store = new MongoDBSession({
  uri: mongo_URI,
  collection: "sessions",
});

const sessionOptions = {
  name: "nwayplay",
  secret: "sdassasakjsa",
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {
    path: "/",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

const corsOptions = {
  origin: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Saving User Session to DB
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());
app.use("/user", UserRouter);
app.use("/content", ContentRouter);
app.use("/interaction", InteractionRouter);

// Port Configuration
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
