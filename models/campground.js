const mongoose = require("mongoose");


const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

//This is a pre hook to remove all comments on deletion of post

const Comment = require("./comment");
    campgroundSchema.pre("remove", async function () {
    await Comment.deleteMany({
    _id: {
      $in: this.comments,
    },
  });
});

module.exports = mongoose.model("Campground", campgroundSchema)

 