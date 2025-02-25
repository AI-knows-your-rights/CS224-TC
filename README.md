
# Folder Structure

- src/
  - lergal-bert.py

  - shell_commands.md
- data/


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

