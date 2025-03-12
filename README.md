# T&C Ranker

This repository contains the code for the **T&C Ranker** project, developed as part of the **Stanford CS 224N Final Project**.

**Authors:** Ray Hu, Benjamin Ward, and Basant Khalil  
**Mentor:** Jing Huang

---

## 📂 Folder Structure

```
├── data_downloader/
│   ├── download-data.js
│
├── src/
│   ├── legal-bert.py
│
├── data/
```

---

## 📊 Data

The raw data is stored in the `data/` folder. Cleaned data is saved in `data_all_<timestamp>`, with the latest folder containing the most up-to-date processed data.

Each company has a dedicated subfolder containing relevant data.

### 🔹 Website Scoring

Each company's folder contains a `details.json` file, which includes:
- Website scoring
- Domain and URL information
- Other metadata

We need to do a DE-DUP that with n-gram duplication detection. So the test dataset doesn't have 10-gram dup with the training dataset.

#### Grading System

Each identified point is classified as:
- **Good** ✅
- **Neutral** ⚖️
- **Bad** ❌
- **Blocker** 🚫

A point must be **approved** to be included in the grade calculation.

##### 📌 Grade Calculation Formula

```python
balance = number_of_good_points - number_of_bad_points - (number_of_blocker_points * 3)
```

##### 🏆 Grade Assignment Rules

| Grade | Condition |
|--------|------------------------------------------------|
| **N/A** | No points recorded (good + bad + blocker = 0) |
| **E** | `balance ≤ -10` OR `blockers > good points` |
| **D** | `blockers ≥ 3` OR `bad points > good points` |
| **C** | `balance < 5` |
| **B** | Any bad points exist |
| **A** | Only good points exist |

This same methodology is applied for **document scoring** based on predicted clause ratings.

### 🔹 Clause-by-Clause Rating

- Each folder contains a `service.html` file with clause-level ratings.
- This file is converted to `service.txt` for easier reading.
- Additionally, we extract data from `service.html`, its `points` and `cases`, save them in the clauses.json for efficient processing.

### 🔹 T&C Documents

Each website folder contains a `documents/` subfolder with Terms & Conditions (T&C) documents:
- Original documents are in **HTML format**.
- A **text version** is created for readability.
- The text version is classified using **Facebook/BART**:
  - **T&C documents:** `TC_xx`
  - **Non-T&C documents:** `Review_xx`

---

## 🚀 Usage

### 🔹 Clone the Repository

```bash
brew install git-lfs # if you haven't installed git-lfs
# or sudo apt-get install git-lfs
git lfs install
git lfs pull
git clone --depth 1 https://github.com/rayhu-stanford/tc_ranker.git
```

### 🔹 Download Data

1. Navigate to the `data_downloader/` folder.
2. Add your Hugging Face API token to a `.env` file:

```bash
HUGGINGFACE_API_TOKEN=<your_huggingface_token>
```

3. Install dependencies and download trial data:

```bash
npm install
npm run download
```

4. Verify that the downloaded data appears in the `data_trial_<timestamp>/` folder.
5. If the data is clean, download the full dataset:

```bash
npm run download -- --all
```

### 🔹 Fine-Tune the Model

#### Setup

```bash
conda env create -f tc_ranker_environment.yaml
conda activate tc_ranker
```

Or do it manually:
```bash
conda create -n tc_ranker python=3.10
conda activate tc_ranker
conda install jupyter
conda install pandas
conda install scikit-learn
conda install transformers
conda install pytorch
conda install datasets
pip install 'accelerate>=0.26.0'
# pip install torch transformers datasets

```

Open the `Ray_score_prediction.ipynb` file in Jupyter Notebook:

```python
```


---

## 📚 References

### 🔹 Cheerio
- [Cheerio.js](https://cheerio.js.org/) - A library for parsing HTML.

### 🔹 Facebook/BART
- [facebook/bart-large-mnli](https://huggingface.co/facebook/bart-large-mnli) - Used for zero-shot classification of T&C documents.

### 🔹 Legal-BERT
- **Paper:** [LEGAL-BERT: The Muppets Straight Out of Law School](https://aclanthology.org/2020.findings-emnlp.261/)
- **Arxiv:** [Paper PDF](https://arxiv.org/pdf/2010.02559)
- **Model Variants on Hugging Face:**
  - [legal-bert-base-uncased](https://huggingface.co/nlpaueb/legal-bert-base-uncased)
  - [legal-bert-large-uncased](https://huggingface.co/nlpaueb/legal-bert-large-uncased)
  - [bert-base-uncased-eurlex](https://huggingface.co/nlpaueb/bert-base-uncased-eurlex) (Fine-tuned for EURLEX)
  - [bert-base-uncased-contracts](https://huggingface.co/nlpaueb/bert-base-uncased-contracts)

### 🔹 Additional Resources
- [Legal-BERT Training Overview](https://www.youtube.com/watch?v=-Ix2zWbq878)
- [Open Source Legal Dataset](https://huggingface.co/datasets/coastalcph/lex_glue)

---
