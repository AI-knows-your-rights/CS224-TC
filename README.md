
# Folder Structure

- data_downloader/
  - download-data.js
  
- src/
  - lergal-bert.py

- data/

The naming convention is data_all_<timestamp>. use the latest data_all_xxxxxxxx folder.

For each company, there is a folder with the company name.

It contains a details.json with the website scoring.

Also it contains a service.html with the clause by clause rating. The servicve.html is converted to service.txt with the text content for easier reading.

There is also a documents folder with the downloaded documents.

The original documents are in html format. Each document has a text version for easier reading. And then the text version is classified as a T&C or not by the facebook/bart model.

The TC_xx files are cleaned up data from the downloaded documents and went through the facebook/bart classification as a T&C.

The Review_xx files are the downloaded documents that are less likely to be a T&C.

# Usage

```bash
conda activate tc_ranker
python src/lergal-bert.py
```

# Setup

```bash
conda create -n tc_ranker python=3.10
conda activate tc_ranker
conda install jupyter
pip install torch transformers datasets
```

# Data

EURLEX57K is a classification dataset.

<!-- - data/
  - train.csv
  - test.csv
  - validation.csv
  - train.csv
  - test.csv -->
# References

LEGAL-BERT: The Muppets straight out of Law School
https://arxiv.org/pdf/2010.02559

Legal Bert Model on Hugging Face:
https://huggingface.co/nlpaueb/legal-bert-base-uncased

A introduction to Legal Bert training:
https://www.youtube.com/watch?v=-Ix2zWbq878


https://opensource.legal/projects/Legal_BERT


Open Source Legal Dataset:
https://huggingface.co/datasets/coastalcph/lex_glue

