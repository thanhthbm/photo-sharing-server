const express = require("express");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const router = express.Router();


router.get('/:id', async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send("Invalid id for this user");
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).send("User not found");
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.get("/list", async (req, res) => {
  try {
      const users = await User.find({}).select('_id first_name last_name');
      res.send(users);
  } catch (err){
      res.status(500).send({error: "Failed to fetch users"});
  }
});


module.exports = router;