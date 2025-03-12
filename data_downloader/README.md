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


## Known Issues


### Cannot retrieve the T&C documents

Sometimes there are errors such as:


```
No response received for http://www.synonymo.fr/conditions_generales_utilisation: Maximum number of redirects exceeded
Error processing document conditions_generales_utilisation for service Synonymo: Maximum number of redirects exceeded
No response received for http://www.synonymo.fr/politique-de-cookies: Maximum number of redirects exceeded
Error processing document politique-de-cookies for service Synonymo: Maximum number of redirects exceeded
```


### Cannot classify the T&C documents

Sometimes there are errors such as:

```

Error during classification: "unknown error"
The document privacy.php for service XE.com failed to classify.
The document privacy.php for service XE.com has been saved as Review_01.txt.
```

This is because the document is not classified. You can ignore this error.



