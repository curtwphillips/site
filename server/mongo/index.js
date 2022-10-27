const { MongoClient } = require('mongodb');
exports.db = null;

exports.connect = async (uri) => {
  try {
    console.log('mongodb connect to uri:', uri);
    if (!uri) {
      throw new Error('missing uri parameter');
    }
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongodb connected');
    exports.db = client.db();
  } catch (err) {
    console.log(err);
  }
};
