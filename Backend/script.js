const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded images

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/kyc_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a schema for KYC data
const kycSchema = new mongoose.Schema({
  name: String,
  dob: String,
  address: String,
  incomeRange: String,
  employmentType: String,
  panCard: String,
  aadhaar: String,
  livePhoto: String,
  signature: String
});

// Create a model for KYC data based on the schema
const KYC = mongoose.model('KYC', kycSchema);

// Endpoint for uploading image
app.post('/uploadImage', upload.single('image'), (req, res) => {
    // Handle uploaded image (store it in a database, etc.)
    const uploadedImage = req.file;
    console.log('Image uploaded:', uploadedImage);
    res.send('Image uploaded successfully');
});

// Endpoint for submitting KYC data
app.post('/submitKYC', (req, res) => {
    // Retrieve KYC data from request body
    const kycData = req.body;

    // Create a new KYC document using the model
    const kyc = new KYC({
        name: kycData.name,
        dob: kycData.dob,
        address: kycData.address,
        incomeRange: kycData.incomeRange,
        employmentType: kycData.employmentType,
        panCard: kycData.panCard,
        aadhaar: kycData.aadhaar,
        livePhoto: kycData.livePhoto,
        signature: kycData.signature
    });

    // Save the KYC document to the database
    kyc.save((err, savedKYC) => {
        if (err) {
            console.error('Error saving KYC data:', err);
            res.status(500).send('Error saving KYC data');
        } else {
            console.log('KYC data saved successfully:', savedKYC);
            res.status(200).send('KYC data saved successfully');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
