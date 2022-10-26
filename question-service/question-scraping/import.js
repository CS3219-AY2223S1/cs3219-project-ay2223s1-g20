// Imports
const { initializeFirebaseApp, restore } = require('firestore-export-import')
const serviceAccount = require('./service-account.json');

// JSON To Firestore
const jsonToFirestore = async () => {
  try {
    console.log('Initializing Firebase');
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