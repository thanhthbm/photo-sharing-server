const express = require("express");
const Photo = require("../db/photoModel");
const mongoose = require("mongoose");
const router = express.Router();



router.get('/photosOfUsers/:id', async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send("Invalid id for this user");
    }
    
    try{
        const photos = await Photo.find({user_id: id});
        if (!photos) {
            res.send("No photos found.");
        }

        res.send(photos);
    } catch (e) {
        res.status(500).send({error: e});
    }
})
module.exports = router;
