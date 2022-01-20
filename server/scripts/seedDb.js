const { find, insertMany } = require("../mongo/operations");
const data = require("./data.json");

// project example: { name: 1, _id: 0 }
exports.seedDb = async () => {
  for (const collection in data) {
    const {filter, projection, comparisonField} = data[collection];
    const dbDocs = await find(collection, filter, projection);
    const comparisonValues = dbDocs.map((dbDoc) => dbDoc[comparisonField]);
    const missingDocs = [];

    for (const doc of data) {
      if (!comparisonValues.includes(doc[comparisonField])) {
        missingDocs.push(doc);
      }
    }

    if (missingDocs.length) await insertMany(collection, missingDocs);
  }
};