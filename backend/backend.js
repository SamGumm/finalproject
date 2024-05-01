/*
Author: Sam Gumm, Braeden Hegarty
ISU Netid : smgumm@iastate.edu
Date :  04/30
*/

/*TODO
  - change mongo connections
  - change various wording
  - change CRUD
  - change variables
  - ...
*/

var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";
app.listen(port, () => {
console.log("App listening at http://%s:%s", host, port);
});

const { MongoClient } = require("mongodb");

// MongoDB
const url = "mongodb+srv://smgumm:59755183Gutt!%40@secoms319.tcdgemj.mongodb.net/"
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);

//CRUD
//birds has categories in the json: maps and birds
//i think we'll need to update how we interact with the db
app.get("/listAllProducts", async (req, res) => {
    try {
        console.log("Fetching all products from MongoDB");
        const query = {}; // An empty query object fetches all documents

        //there are two arrays in birds
        const results = await db.collection("birds")
            .find(query)
            .toArray(); // Convert to array to send back to the client

            //change wording
            console.log("Birds and maps retrieved:", results.length);

        res.status(200).json(results); // Send results as JSON
    } catch (error) {
        console.error("Error fetching birds", error);
        res.status(500).send("Server error");
    }
});

//needs to change, id is not applicable
app.get("/:id", async (req, res) => {
    try{
        //wording needs to change
        const productid = Number(req.params.id);
        console.log("Product to find :", productid);
        await client.connect();
        console.log("Node connected successfully to GET-id MongoDB");
        const query = {"id": productid };
        const results = await db.collection("catalog")
        .findOne(query);
        console.log("Results :", results);

        if (!results) res.send("Not Found").status(404);

        else res.send(results).status(200);
    }

    catch(error){
        console.error("Error fetching product", error);
        res.status(500).send("Server error");
    }
});

//maybe we can do a sightings board for the CRUD
//so we dont have to deal with making new bird objects and maps
app.post("/addProduct", async (req, res) => {
    console.log(req.body);
    try{
        await client.connect();
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        //needs to change
        const newDocument = {
            "state": req.body.state,
            "name": req.body.name,
            "science_name": req.body.science_name,
            "description": req.body.description,
            "image": req.body.image,
            };
            console.log(newDocument);
            const filter = {}; // Empty filter to match all documents
            const update = { $push: { birds: newDocument } }; // Use $push to add newBird to the "birds" array
    
            const result = await db.collection("birds").updateOne(filter, update);
            console.log("Update result:", result);
    
            res.status(200).json(result);
    }
    catch(error){
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
 });

 //similarly needs to be changed to be in line with bird idea
 app.delete("/deleteProduct/:bird_name", async (req, res) => {
    try {
        const name = req.params.bird_name;
        await client.connect();
        console.log("Bird name to delete:", name);
        const filter = { "birds.name": name }; // Match the bird by name within the "birds" array

        const update = { $pull: { birds: { name: name } } }; // Use $pull to remove the bird from the "birds" array

        const result = await db.collection("birds").updateOne(filter, update);
        console.log("Update result:", result);

        res.status(200).json(result);
    }
    //wording change
    catch (error){
        console.error("Error deleting product:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
    });

    //change to be in line posting board?
    app.put("/updateProduct/:bird_name", async (req, res) => {
        try{
            const name = req.params.bird_name;
            const query = { "birds.name": name };
            await client.connect();
            console.log("Product to Update :",name);
            // Data for updating the document
            console.log(req.body);
            const updateData = {
                //needs to be updated
                $set:{
                    "birds.$.state": req.body.state,
                    "birds.$.name": req.body.name,
                    "birds.$.science_name": req.body.science_name,
                    "birds.$.description": req.body.description,
                    "birds.$.image": req.body.image,
                }
            };

            const results = await db.collection("birds").updateOne(query, updateData);
            if (results.matchedCount === 0) {
                return res.status(404).send({ message: 'Bird Not Found' });
            }
            res.status(200);
            res.send(results);

        }
        catch(error){
            console.error("Error updating product:", error);
            res.status(500).send({ message: error.message || 'Internal Server Error' });
        }
    });

    app.get("/getAllBirdMapMarkers", async(req, res) =>{
        try {
            console.log("Fetching all products from MongoDB");
            const query = {}; // An empty query object fetches all documents
    
            //there are two arrays in birds
            const results = await db.collection("birds")
                .find(query)
                .toArray(); // Convert to array to send back to the client
    
                //change wording
                console.log("Birds and maps retrieved:", results.length);
    
            res.status(200).json(results); // Send results as JSON
        } catch (error) {
            console.error("Error fetching birds", error);
            res.status(500).send("Server error");
        }
    });
    

