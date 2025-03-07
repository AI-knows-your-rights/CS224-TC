# 📌 Instructions

### 🔹 Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 🔹 Run Tests

To test the setup, execute:

```bash
npm run download
```

### 🔹 Download All Services

To download all services, run:

```bash
npm run download -- --all
```

### 🔹 Clean Up Clauses

To clean up the clauses in the `../data/` folder, use the command below. Replace `../data/` with the desired folder path if needed.

```bash
node ./cleanClause.js --folder ../data
```


### 🔹 Analyze Folder

To run the analyze_folder.py script, use the command below. Replace `../data/` with the desired folder path if needed. It creates a YAML report of the analysis for each of the subfolders and documents.

```bash
python analyze_folder.py ../data
```

There is default output file name `current_folder_report.yaml`. If you want to change the output file name, use the command below.
```bash
python analyze_folder.py /path/to/your/folder --output analysis.yaml
```
