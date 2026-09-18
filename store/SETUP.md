# Store setup, step by step

The order matters: the D-U-N-S number comes first, because both stores ask for it when you register as a company. Screens and wording on these sites change from time to time; if a label differs slightly, look for the closest match.

## Before you start (have these ready)

- The LLC's **exact legal name** as registered with the state: Safety & Health Equity Partners LLC.
- The LLC's **registered address** and a **business phone number** you can answer (Apple and D&B may call to verify).
- A **public website** for the LLC on its own domain, and an **email address on that domain** (for example dru@4everyone.health). Apple checks that the website exists and belongs to the organization.
- Confirmation that you have **legal authority to sign agreements** for the LLC (as owner, you do).
- A **government photo ID** for identity checks.
- A credit card for the fees (Google $25 once, Apple $99 per year).

## Step 1: D-U-N-S number (free, allow 1 to 2 weeks)

A D-U-N-S number is a free business identifier from Dun & Bradstreet (D&B). The LLC may already have one.

1. Go to https://developer.apple.com/enroll/duns-lookup/ and sign in with your Apple Account (create one if needed; use the business email).
2. Enter the LLC's legal name, address and your contact details exactly as registered.
3. If a match appears, note the **9-digit D-U-N-S number** and check that the name and address are correct. If they are wrong, ask D&B to correct them before enrolling.
4. If no match appears, submit the request form on that page. D&B processes it (often up to 5 business days) and may call or email you. Answer promptly.
5. After you receive the number, Apple can take up to about 2 business days to see it. Wait a couple of days before step 3.

Keep the number handy: Google asks for it too.

## Step 2: Google Play developer account (organization, $25 once)

1. Use a Google account for the business. If dru@4everyone.health is not a Google account, create one at https://accounts.google.com/signup ("Use my current email address instead").
2. Go to https://play.google.com/console/signup.
3. Choose **An organization or business** (not "Yourself"). Organization accounts are not subject to the rule that new personal accounts must run a 14-day closed test with at least 12 testers before publishing.
4. Create or select a **payments profile** of type **Organization** with the LLC's legal name and address, and enter the **D-U-N-S number**.
5. Enter the **developer name** readers will see on Google Play (suggestion: Safety & Health Equity Partners, or 4Everyone).
6. Add the contact email, phone and website, and complete the phone and email verification codes.
7. Pay the $25 fee and complete **identity verification** (photo ID). Google may take several days to verify the organization.

## Step 3: Apple Developer Program (organization, $99 per year)

1. Make sure your Apple Account has **two-factor authentication** on (iPhone: Settings > your name > Sign-In & Security).
2. Enroll at https://developer.apple.com/programs/enroll/ (or in the **Apple Developer** app on an iPhone, which can be quicker).
3. Choose **Company / Organization** and enter the LLC's legal name, D-U-N-S number, website, work email and phone.
4. Apple verifies the organization and may phone you. Once approved, pay the $99 fee.
5. When enrollment completes, sign in to https://appstoreconnect.apple.com. The free-apps agreement is accepted as part of enrollment; tax and banking forms are only needed for paid apps.

## Step 4: Hand-off to finish the builds

### Google Play signing (after step 2 is approved)

You create an "upload key" that proves future updates come from you. **You choose its password; don't share it in chat.**

1. On your Windows PC, open **PowerShell** and install Java (needed only for the key tool):
   `winget install Microsoft.OpenJDK.21`
   Close and reopen PowerShell afterwards.
2. Create the key (it asks you to choose a password and to type your name and organization):
   `keytool -genkeypair -v -keystore 4everyone-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`
3. Keep `4everyone-upload.jks` and its password somewhere safe (a password manager and a backup drive). If it is lost, Google can reset the upload key, but it takes time.
4. Turn the file into text for GitHub:
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes("4everyone-upload.jks")) | Set-Clipboard`
5. In GitHub, open the repository > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**, and add:
   - `ANDROID_KEYSTORE_BASE64`: paste the clipboard
   - `ANDROID_KEYSTORE_PASSWORD`: the password you chose
   - `ANDROID_KEY_ALIAS`: `upload`
   - `ANDROID_KEY_PASSWORD`: the same password (unless you set a separate key password)
6. Tell Claude. The next build produces the signed `4everyone-release-aab`, which you upload in the Play Console (**Create app**, then **Testing > Internal testing** first, then **Production**). Paste the listing from `store/LISTING.md` and the screenshots from `store/screenshots/`.

### Apple signing and TestFlight (after step 3 is approved)

1. In App Store Connect go to **Users and Access** > **Integrations** > **App Store Connect API** > **Team Keys** and generate a key with the **App Manager** role.
2. Download the `.p8` file (it can only be downloaded once) and note the **Key ID** and the **Issuer ID** shown on that page.
3. Find your **Team ID** at https://developer.apple.com/account under **Membership details**.
4. Add these GitHub secrets the same way as above:
   - `APPSTORE_KEY_ID`: the Key ID
   - `APPSTORE_ISSUER_ID`: the Issuer ID
   - `APPSTORE_API_KEY`: open the `.p8` file in Notepad and paste its whole contents
   - `APPLE_TEAM_ID`: the Team ID
5. Tell Claude. Claude adds the signing and upload step so each build goes to **TestFlight**. You install the TestFlight app on your iPhone to test the real app, then submit for review with the listing from `store/LISTING.md`.

## Decisions to make before the first upload

- ~~Confirm the app ID~~ Done: `health.foreveryone.app` on both stores.
- Have the Spanish store listing in `store/LISTING.md` reviewed by your copyeditor.
- Resolve the open content questions (Russian proverb audio, ADA employment figures).
