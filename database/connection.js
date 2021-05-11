const mongoose     = require('mongoose');
const connection = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@10.0.0.186:27017/gortflix?authSource=admin&retryWrites=true&w=majority`;
mongoose.connect(connection, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
    (err) => {
      console.log('poop');
      if (err) {
        throw err;
      } else {
        console.log("Connected to DB");
      }
    }
);