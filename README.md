# FlashChat — Firebase starter

A responsive vanilla HTML/CSS/JavaScript messaging app scaffold. It includes Firebase email/password authentication, username lookup, Firestore real-time direct chats, file/image/video/audio uploads to Cloud Storage, voice recording, theme toggle, starter Firestore/Storage rules, indexes, and an optional notification Cloud Function.

## 1. Configure Firebase

1. Create a project at https://console.firebase.google.com/.
2. Add a **Web app** and copy its Firebase configuration.
3. In `app.js`, replace every `YOUR_...` value in `firebaseConfig`.
4. Firebase Console → Authentication → Sign-in method → enable **Email/Password**.
5. Authentication → Settings → Authorized domains: add your local/deployed domain.
6. Build → Firestore Database → create a database.
7. Build → Storage → get started and create a bucket.
8. Enable email verification from Authentication settings if desired.

> The Firebase web config is not a service-account secret. Never put service-account JSON or Admin SDK credentials in browser code.

## 2. Run locally

Because this uses ES modules, serve it over HTTP rather than opening `index.html` as a file. Install Node.js, then:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase emulators:start
```

For a quick local static preview, run a simple static server in this folder (for example `npx serve .`). Configure a Firebase project first; emulator use requires emulator configuration to be added if you want all services to run locally.

## 3. Deploy rules and hosting

Review rules before production, then:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase deploy --only hosting
```

`firebase.json` uses the project root as the Hosting public directory. For a production repo, it is better to move public assets into a `public/` folder and adjust the config.

## 4. Current functionality

- Email/password signup, login, logout, password reset, verification email.
- User profile record with a username; search users by username prefix.
- Create/reopen one-to-one conversations.
- Real-time message updates with server timestamps and basic sent state.
- Image, video, audio, and permitted document upload with progress; audio recording.
- Responsive dark UI and light-mode toggle.
- Security rules and index starter files.

## 5. Important limitations / next milestones

This is a working **starter**, not a production-certified Messenger replacement. It has not been run against your Firebase project because you will add your own configuration. Test with two separate accounts and deploy rules before sharing it.

- **Username uniqueness:** the client checks before creating a user, but concurrent signup attempts can race. For strict uniqueness, use a callable Cloud Function and a `usernames/{username}` reservation document/transaction.
- **Privacy:** the starter user rule allows signed-in users to read user documents for username search. Do not store private profile data in this public-searchable document. For stricter privacy, move search to a callable function and expose only public profile fields.
- **Delivery/read receipts, typing, reactions, editing/deleting, group creation, unread counts, presence/last-seen, push token registration, and message search** are not fully implemented in this starter.
- **Voice/video calling:** the UI button is a milestone placeholder. Real calls require WebRTC peer connections, Firestore/Realtime Database signaling, ICE candidate exchange, permissions, and STUN/TURN. A TURN provider is often necessary for reliable mobile/carrier networks and may have costs.
- **Push notifications:** optional `functions/index.js` is a starting point. Correctly register and refresh FCM tokens on supported platforms, configure web push certificates/service worker, and test delivery. Cloud Functions deployment may require the Blaze billing plan.
- **End-to-end encryption:** not implemented. Firebase uses transport encryption and access controls, but that is not the same as E2EE.
- **Security rules:** review and test in the Firebase Emulator Suite. The provided rules are a baseline; production needs abuse prevention, stronger schema validation, rate limits, token ownership validation, and a careful privacy review.
- **Media URLs:** Firebase download URLs can be shareable bearer URLs. For private media, consider authenticated downloads or a trusted short-lived URL design rather than posting long-lived download URLs broadly.
- **Large scale:** paginate older messages and avoid unbounded listeners; the starter listens to the latest 60 messages in the active chat.

## 6. Suggested test checklist

1. Create two accounts using different browsers/devices.
2. Search the second account's username from the first account.
3. Send text both ways and verify updates arrive in real time.
4. Send an image, video, audio file, and voice recording.
5. Sign out and back in; confirm the chat list reloads.
6. Try reading another conversation's Firestore path while signed in as an unrelated user; rules should deny it.
7. Use Firebase Rules Simulator / Emulator Suite before production deployment.

## Firestore data shape

```text
users/{uid}
  uid, email, username, displayName, photoURL, createdAt

conversations/{conversationId}
  members: [uidA, uidB], type: "direct", createdAt, updatedAt, lastMessage

conversations/{conversationId}/messages/{messageId}
  senderId, text?, mediaUrl?, mediaType?, fileName?, fileSize?, createdAt, status

userSettings/{uid}
deviceTokens/{tokenId}
callSessions/{callId}
```
