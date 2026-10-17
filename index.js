const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
initializeApp();

// Optional notification trigger. Add FCM tokens through a trusted, authenticated client flow.
// Deploying this function may require the Blaze billing plan.
exports.notifyConversationMember = onDocumentCreated(
  "conversations/{conversationId}/messages/{messageId}",
  async (event) => {
    const message = event.data?.data();
    if (!message || !message.senderId) return;
    const db = getFirestore();
    const convSnap = await db.doc(`conversations/${event.params.conversationId}`).get();
    if (!convSnap.exists) return;
    const members = convSnap.data().members || [];
    const recipients = members.filter(uid => uid !== message.senderId);
    if (!recipients.length) return;
    const tokenDocs = await db.collection("deviceTokens").where("uid", "in", recipients.slice(0, 10)).get();
    const tokens = tokenDocs.docs.map(d => d.data().token).filter(Boolean);
    if (!tokens.length) return;
    const title = "New FlashChat message";
    const body = (message.text || (message.mediaType || "").startsWith("image/") ? "New message" : "Attachment").slice(0, 120);
    await getMessaging().sendEachForMulticast({
      tokens, notification: { title, body },
      data: { conversationId: event.params.conversationId },
      android: { priority: "high" }
    });
  }
);
