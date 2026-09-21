# Patio Garden: setup

A pastel watering-schedule app for the patio. Tap a droplet when you water, and both phones see it. 

**Files (all go in the same folder / repo):**
`index.html`, `firebase-config.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`

## 0. Try it first (no setup)

Open `index.html` in a browser. It runs in **preview mode**: everything saves on that device only. Use this to check the plants and watering intervals before setting up sharing.

## 1. Firebase (the shared database)

Use a **new** Firebase project so the rules don't touch your MapTap Ledger project.

1. Go to console.firebase.google.com and click **Create a project**. Name it `patio-garden`. Turn Google Analytics off.
2. On the project home, click the **web icon `</>`** to add a web app. Nickname it `patio-garden`. Skip "Firebase Hosting". Click **Register app**.
3. Copy the `firebaseConfig` values it shows. Open `firebase-config.js` and replace each `PASTE_...` value with yours. Keep the quotes and commas. (Your settings live in this file so updating `index.html` later never wipes them.)
4. In the left menu open **Build > Firestore Database > Create database**. Pick a nearby location (for Texas, `nam5 (us-central)` is fine). Choose **Start in production mode**, then **Enable**.
5. Open the **Rules** tab, replace everything with the rules below, and click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gardens/{gardenId} {
      allow get, write: if true;
    }
    match /gardens/{gardenId}/{document=**} {
      allow read, write: if true;
    }
  }
}
```

These rules let anyone who knows a garden's code use it, but nobody can list gardens. The code lives on your phones, not in the GitHub repo, so keep it private.

The Firebase config values are safe to put in a public repo. They identify the project. The rules above control access.

## 2. GitHub Pages (the website)

1. On github.com click **New repository**. Name it `patio-garden`, set it to **Public** (free Pages needs this), and create it.
2. Click **uploading an existing file**, drag in all 8 files, and click **Commit changes**.
3. Go to **Settings > Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch `main`, folder `/ (root)`, and **Save**.
4. Wait a minute or two. Your site appears at `https://YOUR-USERNAME.github.io/patio-garden/`.

To update later, upload the changed file to the repo again (**Add file > Upload files**) and commit. Close and reopen the app to see the update.

## 3. First open, and adding your wife

1. Open the site on your phone. A window asks for your name and a garden code.
2. Tap **Make a code**, then **Save**. The starter plants from your tracker load in automatically.
3. Tap your name at the top, then **Copy invite link**, and text it to your wife. Opening that link on her phone sets up the same garden and asks for her name.
4. On each phone, add it to the home screen:
   - **iPhone:** Safari, Share button, **Add to Home Screen**.
   - **Android:** Chrome menu, **Install app** or **Add to Home screen**.

## How it works

- **Droplet button:** marks a plant watered today. **Undo** shows for a few seconds.
- **Water all thirsty / It rained:** waters everything due, or counts rain for all plants. Both can be undone.
- **Tap a plant** for its notes, frost tip, and an **Edit plant** button. Intervals are editable per plant.
- **Log tab:** who watered what, and when.
- Light blue snowflake means the plant needs frost protection. Circle color shows life cycle (legend at the bottom of the list).
- A plant is "settling in" for a set number of days after planting and gets the shorter watering interval, then switches to the settled-in interval automatically.
- It needs an internet connection to load your plants.

## If something goes wrong

- **A pink banner at the top:** it says what went wrong and ends with a "Details" line. Send that line to Claude if the fix isn't obvious.
- **"The garden database said no":** the Firestore rules weren't published. Redo step 1.5, and make sure you clicked **Publish**.
- **"No Firestore database was found":** you may have created a Realtime Database. Use **Firestore Database** (step 1.4).
- **"Could not load Firebase":** a `PASTE_...` value is still in `firebase-config.js`, or the phone is offline.
- **Yellow "Preview mode" banner:** `firebase-config.js` is missing from the repo or still has `PASTE_...` values.
- **"No plants yet":** the database connected but is empty. In the Firebase console, open **Firestore Database > Data** and look for `gardens`. If it's missing, the starter plants never saved, so recheck the rules.
- **The two phones show different plants:** the garden codes differ. Tap your name at the top and compare them.
- **Old version still showing:** close the app fully and reopen it.
