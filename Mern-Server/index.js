const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Import ObjectId

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB configuration
const uri = "mongodb+srv://kap123msd:SamfzhfG1daQLXQU@cluster0.nko4q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
 

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create Collection of Documents
    const bookCollections = client.db("BookInventory").collection("Books");

    // Insert a Book to the DB: POST Method
    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    });
 // ---------------------------------------------------------------------------------------------------------------------------------
     // Get All  Book Data
     app.get("/all-books",async(req,res) => {
      let query = {};
      if(req.query?.category){
        query = {category: req.query.category}
      }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    })

    // ---------------------------------------------------------------------------------------------------------------------------------
  
    // Update a book's data: PATCH method
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) }; // Use ObjectId here
      const updatedDoc = {
        $set: {
          ...updateBookData,
        },
      };
      const options = { upsert: true };

      // Update the document
      const result = await bookCollections.updateOne(filter, updatedDoc, options);
      res.send(result);
    });


    // Delete a book data
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    })


    // Find By Category
    app.get("/all-books" , async(req, res) =>{
      let query = {};
      if(req.query?.category){
        query = {category: req.query.category}
      }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    })


    // To Get a Single Book Data
    app.get("/book/:id" , async(req, res) =>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await bookCollections.findOne(filter);
      res.send(result) ;   
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});




// -------------------------------------------------------------------------Backend Setup (Order API)


// // backend/routes/order.js
// const express = require('express');
// // const router = express.Router();

// let orders = [];

// router.post('/place-order', (req, res) => {
//     const { _id, bookTitle } = req.body;
//     const order = {
//         orderId: Date.now(),
//         bookTitle,
//         bookId: _id,
//         status: "Paid"
//     };
//     orders.push(order);
//     res.status(201).json({ message: "Order placed successfully", order });
// });

// router.get('/orders', (req, res) => {
//     res.json(orders);
// });

// module.exports = router;



// await fetch('http://localhost:5000/place-order', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ _id, bookTitle }),
// });
