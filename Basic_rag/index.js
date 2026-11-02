import "dotenv/config";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
// We'll implement the complete pipeline:
// Load documents.
// Split documents into chunks.
// Generate embeddings.
// Store embeddings in a vector database.
// Retrieve relevant chunks based on a user query.
// Pass retrieved context to the LLM.
// Generate the final answer.
async function main() {
    // 1. LOAD DOCUMENTS
    const text = `
        LangChain is a framework for building LLM applications.

        RAG stands for Retrieval Augmented Generation.

        RAG allows LLMs to retrieve external information before
        generating an answer.

        Embeddings convert text into numerical vectors.

        Vector databases store embeddings and help retrieve
        semantically similar information.
    `;
    const documents = [
        new Document({
            pageContent: text,
            metadata: { source: "knowledge.txt" }
        })
    ];
    // 2. CHUNKING
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 30
    });
    const chunks = await splitter.splitDocuments(documents);
    console.log("Total Chunks:", chunks.length);
    // 3. EMBEDDINGS
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small"
    });
    // 4. STORE EMBEDDINGS IN VECTOR DATABASE
    const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
    console.log("Documents stored successfully!");
    // 5. USER QUERY
    const query = "What is RAG and why is it used?";
    // 6. RETRIEVAL
    const retriever = vectorStore.asRetriever({
        k: 2
    });
    const relevantDocs = await retriever.invoke(query);
    console.log("Retrieved Documents:", relevantDocs);
    // 7. CREATE CONTEXT
    const context = relevantDocs
        .map(doc => doc.pageContent)
        .join("\n\n");
    // 8. SEND CONTEXT TO LLM
    const llm = new ChatOpenAI({
        model: "gpt-4.1-mini",
        temperature: 0
    });
    const response = await llm.invoke([
        {
            role: "system",
            content: `
                Answer the question using ONLY the provided context.

                Context:
                ${context}

                If the answer is not available in the context,
                say you don't know.
            `
        },
        {
            role: "user",
            content: query
        }
    ]);
    // 9. FINAL ANSWER
    console.log("\nFinal Answer:");
    console.log(response.content);
}
main();
