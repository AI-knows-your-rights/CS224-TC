from transformers import AutoTokenizer, AutoModelForCausalLM
from sklearn.metrics import accuracy_score, confusion_matrix
import re

# ✅ Clauses and their correct labels
clauses = ["Facebook uses cookies and receives information when you visit those sites and apps, including device information and information about your activity, without any further action from you. This occurs whether or not you have a Facebook account or are logged in.",
"Our systems automatically process content and communications you and others provide to analyze context and what's in them for the purposes described below.",
"You can review your Off-Facebook activity, which is a summary of activity that businesses and organizations share with us about your interactions with them, such as visiting their apps or websites. They use our Business Tools, like Facebook Pixel, to share this information with us. This helps us do things like give you a more personalized experience on Facebook.",
"In addition, content you delete may continue to appear if you have shared it with others and they have not deleted it",
# BAD
"For example, when you search for something on Facebook, you can access and delete that query from within your search history at any time, but the log of that search is deleted after 6 months. If you submit a copy of your government-issued ID for account verification purposes, we delete that copy 30 days after review, unless otherwise stated. Learn more about deletion of content you have shared and cookie data obtained through social plugins.",
"information you allow us to receive through device settings you turn on, such as access to your GPS location, camera or photos.",
"This can include information in or about the content you provide (like metadata), such as the location of a photo or the date a file was created.",
"We store data until it is no longer necessary to provide our services and Facebook Products, or until your account is deleted - whichever comes first. This is a case-by-case determination that depends on things like the nature of the data, why it is collected and processed, and relevant legal or operational retention needs.",
"We collect information about the people, Pages, accounts, hashtags and groups you are connected to and how you interact with them across our Products, such as people you communicate with the most or groups you are part of. We also collect contact information if you choose to upload, sync or import it from a device (such as an address book or call log or SMS log history), which we use for things like helping you and others find people you may know and for the other purposes listed below. Your usage. We collect information about how you use our Products, such as the types of content you view or engage with. the features you use. the actions you take. the people or accounts you interact with. and the time, frequency and duration of your activities.",
"Our business partners may also choose to share information with Facebook from cookies set in their own websites' domains, whether or not you have a Facebook account or are logged in. Specifically, cookies named _fbc or _fbp may be set on the domain of the Facebook business partner whose site you're visiting. Unlike cookies that are set on Facebook's own domains, these cookies aren’t accessible by Facebook when you're on a site other than the one on which they were set, including when you are on one of our domains. They serve the same purposes as cookies set in Facebook's own domain, which are to personalise content (including ads), measure ads, produce analytics and provide a safer experience, as set out in this Cookies Policy.",
"For example, when you go to a website with a Like button, we need to know who you are in order to show you what your Facebook friends have liked on that site. The data we receive includes your user ID, the website you're visiting, the date and time and other browser-related info.If you’re logged out or don’t have a Facebook account and visit a website with the Like button or another social plugin, your browser sends us a more limited set of info. For example, because you’re not logged into Facebook, you’ll have fewer cookies than someone who's logged in. Like other sites on the Internet, we receive info about the web page you're visiting, the date and time and other browser-related info. We record this info to help us improve our products. As our Data Policy indicates, we use cookies to show you ads on and off Facebook. We may also use the info we receive when you visit a site with social plugins to help us show you more interesting and useful ads.",
"We use the information we have about you-including information about your interests, actions and connections-to select and personalize ads, offers and other sponsored content that we show you.",
"Information from partners. Advertisers, app developers, and publishers can send us information through Facebook Business Tools they use, including our social plug-ins (such as the Like button), Facebook Login, our APIs and SDKs, or the Facebook pixel. These partners provide information about your activities off Facebook—including information about your device, websites you visit, purchases you make, the ads you see, and how you use their services—whether or not you have a Facebook account or are logged into Facebook.",
"We also receive information about your online and offline actions and purchases from third-party data providers who have the rights to provide us with your information.",
"If the ownership or control of all or part of our Products or their assets changes, we may transfer your information to the new owner.",
"We also process information about you across the Facebook Companies for these purposes, as permitted by applicable law and in accordance with their terms and policies. For example, we process information from WhatsApp about accounts sending spam on its service so we can take appropriate action against those accounts on Facebook, Instagram or Messenger.",
"Location-related information can be based on things like precise device location (if you've allowed us to collect it), IP addresses, and information from your and others' use of Facebook Products",
"Product research and development: We use the information we have to develop, test and improve our Products, including by conducting surveys and research, and testing and troubleshooting new products and features.",
"We allow advertisers to tell us things like their business goal, and the kind of audience they want to see their ads (for example, people between the age of 18-35 who like cycling). We then show their ad to people who might be interested",
"Attributes such as the operating system, hardware version, device settings, file and software names and types, battery and signal strength, and device identifiers. Device locations, including specific geographic locations, such as through GPS, Bluetooth, or WiFi signals. Connection information such as the name of your mobile operator or ISP, browser type, language and time zone, mobile phone number and IP address.",
"Face recognition: If you have it turned on, we use face recognition technology to recognize you in photos, videos and camera experiences. The face-recognition templates we create are data with special protections under EU law. Learn more about how we use face recognition technology, or control our use of this technology in Facebook Settings. If we introduce face-recognition technology to your Instagram experience, we will let you know first, and you will have control over whether we use this technology for you.",
"We use your personal data, such as information about your activity and interests, to show you ads that are more relevant to you.",
"We want people to use Facebook to express themselves and to share content that is important to them, but not at the expense of the safety and well-being of others or the integrity of our community.",
"You should know that we may need to change the username for your account in certain circumstances (for example, if someone else claims the username and it appears unrelated to the name you use in everyday life).",
"For this reason, you must: Use the same name that you use in everyday life. Provide accurate information about yourself.",
"We use cookies to better understand how people use the Facebook Products so that we can improve them. For example:  Cookies can help us understand how people use the Facebook service, analyse which parts of the Facebook Products people find most useful and engaging, and identify features that could be improved. Google Analytics We also set cookies from the Facebook.com domain that work with the Google Analytics service to help us understand how businesses use Facebook's developer sites.",
# Good
"We require each of these partners to have lawful rights to collect, use and share your data before providing any data to us.",
"To learn more, visit the Facebook Security Help Center and Instagram Security Tips.",
"Facebook is also reachable at https://www.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/",
"How do we use this information? We use the information we have (subject to choices you make) as described below and to provide and support the Facebook Products and related services described in the Facebook Terms and Instagram Terms.",
"We don't sell your personal data.",
"You can opt out of seeing online interest-based ads from Facebook and other participating companies through the Digital Advertising Alliance in the US, the Digital Advertising Alliance of Canada in Canada or the European Interactive Digital Advertising Alliance in Europe or through your mobile device settings, where available, using Android, iOS 13 or an earlier version of iOS.",
"To delete your account at any time, please visit the Facebook Settings and Instagram Settings.",
"When you share and communicate using our Products, you choose the audience for what you share. For example, when you post on Facebook, you select the audience for the post, such as a group, all of your friends, the public, or a customized list of people. Similarly, when you use Messenger or Instagram to communicate with people or businesses, those people and businesses can see the content you send.",
# Neutral
"Certain parts of the Facebook Products may not work properly if you have disabled browser cookie use. Please be aware these controls are distinct from the controls that Facebook offers you.",
"If you delete or we disable your account, these Terms shall terminate as an agreement between you and us, but the following provisions will remain in place",
"Create only one account (your own) and use your timeline for personal purposes.",
"You may not access or collect data from our Products using automated means (without our prior permission)",
"You are under 13 years old.",
"If we fail to enforce any of these Terms, it will not be considered a waiver.",
"If any portion of these Terms is found to be unenforceable, the remaining portion will remain in full force and effect.",
"Information collected by these third-party services is subject to their own terms and policies, not this one.",
"You will not transfer any of your rights or obligations under these Terms to anyone else without our consent.",
"If we fail to enforce any of these Terms, it will not be considered a waiver.",
"When people stand behind their opinions and actions, our community is safer and more accountable. For this reason, you must: Use the same name that you use in everyday life. Provide accurate information about yourself. Create only one account (your own) and use your timeline for personal purposes.",
"We use cookies if you have a Facebook account, use the Facebook Products, including our website and apps, or visit other websites and apps that use the Facebook Products (including the Like button or other Facebook Technologies)."
]

correct_labels = ["very bad","very bad","very bad", "very bad",
"bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad","bad",
"good", "good","good","good","good","good","good","good",
"neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral","neutral"
]

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

def predict_label(clause: str) -> str:
    prompt = f'Rate the privacy invasiveness of the following clause with one word (very bad, bad, neutral, or good): "{clause}"\nRating:'
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=5)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
    rating = response.replace(prompt, "").strip().lower()

    # ✅ Extract only valid rating words
    match = re.search(r"\b(very bad|bad|neutral|good)\b", rating)
    return match.group(1) if match else "unknown"

# ✅ Run predictions and calculate accuracy
predictions = [predict_label(clause) for clause in clauses]
accuracy = accuracy_score(correct_labels, predictions)

# ✅ Results
for clause, pred, correct in zip(clauses, predictions, correct_labels):
    print(f"\nClause: {clause}\nPredicted: {pred}\nCorrect: {correct}")

print(f"\n✅ Accuracy: {accuracy * 100:.2f}%")
