# FlashChat Android APK — आसान तरीका

इस ZIP में Firebase-configured web app और Android APK बनाने की cloud workflow है। यह ZIP खुद APK नहीं है।

## केवल Android फोन से
1. ZIP extract करें।
2. GitHub पर sign in करें और नया **public या private repository** बनाएं, नाम `flashchat-android` रखें।
3. Repository में **Add file → Upload files** से इस folder की सभी files upload करें। Hidden `.github` folder भी upload होना चाहिए।
4. Upload के बाद **Actions** tab खोलें। अगर पूछा जाए तो workflows enable करें।
5. **Build FlashChat Android APK** workflow चुनें → **Run workflow**। Build पूरा होने तक प्रतीक्षा करें।
6. Successful run खोलें; नीचे **Artifacts** में `FlashChat-debug-APK` डाउनलोड करें। ZIP को extract करके `app-debug.apk` फोन पर install करें। Android अगर अनुमति मांगे तो सिर्फ उसी APK के लिए अनुमति दें जिसे आपने अपनी repository के build से डाउनलोड किया है।

## Firebase जरूरी
- Firebase Console → Authentication → Sign-in method → Email/Password enable करें।
- Firestore Database create करें और इस project की `firestore.rules` publish करें।
- Storage enable करें और `storage.rules` publish करें।
- Firebase project settings में web app config को verify करें।

## सीमाएं
- यह **debug APK** है, Play Store release-signed APK नहीं।
- Cloud build के लिए GitHub account और internet चाहिए। मैं इस chat से आपके GitHub में upload या cloud workflow चलाने के लिए login नहीं कर सकता।
- App की real messaging तभी चलेगी जब Firebase services और security rules सही तरह से set हों। किसी भी real user के लिए release करने से पहले security rules test करें।
- इस starter में voice/video calls और कुछ advanced messaging features अभी पूरे नहीं हैं।
