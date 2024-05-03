/*
Author: Sam Gumm, Braeden Hegarty
ISU Netid : smgumm@iastate.edu
Date :  04/30
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
app.get("/listAllProducts", async (req, res) => {
    try {
        console.log("Fetching all products from MongoDB");
        const query = {}; // An empty query object fetches all documents

        const results = await db.collection("birds")
            .find(query)
            .toArray(); // Convert to array to send back to the client

        console.log("Birds and maps retrieved:", results.length);

        res.status(200).json(results); // Send results as JSON

    } catch (error) {
        console.error("Error fetching birds", error);
        res.status(500).send("Server error");
    }
});

app.post("/addProduct", async (req, res) => {
    console.log(req.body);
    try{
        await client.connect();
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
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

    catch (error){
        console.error("Error deleting product:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
    });

    
    app.put("/updateProduct/:bird_name", async (req, res) => {
        try{
            const name = req.params.bird_name;
            const query = { "birds.name": name };
            await client.connect();
            console.log("Product to Update :",name);
            // Data for updating the document
            console.log(req.body);
            const updateData = {

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
    

            const results = await db.collection("birds")
                .find(query)
                .toArray(); // Convert to array to send back to the client
    

                console.log("Birds and maps retrieved:", results.length);
    
            res.status(200).json(results); // Send results as JSON
        } catch (error) {
            console.error("Error fetching birds", error);
            res.status(500).send("Server error");
        }
    });

    app.post("/addLocation", async (req, res) => {
        try {
            const { name, lat, long } = req.body;
    
            const filter = {}; // Empty filter to match all documents
            const update = { $push: { google_maps_locations: { name, lat, long } } }; // Use $push to add new location to the "google_maps_locations" array
    
            const result = await db.collection("birds").updateOne(filter, update);
            console.log("Update result:", result);
    
            res.status(200).json(result);
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).send({ error: 'An internal server error occurred' });
        }
    });
    

