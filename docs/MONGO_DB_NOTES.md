# Mongo DB Connection notes 

### Requirements

```bash
npm install mongodb
# or ...
yarn add mongodb
```



### Demo code snippet 

Courtesy of cloud.mongodb.com.
Use the `.env` file for db uri.  

```javascript
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@productcluster.crksy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
```



### Note

The user in `.env` has the role `readWriteAnyDatabase`.


#### MongoDB Atlas Free Tier Limitations
- Storage: 512MB
- RAM: Shared 
- vCPU: Shared 
- 100 max connections 
- One M0 Cluster 

#### Other Cluster Specs
- VERSION: 4.4.11
- REGION: AWS / Stockholm (eu-north-1)
- CLUSTER TIER: M0 Sandbox (General)
- TYPE: Replica Set - 3 nodes
- BACKUPS: Inactive
- LINKED REALM APP: None Linked
- ATLAS SEARCH: Create Index
