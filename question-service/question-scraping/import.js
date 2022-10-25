// Imports
const { initializeFirebaseApp, restore } = require('firestore-export-import')
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');

// JSON To Firestore
const jsonToFirestore = async () => {
  try {
    console.log('Initialzing Firebase');
    await initializeFirebaseApp(serviceAccount);
    console.log('Firebase Initialized');

    await restore('./processed-data.json');
    console.log('Upload Success');
  }
  catch (error) {
    console.log(error);
  }
};

jsonToFirestore();