import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyB5-P498XFuiCijJsZpgYeYEJubEvYZXY4",
  authDomain: "mayhillct.firebaseapp.com",
  databaseURL: "https://mayhillct.firebaseio.com",
  projectId: "mayhillct",
  storageBucket: "mayhillct.appspot.com",
  messagingSenderId: "485243074548"
};

firebase.initializeApp(config);

export default firebase;