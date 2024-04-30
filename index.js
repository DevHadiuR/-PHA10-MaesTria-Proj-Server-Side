const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is from the server site");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vuymtad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const sculptureCollection = client
      .db("sculptureDB")
      .collection("sculptures");

    const categoryCollection = client
      .db("sculptureDB")
      .collection("sculptureCategory");

    app.get("/addedSculptures", async (req, res) => {
      const result = await sculptureCollection.find().toArray();
      res.send(result);
    });

    app.get("/addedSculptures/:id", async (req, res) => {
      const sculptureId = req.params.id;
      const query = { _id: new ObjectId(sculptureId) };
      const result = await sculptureCollection.findOne(query);
      res.send(result);
    });

    app.delete("/addedSculptures/:id", async (req, res) => {
      const sculptureId = req.params.id;

      const query = { _id: new ObjectId(sculptureId) };
      const result = await sculptureCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/addedSculptures/:id", async (req, res) => {
      const id = req.params.id;

      const updatedBody = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSculture = {
        $set: {
          Image: updatedBody.Image,
          Item_Name: updatedBody.Item_Name,
          Subcategory_Name: updatedBody.Subcategory_Name,
          Short_Description: updatedBody.Short_Description,
          Price: updatedBody.Price,
          Rating: updatedBody.Rating,
          Customization: updatedBody.Customization,
          Processing_Time: updatedBody.Processing_Time,
          Stock_Status: updatedBody.Stock_Status,
          User_Email: updatedBody.User_Email,
          User_Name: updatedBody.User_Name,
        },
      };

      const result = await sculptureCollection.updateOne(
        filter,
        updatedSculture,
        options
      );

      res.send(result);
    });

    app.get("/addedSculptures/byEmail/:User_Email", async (req, res) => {
      const sculptureEmail = req.params.User_Email;
      const query = { User_Email: sculptureEmail };
      const result = await sculptureCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/addedSculptures/category/:Subcategory_Name", async (req, res) => {
      const categoryName = req.params.Subcategory_Name;
      const query = { Subcategory_Name: categoryName };
      const result = await sculptureCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/addSculpture", async (req, res) => {
      const newSculpture = req.body;
      const result = await sculptureCollection.insertOne(newSculpture);
      res.send(result);
    });

    app.get("/subSculptures", async (req, res) => {
      const result = await categoryCollection.find().toArray();

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`website runnning on the port : ${port}`);
});
