from transformers import AutoTokenizer, AutoModelForCausalLM
from sklearn.metrics import accuracy_score, confusion_matrix

# ✅ Clauses and their correct labels
clauses = ["We sell your data to third parties without your consent",
"We may track your usage of other websites even after you have deleted your account",
"We do not keep track of your browsing history",
"We explicity ask for your consent before we use cookies",
"The place of jurisdiction is Hanover, Germany"
]

correct_labels = ["very bad","very bad","good","good","neutral"]

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

import re

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