---
layout: default
title: "Home"
---

# Welcome to AI Knows Your Rights.

This tool uses AI Natural Language Processing techniques to detect and analyze terms and conditions for user rights. 

The project is hosted on GitHub: [https://github.com/AI-knows-your-rights/CS224-TC](https://github.com/AI-knows-your-rights/CS224-TC)


**Background**. Legal language is one of the most complex and sophisticated forms of natural
language. A tragic 2024 case brought this issue to public attention: a woman passed away at Disney
Park, and the company argued that her family had waived their right to sue because she had accepted
the terms and conditions (T&C) when she signed up for a trial of Disney+ stream back in 2019. The
legal clause, buried in fine print, favored the company, highlighting how consumers often unknowingly
forfeit their rights. Our project focuses on the analysis of T&C documents, and thus aligns with
ongoing research in legal text processing, document summarization, and explainable AI. Our work
aims to contribute to social good by exploring AI explainability (XAI) and transparency in corporate
policies. AI is often seen as a “black box” in legal applications, and our work could help increase
transparency in automated decision-making. Many T&C documents are deliberately obfuscated,
so our model could provide consumer-friendly, interpretable AI outputs. If successful, our project
could pressure companies to write more consumer-friendly T&C by exposing unfair practices, and
incentivize companies to adopt better legal practices.

**Goal**. Our project aims to develop an NLP model that can summarize and rate T&C, making them
easier for consumers to understand. Our project will investigate the effectiveness of transformer-based
models in summarizing and rating legal T&C for consumer comprehension. Specifically, we aim to answer:
1. Can pre-trained language models effectively summarize legal T&C while preserving critical legal
meanings?
2. How well do our models detect fairness and bias in T&C documents that match the annotations by
attorneys?
3. Can context-aware NLP techniques, inspired by culturally aware language models, improve legal
text interpretation and fairness assessment?

We will fine-tune transformer-based models to generate structured, explainable, and user-friendly
summaries. Additionally, we will evaluate whether contextual embeddings or retrieval-augmented
generation (RAG) improves interpretability and bias detection. This aligns with the objectives and
results from [1] where the authors fine-tuned a pretrained BERT model to classify individual legal
clauses as legally void or valid. In addition, the insights from this paper, specifically about the need
for expanding the grid for the hyperparameter search will be particularly useful for our task.

**Task**. Our task is to automate the summarization and fairness evaluation of T&C documents using
natural language processing (NLP) techniques. Specifically, we aim to:
1. Summarize lengthy and complex T&C documents into concise, user-friendly explanations while
preserving key legal implications.
2. Assign a fairness rating to T&C based on consumer rights protections, transparency, and legal risk,
using a dataset of attorney-annotated contracts.
An illustration can be found in figure 1.

**Data**. We will use a community-annotated dataset of T&C of 500 companies, which qualified
attorney vonlunteers have analyzed and labeled. This dataset was previously used to develop a
browser extension that show T&C fairness rating. It also includes clause-level annotations. Google
T&C is ranked as grade E as it includes many clauses that don’t respect users’ privacy. On the
contrary, DuckDuckGo has an excellent rating.
To prepare the dataset for fine-tuning transformer models, we will:
1. Tokenization & Cleaning: Standardize legal text we acquired from the company. Remove the
date/version mismatches.
2. Sentence Segmentation: Break long legal clauses into manageable units for NLP models.
3. Label Normalization: Align fairness ratings with a numerical scale for supervised learning.
4. Augmentation (if needed): Expand the dataset using semi-supervised techniques like zero-shot prompting from GPT models to generate additional annotations.

**Methods** Our approach involves fine-tuning transformer-based models for legal text summarization
and fairness evaluation. We will explore and fine-tune pre-trained sequence-to-sequence models to
evaluate the best outcome. We will use Hugging Face transformers to download models. For our
specific task, we will train on our annotated dataset, optimizing for text summarization quality and
fairness classification accuracy. In addition, we will implement our legal text pre-processing pipeline,
including clause segmentation, tokenization, and explainability analysis. Finally, we will compare
our model against existing summarization models (e.g., GPT-4, Claude) to assess performance gains.

**Baselines**. We will compare our T&C summarization model with Pre-trained Transformer Models
such as OpenAI ChatGPT 4o, Claude, etc. We will also compare our classifier with the pre-trained
classifiers such as LEGAL-BERT and the human expert annotations.

**Evaluation**. For our summarization task, we will explore and use various evaluation methods,
including n-gram-based semantic similarity (e.g. BLEU). For our multiclass classification task
(grading the T&C from A to E), we plan to use ROC-AUC approaches.

**Limitations and discussion**. The project is based on a community-annotated dataset of T&C
analysis of 500 companies’ websites. The company’s T&C may have updated, but the community
annotation probably cannot catch up with it, resulting the wrong annotation. Also, the annotations
are all in English, potentially hurt the accuracy of other languages. Despite the limitations, we are
still confident the project is meaningful and will contribute to user-right awareness and push the
companies to take more social responsibilities.

**Ethical Challenges** Our project presents ethical challenges related to algorithmic bias in legal
fairness assessments and misinterpreting AI-generated summaries. We will perform bias audits by
cross-checking AI ratings with the community and asking for feedback. We will also put a legal
disclaimer that AI summaries are informational, not legal advice, and recommend consulting a lawyer
for critical decisions.

**References**
[1] Anjalie Field, Shrimai Prabhumoye, Maarten Sap, Zhijing Jin, Jieyu Zhao, and Chris Brockett.
NLP for consumer protection: Battling illegal clauses in German terms and conditions in online
shopping. In Association for Computational Linguistics (ACL), 2021.

[2] Shubham Vatsal, Adam Meyers, and John E. Ortega. Classification of US Supreme Court cases
using BERT-based techniques. In Ruslan Mitkov and Galia Angelova, editors, Proceedings of
the 14th International Conference on Recent Advances in Natural Language Processing, Varna,
Bulgaria, September 2023. INCOMA Ltd., Shoumen, Bulgaria.

[3] Ilias Chalkidis, Manos Fergadiotis, Prodromos Malakasiotis, Nikolaos Aletras, and Ion Androut-
sopoulos. LEGAL-BERT: The muppets straight out of law school. In Trevor Cohn, Yulan He,
and Yang Liu, editors, Findings of the Association for Computational Linguistics: EMNLP 2020,
Online, November 2020. Association for Computational Linguistics.
