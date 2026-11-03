import os
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader
)

def load_all_documents(folder_path):

    documents = []

    for file in os.listdir(folder_path):

        file_path = os.path.join(folder_path, file)

        if file.endswith(".pdf"):
            loader = PyPDFLoader(file_path)

        elif file.endswith(".txt"):
            loader = TextLoader(file_path)

        elif file.endswith(".docx"):
            loader = Docx2txtLoader(file_path)

        else:
            continue

        documents.extend(loader.load())

    return documents


# Example usage
docs = load_all_documents("./data")

print("Total documents:", len(docs))
print(docs[0].page_content)
print(docs[0].metadata)