from transformers import AutoTokenizer, AutoModelForCausalLM

# Choose the model
model_name = "meta-llama/Llama-2-7b-chat-hf"  # or use "meta-llama/Llama-2-70b-chat-hf"

# Load tokenizer and model
print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_name, token=True)  # Updated token argument
print("Loading model (this may take a while)...")
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",  # Uses GPU if available
    torch_dtype="auto"  # Optimizes model precision automatically
)

# Sample clause
clause = "We collect all user data and share it with third parties without consent."

# ✅ Improved prompt to get a concise, single-word rating
prompt = f'Rate the privacy invasiveness of the following clause with one word (very bad, bad, neutral, or good): "{clause}"\nRating:'

# Tokenize and generate the response
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=5)  # Limit generation to avoid extra text
response = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

# 🔑 Extract only the rating (removes the prompt from the response)
rating = response.replace(prompt, "").strip()

print("\nRating:", rating)