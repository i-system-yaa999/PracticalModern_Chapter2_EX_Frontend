import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyB5feydki3lhfsaNKwWgGAZVzRfGMxk-mk",
      authDomain: "share-app-auth.firebaseapp.com",
      projectId: "share-app-auth",
      storageBucket: "share-app-auth.appspot.com",
      messagingSenderId: "645659354272",
      appId: "1:645659354272:web:b474aa693c156ed648d5c5",
      measurementId: "G-GNLBKDHQ0L"
    }
  )
}
  
export default firebase