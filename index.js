const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

// Connect to mlab database.
// Make sure to replace my db string & creds with your own
mongoose.connect('mongodb://root:cool123@ds247270.mlab.com:47270/graphql', {
    useNewUrlParser: true
});
mongoose.connection.once('open', () => {
    console.log('connected to database');
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log(`Now listening for requests on port 4000`);
});
