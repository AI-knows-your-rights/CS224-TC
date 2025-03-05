from transformers import AutoTokenizer, AutoModelForCausalLM
from sklearn.metrics import accuracy_score, confusion_matrix

# ✅ Clauses and their correct labels
clauses = [
    # TULA
    "We do not use cookies.",
    "The laws of the Federal Republic of Germany shall apply.",
    "To guarantee the users' privacy, we have implemented the feature as follows: the IP address is stored encrypted, and only the user can decrypt this information. No one else - not even we at Tutanota - can access this information.",
    "The previous version of these Terms and Conditions can be found here.",
    "We will not disclose this personal data to third parties.",
    "Is Tutanota open source? Yes.",
    "There will be no sale of data.",
    "Your password is salted and hashed with Bcrypt on your device before being transmitted to Tutanota. Bcrypt is the most reliable method because brute-force attacks need much more time in comparison to conventional methods such as MD5 or SHA.﻿ With this method we guarantee an integrated confidentiality and we allow you to access and decrypt your emails from desktops and mobile devices instantly.",
    # Free Music Archive
    "By accessing or using any of the pages or content located on www.freemusicarchive.org (the “Site”), you (“you” or “User”) indicate that you understand and agree to the Terms of Use.",
    "If you do not want to receive these emails, you may unsubscribe from the email list, and the list will be updated immediately to reflect your change.",
    # Mozilla
    "Your continued use of the product or service after the effective date of such changes constitutes your acceptance of such changes.",
    "HTTP Referral Data, which may be included with Firefox’s installer, to understand the website domain or advertising campaign that referred you to our download page. This information helps us understand the effectiveness of our advertising campaigns and improve them.",
    "If our organizational structure or status changes (if we undergo a restructuring, are acquired, or go bankrupt) we may pass your information to a successor or affiliate.",
    "give us a name, street address, telephone number, email address, and resume, and sometimes additional information as well.",
    "You can control individual cookie preferences, indicate your cookie preferences to others, and opt-out of web analytics and optimization tools.",
    "We also don't want your personal information for any longer than we need it, so we only keep it long enough to do what we collected it for. Once we don't need it, we take steps to destroy it unless we are required by law to keep it longer.",
    "When the law requires it. We follow the law whenever we receive requests about you from a government or related to a lawsuit. We'll notify you when we're asked to hand over your personal information in this way unless we're legally prohibited from doing so.",
    "Despite our efforts, if we learn of a security breach, we'll notify you so that you can take appropriate protective steps.",
    "When you give us information, we will use it in the ways for which you've given us permission. Generally, we use your information to help us provide and improve our products and services for you.",
    # Discord
    "Subject to applicable law, we reserve the right to suspend or terminate your account and/or your access to some or all of our services with or without notice, at our discretion for the following reasons: You breach these terms, our policies, or additional terms that apply to specific products. We’re required to do so to comply with a legal requirement or court order. We reasonably believe termination is necessary to prevent harm to you, us, other users, or third parties. Your account has been inactive for more than two years. Continuing to allow your account to be active, giving you access to some or all services, or hosting your content creates risk for Discord, other users, or third parties.",
    "This includes information you provide to us, information we collect automatically, and information we receive from other sources.",
    "“If you continue to use our services after the changes have taken effect, it means that you agree to the changes.",
    "and we may collect your information through other means like surveys, emails, and social media",
    "You may not download or use our services if you are located in a country or region subject to U.S. or E.U. government embargo (including Cuba, Iran, North Korea, Syria, and the Crimea region) unless that use is authorized by the United States and other relevant authorities",
    "You may edit or delete specific pieces of information within the services: You can edit or delete any message you have sent or content you have posted if you still have access to the space where you posted it.You can edit or delete a Discord server if you have the permissions needed to do so. You can edit or delete a channel from a Discord server if you have the permissions needed to do so.",
    # Steam
    "This data includes: Information that you post, comment or follow in any of our Content and Services; Information sent through chat;",
    "In accordance with internet standards, we may also share certain information (including your IP address and the identification of Steam content you wish to access) with our third party network providers that provide content delivery network services and game server services in connection with Steam.",
    "or — where the applicable law provides for longer storage and retention period — for the storage and retention period required by law. After that your Personal Data will be deleted, blocked or anonymized, as provided by applicable law. In particular: If you terminate your Steam User Account, your Personal Data will be marked for deletion except to the degree legal requirements or other prevailing legitimate purposes dictate a longer storage.",
    "We collect certain data that is required for our detection, investigation and prevention of fraud, cheating and other violations of the SSA and applicable laws ('Violations'). This data is used only for the purposes of detection, investigation, prevention and, where applicable, acting on of such Violations and stored only for the minimum amount of time needed for this purpose. If the data indicates that a Violation has occurred, we will further store the data for the establishment, exercise or defense of legal claims during the applicable statute of limitations or until a legal case related to it has been resolved. Please note that the specific data stored for this purpose may not be disclosed to you if the disclosure will compromise the mechanism through which we detect, investigate and prevent such Violations.",
    "In the event of a reorganization, sale or merger we may transfer Personal Data to the relevant third party subject to applicable laws.",
    "Subject to your separate consent or where explicitly permitted under applicable laws on email marketing, Valve may send you marketing messages about products and services offered by Valve to your email address.",
    "We may also share your Personal Data with our third party service providers that provide customer support services in connection with goods, Content and Services distributed via Steam",
    "We may process information collected under this section 3 so that content, products and services shown on the pages of the Steam store and in update messages displayed when launching the Steam Client can be tailored to meet your needs and populated with relevant recommendations and offers.",
    "In such a case we may also use your collected information to customize such marketing messages as well as collect information on whether you opened such messages and which links in their text you followed.",
    "To allow you to exercise your data protection rights in a simple way we are providing a dedicated section on the Steam support page (the 'Privacy Dashboard'). This gives you access to your Personal Data, allows you to rectify and delete it where necessary and to object to its use where you feel necessary.",
    "The Steam community includes message boards, forums and/or chat areas, where users can exchange ideas and communicate with each other. When posting a message to a board, forum or chat area, please be aware that the information is being made publicly available online. therefore, you are doing so at your own risk.",
    "When you upload your content to Steam to make it available to other users and/or to Valve, you grant Valve and its affiliates the worldwide, non-exclusive",
]

correct_labels = ["good","good","good","good","good","good","good","good",
"bad","good",
"bad","bad","bad","bad","bad","good","good","good","good",
"bad","bad","bad","bad","bad","good",
"very bad","bad","bad","bad","bad","bad","bad","bad","bad","good","good","good"]

# ✅ Load model and tokenizer
model_name = "meta-llama/Llama-2-7b-chat-hf" # can be 7 or 70b
print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_name, token=True)
print("Loading model (this may take a while)...")
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype="auto"
)

# ✅ Function to get prediction
def predict_label(clause: str) -> str:
    prompt = f'Rate the privacy invasiveness of the following clause with one word (very bad, bad, or good): "{clause}"\nRating:'
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=5)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
    rating = response.replace(prompt, "").strip().lower()
    return rating

# ✅ Run predictions and calculate accuracy
predictions = [predict_label(clause) for clause in clauses]
accuracy = accuracy_score(correct_labels, predictions)

# ✅ Results
for clause, pred, correct in zip(clauses, predictions, correct_labels):
    print(f"\nClause: {clause}\nPredicted: {pred}\nCorrect: {correct}")

print(f"\n✅ Accuracy: {accuracy * 100:.2f}%")
