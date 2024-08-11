const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://localhost:27017/GalleryRecords")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Defining the data structure of the loginRecord collection
const loginSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  user_password: {
    type: String,
    required: true,
  },
});

// Defining the data structure of the images collection
const imageSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    lowercase: true
  },
  url: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});

// Defining the data structure of the images collection
const collectionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  imageCollection: {
    type: [String],
  },
});

// Defining the model of the collection LoginRecord (collection creation)
const LoginRecord = mongoose.model("LoginRecord", loginSchema);

// Defining the model of the collection ImageRecord (collection creation)
const ImageRecord = mongoose.model("ImageRecord", imageSchema);

// Defining the model of the collection UserCollections (collection creation)
const UserCollectionRecord = mongoose.model(
  "UserCollectionRecord",
  collectionSchema
);

const passWordHashing = async (user_password) => {
  try {
    const hashPassword = await bcrypt.hash(user_password, 5);
    return hashPassword;
  } catch (error) {
    throw error;
  }
};

const createLoginRecordDocument = async (user_id, user_password) => {
  try {
    user_password = await passWordHashing(user_password);
    const user = new LoginRecord({ user_id, user_password });
    const result = await user.save();
    return result._id.toString();
  } catch (error) {
    throw error;
  }
};

const createImageRecordDocument = async (
  user_id,
  title,
  tags,
  url,
  width,
  height
) => {
  try {
    const imageDetails = new ImageRecord({
      user_id,
      title,
      tags,
      url,
      width,
      height,
    });
    const result = await imageDetails.save();
    return result;
  } catch (error) {
    throw error;
  }
};

const getImageRecordDocuments = async () => {
  try {
    const imageDetails = await ImageRecord.find().limit(10).exec();
    return imageDetails;
  } catch (error) {
    throw error;
  }
};

const checkUser = async (userId) => {
  try {
    const res = await LoginRecord.findOne({ user_id: userId });
    return !!res;
  } catch (error) {
    throw error;
  }
};

const checkLoginStatus = async (userId) => {
  try {
    const res = await LoginRecord.findOne({ user_id: userId });
    return res;
  } catch (error) {
    throw error;
  }
};

const verifyPassword = async (user_password, user_hash_password) => {
  try {
    const match = await bcrypt.compare(user_password, user_hash_password);
    return match;
  } catch (error) {
    throw error;
  }
};

const getImages = async (skip, limit) => {
  try {
    const images = await ImageRecord.find().skip(skip).limit(limit).exec();
    return images;
  } catch (error) {
    throw error;
  }
};

const getSearch = async (skip, limit, searchTags) => {
  try {
    const images = await ImageRecord.find({'tags': {$in: searchTags}}).skip(skip).limit(limit).exec();
    return images;
  } catch (error) {
    throw error;
  }
};

const addToCollection = async (id, user) => {
  try {
    await UserCollectionRecord.updateOne(
      { user_id: user },
      { $push: { imageCollection: id } },
      { upsert: true }
    );
    return "Added to collection successfully";
  } catch (error) {
    throw error;
  }
};

const findRecord = async (id) => {
  try {
    const rec = await ImageRecord.find({ _id: id });
    return rec;
  } catch (error) {
    throw error;
  }
};

const fetchCollection = async (user) => {
  try {
    const resp = await UserCollectionRecord.find({ user_id: user }, { imageCollection: 1 });
    if (resp.length === 0) {
      throw new Error(`No collection found for user: ${user}`);
    }
    const imageIds = resp[0].imageCollection;
    const images = await ImageRecord.find({ _id: { $in: imageIds } });
    return images;
  } catch (error) {
    throw error;
  }
}

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post("/create_account", async (req, res) => {
  const data = req.body;
  try {
    const userExists = await checkUser(data.user_id_val);
    if (userExists) {
      res.status(409).json({
        message:
          "User already exists with this username. Try a different one or Sign In.",
      });
    } else {
      await createLoginRecordDocument(data.user_id_val, data.user_password_val);
      res
        .status(201)
        .json({ message: "Account created successfully. Please Sign in..." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to create account.", error });
  }
});

app.post("/sign_in", async (req, res) => {
  const { user_id_val, user_password_val } = req.body;
  try {
    const user = await checkLoginStatus(user_id_val);
    if (user) {
      const verification = await verifyPassword(
        user_password_val,
        user.user_password
      );
      if (verification) {
        res
          .status(200)
          .json({ message: "Login successful", user: user._id.toString() });
      } else {
        res.status(401).json({ message: "Incorrect Password" });
      }
    } else {
      res.status(401).json({ message: "No account exists. Create an account" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred, try again later...", error });
  }
});

app.post("/add_image", async (req, res) => {
  let { user_id, imageTitle, imageTags, imageURL, imageWidth, imageHeight } =
    req.body;
    imageTags = imageTags.map(tag => tag.toLowerCase());
  try {
    const result = await createImageRecordDocument(
      user_id,
      imageTitle,
      imageTags,
      imageURL,
      imageWidth,
      imageHeight
    );
    res.status(201).json({ message: "Image added successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to add image.", error });
  }
});

app.get("/fetch_featured_items", async (req, res) => {
  try {
    const result = await getImageRecordDocuments();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items.", error });
  }
});

app.get("/fetch_images", async (req, res) => {
  try {
    const { skip, limit, search } = req.query;
    let result;
    if(search){
      const searchTags = search.split(/\s+/).map(word => word.trim().toLowerCase());
       result = await getSearch(skip, limit, searchTags);
    }else{
       result = await getImages(skip, limit);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items.", error });
  }
});

app.post("/add_to_collection", async (req, res) => {
  const { id, user } = req.body;
  try {
    const userDoc = await UserCollectionRecord.findOne({ user_id: user });

    if (userDoc && userDoc.imageCollection.includes(id)) {
      res.status(200).json({ message: "Already present in your collection" });
    } else {
      await addToCollection(id, user);
      res.status(200).json({ message: "Added Successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add to your collection" });
  }
});

app.get("/image_details", async (req, res) => {
  const id = req.query.id;
  try{
    const record = await findRecord(id);
    res.status(200).json({ message: "Added Successfully", image: record });
  }catch(error){
    res.status(500).json({ message: "Failed to get image Details" });
  }
});

app.get("/fetch_my_collection", async (req, res) => {
  try {
    const {user} = req.query;
    const record = await fetchCollection(user);
    res.status(200).json({ message: "Fetched Successfully", collection: record });
  } catch (error) {
    res.status(404).json({ message: "Failed to get your collections", error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

