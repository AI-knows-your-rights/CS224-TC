
# Folder Structure

- data_downloader/
  - download-data.js
  
- src/
  - lergal-bert.py

- data/

# Data

The Data are downloaded to the data_all_<timestamp>, use the latest data_all_<timestamp> folder. For each company, there is a folder with the company name.

## Website Scoring
It contains a details.json with the website scoring, the domain and the url, etc.

## Clause by Clause Rating
Also it contains a service.html with the clause by clause rating. The servicve.html is converted to service.txt with the text content for easier reading.

### TODO: convert the service.html into JSON format for easier processing.

### TODO: Re-organize the data by rating and detect the clauses distribution. Similar T&C clauses shall receive similar rating, but maybe there are overlapping in the manually rated clauses.

## T&C Documents
There is also a documents folder with the downloaded documents.

The original documents are in html format. Each document has a text version for easier reading. And then the text version is classified as a T&C or not by the facebook/bart model.

The TC_xx files are cleaned up data from the downloaded documents and went through the facebook/bart classification as a T&C.

The Review_xx files are the downloaded documents that are less likely to be a T&C.

# Usage

## Run the Data downloader:

Go to data_downloader folder and run:
```bash
npm install
npm run download
```
Verify the data is downloaded in the data_trial_<timestamp> folder.

When the data is clean and tidy, run the following command to download all the data:
```
npm run download -- --all
```

## Fine-tune the model:

### Setup

```bash
conda create -n tc_ranker python=3.10
conda activate tc_ranker
conda install jupyter
pip install torch transformers datasets
python src/lergal-bert.py
```


# References


## Cheerio

https://cheerio.js.org/

A library for parsing HTML.

## facebook/bart

https://huggingface.co/facebook/bart-large-mnli

This is a fine-tuned model for zero-shot classification. We use it to classify the downloaded documents as a T&C or not.

## Legal-bert
LEGAL-BERT: The Muppets straight out of Law School(https://aclanthology.org/2020.findings-emnlp.261/)

https://arxiv.org/pdf/2010.02559


There are different choices of legal-bert models on huggingface.

https://huggingface.co/nlpaueb/legal-bert-base-uncased
model_name = "nlpaueb/legal-bert-base-uncased"

https://huggingface.co/nlpaueb/legal-bert-large-uncased
model_name = "nlpaueb/legal-bert-large-uncased"

finetuned for EURLEX
https://huggingface.co/nlpaueb/bert-base-uncased-eurlex


https://huggingface.co/nlpaueb/bert-base-uncased-contracts


A introduction to Legal Bert training:
https://www.youtube.com/watch?v=-Ix2zWbq878


https://opensource.legal/projects/Legal_BERT


Open Source Legal Dataset:
https://huggingface.co/datasets/coastalcph/lex_glue

