const express = require("express");
const Photo = require("../db/photoModel");
const mongoose = require("mongoose");
const router = express.Router();



router.get('/photosOfUser/:id', async (req, res) => {
    const { id } = req.params;

    // 1. Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid user id format.' });
    }

    try {
        // 2. Query for photos (only needed fields)
        const photos = await Photo.find({ user_id: id }, '_id user_id file_name date_time comments').lean();

        // 3. Assemble the API model
        const result = await Promise.all(
            photos.map(async (photo) => {
                // For each comment, fetch user info and build a new comment object
                const processedComments = await Promise.all(
                    (photo.comments || []).map(async (comment) => {
                        const user = await User.findById(comment.user_id, '_id first_name last_name').lean();
                        return {
                            _id: comment._id,
                            comment: comment.comment,
                            date_time: comment.date_time,
                            user: user
                                ? {
                                    _id: user._id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                }
                                : null,
                        };
                    })
                );

                // Build and return the new photo object
                return {
                    _id: photo._id,
                    user_id: photo.user_id,
                    file_name: photo.file_name,
                    date_time: photo.date_time,
                    comments: processedComments,
                };
            })
        );

        // 4. Return the result array
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: 'Server error.' });
    }
});

module.exports = router;
