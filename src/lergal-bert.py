# pip install torch transformers datasets

# import torch
# from torch.utils.data import DataLoader
# from datasets import load_dataset
# from transformers import BertTokenizer, BertForSequenceClassification

from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "nlpaueb/legal-bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

text = "The court finds the defendant guilty of all charges."

inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
outputs = model(**inputs)

# test if legal bert is working
print(outputs.logits)


from datasets import load_dataset

# EURLEX57K is a classification dataset

dataset = load_dataset("eurlex57k")
print(dataset["train"][0])


def preprocess(examples):
    return tokenizer(examples['text'], truncation=True, padding='max_length', max_length=512)

encoded_dataset = dataset.map(preprocess, batched=True)


# finetuning

from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=encoded_dataset["train"],
    eval_dataset=encoded_dataset["validation"],
)

trainer.train()


trainer.evaluate(encoded_dataset["test"])

