# T&C Ranker

This repository contains the code for the T&C Ranker project.
It is part of Stanford CS 224N Final Project.

By Ray Hu, Benjamin Ward, and Basant Khalil

Mentored by Jing Huang


## Folder Structure

- data_downloader/
  - download-data.js
  
- src/
  - lergal-bert.py

- data/

## Data

The Data are downloaded to the data folder. These are the raw data, not cleaned up.

The data_all_\<timestamp\> contains cleaned up data, use the latest folder.

For each company, there is a folder of the company name.

### Website Scoring
The folder contains a details.json with the website scoring, the domain and the url, etc.

The grading system works as follows:

Point Types:
Points can be classified as: ‘good’, ‘neutral’, ‘bad’, or ‘blocker’
Each point must be ‘approved’ to be counted in the grade calculation


#### Grade Calculation Process:

First, it counts the number of each type of point

Then calculates a balance score using the formula:

```
     balance = number_of_good_points - number_of_bad_points - (number_of_blocker_points * 3)
```

#### Grade Assignment Rules:

Grade ‘N/A’: If there are no points (good + bad + blocker = 0)
Grade ‘E’: If balance ≤ -10 OR if blockers > good points
Grade ‘D’: If blockers ≥ 3 OR if bad points > good points
Grade ‘C’: If balance < 5
Grade ‘B’: If there are any bad points
Grade ‘A’: All other cases (essentially, only good points)

We can use the same approach to calculate the document scoring based on the predicted clauses rating.

### Clause by Clause Rating
Also the folder contains a service.html with the clause by clause rating. The servicve.html is converted to service.txt with the text content for easier reading.

Convert the service.html into JSON format for easier processing.


### T&C Documents

In the website folder, there is a documents subfolder that contains the T&C documents.

The original documents are in html format. Each document has a text version for easier reading. And then the text version is classified as a T&C or not by the facebook/bart model. If they are classified as a T&C, the filename is TC_xx. If they are classified as not a T&C, the filename is Review_xx.


## Usage

### Run the Data downloader:

Go to data_downloader folder, put your huggingface token in the .env file under this folder, 

```bash
HUGGINGFACE_API_TOKEN=<your_huggingface_token>
```

And then run:

```bash
npm install
npm run download
```

Now, verify the five trial data is downloaded in the data_trial_\<timestamp\> folder. Check for any errors and data quality issues.

When the data is clean and tidy, run the following command to download all the data:
```
npm run download -- --all
```

### Fine-tune the model:

#### Setup

```bash
conda create -n tc_ranker python=3.10
conda activate tc_ranker
conda install jupyter
pip install torch transformers datasets
python src/lergal-bert.py
```


## References


### Cheerio

https://cheerio.js.org/

A library for parsing HTML.

### facebook/bart

https://huggingface.co/facebook/bart-large-mnli

This is a fine-tuned model for zero-shot classification. We use it to classify the downloaded documents as a T&C or not.

### Legal-bert
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

