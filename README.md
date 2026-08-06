# T&C Ranker — Lost in Legalese: NLP for Privacy Risk Detection

[![pages-build-deployment](https://github.com/AI-knows-your-rights/CS224-TC/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/AI-knows-your-rights/CS224-TC/actions/workflows/pages/pages-build-deployment)

Fine-tuned LegalBERT models that detect unfair and privacy-invasive clauses in consumer Terms & Conditions agreements — classifying individual clauses and scoring entire documents for privacy risk.

**Stanford CS224N (Natural Language Processing with Deep Learning) final project.**
Authors: Ray Hu, Benjamin Ward, Basant Khalil · Mentor: Jing Huang
📄 [Project poster](docs/CS_224N_Project_Poster.pdf)

## Why This Matters

Terms & Conditions agreements are long, complex, and deliberately obscure. Users routinely accept clauses that waive their legal rights — in one widely reported case, a family's lawsuit was dismissed because of an arbitration clause buried in a Disney+ trial agreement. Reading every T&C is not realistic; automated privacy-risk detection is.

The model performs two tasks:

1. **Clause classification** — rate each clause: `Good` / `Neutral` / `Bad` / `Very Bad`
2. **Document scoring** — assign an overall privacy-risk grade (`A`–`E`) to a full T&C document

## Results

| Model | Test Accuracy | Test F1 |
|---|---|---|
| LLaMA-2 7B (zero-shot) | 0.28 | 0.23 |
| LLaMA-2 7B (chain-of-thought) | 0.30 | 0.24 |
| **LegalBERT (fine-tuned)** | **0.84** | **0.84** |
| LegalBERT (LoRA, r=8) | 0.77 | 0.77 |

Fine-tuned LegalBERT beats strong LLM prompting baselines by ~3x on real-world legal text, confirming that domain-adapted encoders still outperform general-purpose LLMs on specialized classification tasks. LoRA achieves 92% of full fine-tuning quality while updating a small fraction of parameters.

**Evaluation rigor:** legal documents are full of paraphrased boilerplate, so a naive train/test split leaks information. We de-duplicated using n-gram similarity (n = 3) and removed test clauses with >0.5 similarity to any training clause.

## Dataset

- **450 T&C documents, 9,292 human-annotated clauses**, collected from community-annotated Terms-of-Service reviews ([ToS;DR](https://tosdr.org)-style points and cases)
- Each company's folder contains website metadata (`details.json`), clause-level ratings (`clauses.json`), and original + text-converted T&C documents
- Document candidates are classified as T&C vs. non-T&C using zero-shot classification with [facebook/bart-large-mnli](https://huggingface.co/facebook/bart-large-mnli)

Document grades follow the community scoring methodology:

```
balance = good_points − bad_points − (3 × blocker_points)
```

| Grade | Condition |
|---|---|
| A | Only good points |
| B | Some bad points exist |
| C | balance < 5 |
| D | blockers ≥ 3, or bad > good |
| E | balance ≤ −10, or blockers > good |

## Repository Structure

```
├── data_downloader/               # Node.js scraper + HuggingFace data fetch
├── data/                          # Raw data
├── data_all_<timestamp>/          # Cleaned per-company data snapshots
├── src/                           # Shared processing code
├── baselines/                     # LLaMA-2 zero-shot & CoT baselines
├── LegalBERT_model.ipynb          # LegalBERT full fine-tuning
├── LegalBERT_with_LoRA.ipynb      # LegalBERT + LoRA (r=8, α=16)
├── LegalBERT_hyperparam_tuning.ipynb
├── BERT_model.ipynb               # BERT baselines
├── BERT_with_LoRA.ipynb
├── BERT_hyperparam_tuning.ipynb
├── Ray_score_prediction.ipynb     # Document-level scoring
└── tc_ranker_environment.yaml     # Conda environment
```

## Usage

### Clone

```bash
git lfs install
git clone --depth 1 https://github.com/AI-knows-your-rights/TC-ranker.git
cd TC-ranker
git lfs pull
```

### Download data

```bash
cd data_downloader
echo "HUGGINGFACE_API_TOKEN=<your_token>" > .env
npm install
npm run download           # trial subset first
npm run download -- --all  # full dataset once verified
```

### Set up environment & train

```bash
conda env create -f tc_ranker_environment.yaml
conda activate tc_ranker
jupyter notebook LegalBERT_with_LoRA.ipynb
```

Training configuration: LoRA rank 8, alpha 16, dropout 0.1 · batch size 16 · lr 3e-4 · 6 epochs.

## Known Limitations & Future Work

- "Very Bad" clauses are under-predicted (recall 0.48) — threshold tuning and confidence calibration are the next step
- Clauses citing external laws confuse the model — retrieval augmentation (RAG) with legal context is planned
- Document-level scoring is sensitive to clause-extraction parsing errors — exploring attention-based aggregation
- Expanding beyond consumer T&Cs to finance and healthcare contracts

## References

- Chalkidis et al., [LEGAL-BERT: The Muppets Straight Out of Law School](https://aclanthology.org/2020.findings-emnlp.261/), EMNLP Findings 2020
- Hu et al., [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685), NeurIPS 2021
- Touvron et al., [Llama 2: Open Foundation and Fine-Tuned Chat Models](https://arxiv.org/abs/2307.09288), 2023
- Harkous et al., [Polisis: Automated Analysis of Privacy Policies](https://www.usenix.org/conference/usenixsecurity18/presentation/harkous), USENIX Security 2018
- [LexGLUE benchmark](https://huggingface.co/datasets/coastalcph/lex_glue)

## License

[MIT](LICENSE)
