# AI Engineering — Personal Reference

> Quick-reference doc covering the full learning path, projects to build, and everything you need without opening syllabus/roadmap files.

---

## Learning Path Overview

| Phase | Focus | Modules |
|-------|-------|---------|
| 1 | Foundation | LLM Fundamentals, APIs, Prompt Engineering |
| 2 | Data Layer | Embeddings, Vector DBs, RAG |
| 3 | Intelligence | AI Agents, Multimodal |
| 4 | Production | Open-Source Models, Testing, Deployment |
| 5 | Specialization | Fine-tuning, Advanced Patterns |

**Monetization unlock**: After Phase 2 (Modules 4-6) → start offering RAG chatbots. After Phase 3 (Modules 8-10) → add agent capabilities.

---

## Progress Tracker

### Phase 1 — Foundation

#### Module 1: LLM Fundamentals
- [ ] **1.1** Transformers & LLMs — History (RNN → Attention → Transformers), architecture, pre-train vs fine-tune, autoregressive generation
- [ ] **1.2** Tokenization — BPE algorithm, token limits, special tokens, multilingual tokenization
- [ ] **1.3** Context Windows — 4K to 200K tokens, chunking/summarization strategies, recency bias
- [ ] **1.4** Generation Controls — Temperature, Top-p, Frequency/Presence penalty, Stop sequences, Max tokens
- [ ] **1.5** Model Selection — Capability vs cost, GPT-4 vs Claude vs Llama, benchmarks (MMLU, HumanEval)

**Build**: Model router that picks a model based on task complexity, budget, and response time.

#### Module 2: OpenAI API
- [ ] **2.1** Platform Setup — API keys, orgs, billing, versioning
- [ ] **2.2** Chat Completions API — Message roles (system/user/assistant), conversation history, error handling
- [ ] **2.3** Token Management — tiktoken, truncation, cost estimation, prompt compression
- [ ] **2.4** Streaming Responses — SSE, parsing chunks, stop button, WebSocket alternative

**Build**: ChatGPT-like web interface with streaming, stop button, token usage display, and conversation export.

#### Module 3: Prompt Engineering
- [ ] **3.1** Effective Prompts — Clarity, context, role assignment, output format (RISEN framework)
- [ ] **3.2** Few-Shot Learning — Zero/one/few-shot, example selection, dynamic examples
- [ ] **3.3** Chain of Thought (CoT) — Step-by-step reasoning, zero-shot CoT, self-consistency
- [ ] **3.4** ReAct Pattern — Thought → Action → Observation loop, tool use in reasoning
- [ ] **3.5** Advanced Techniques — Prompt chaining, self-refinement, constrained generation (JSON output)

**Build**: Content generator that drafts → self-critiques → refines → outputs.

---

### Phase 2 — Data Layer

#### Module 4: Embeddings
- [ ] **4.1** What Are Embeddings — Dense vs sparse, cosine similarity, dimensionality (384D, 768D, 1536D)
- [ ] **4.2** OpenAI Embeddings API — `text-embedding-3-small` vs `3-large`, batch processing, caching
- [ ] **4.3** Open-Source Alternatives — Sentence Transformers (`all-MiniLM-L6-v2`), multilingual models
- [ ] **4.4** Use Cases — Semantic search, clustering, anomaly detection, recommendations, zero-shot classification

**Build**: Smart semantic search over personal notes + recommendation engine for similar content.

#### Module 5: Vector Databases
- [ ] **5.1** Why Vector DBs — ANN algorithms (HNSW, IVF), speed vs accuracy tradeoff
- [ ] **5.2** Pinecone — Index creation, upsert, top-k query, namespaces, hybrid search
- [ ] **5.3** ChromaDB — In-memory vs persistent, auto-embedding, metadata filtering
- [ ] **5.4** Supabase pgvector — SQL + vector hybrid queries, RLS for multi-tenant
- [ ] **5.5** DB Comparison — Pick based on: Pinecone (prod), Chroma (local/proto), Supabase (existing Postgres)

**Vector DB Decision**:
| DB | Use When |
|----|----------|
| Pinecone | Production, need managed service |
| ChromaDB | Prototyping, local dev, free |
| Supabase pgvector | Already using Postgres |
| Qdrant | Self-hosted production |

**Build**: Benchmark — index 10K docs in 3 DBs, measure query speed, accuracy, and cost.

#### Module 6: RAG Fundamentals
- [ ] **6.1** What is RAG — Why LLMs need your data, RAG vs fine-tuning decision
- [ ] **6.2** Pipeline Components — Load → Chunk → Embed → Store → Retrieve → Generate
- [ ] **6.3** Chunking Strategies — Fixed-size (512/1024 tokens), sentence, paragraph, semantic, overlap
- [ ] **6.4** Retrieval Optimization — Top-k, reranking, hybrid search (BM25 + vector), HyDE, parent-child chunks
- [ ] **6.5** Generation & Prompt Design — Context injection, handling irrelevant retrievals, source citations

#### Module 7: RAG Implementation
- [ ] **7.1** Manual RAG (From Scratch) — Full pipeline without frameworks for deep understanding
- [ ] **7.2** LangChain — Document loaders, text splitters, vector stores, RetrievalQA chains
- [ ] **7.3** LlamaIndex — VectorStoreIndex, query engines, response synthesis
- [ ] **7.4** OpenAI Assistants API — Persistent assistants, threads, runs, file retrieval
- [ ] **7.5** RAG Evaluation — Ragas, DeepEval, LangSmith; faithfulness, relevance, retrieval precision/recall

**Build**: "Chat with PDFs" app — upload → auto-index → Q&A with sources + RAG benchmark (50 questions, 3 configs).

---

### Phase 3 — Intelligence

#### Module 8: AI Agents Fundamentals
- [ ] **8.1** What Are Agents — Perceive → Plan → Act → Observe loop, when agents vs simple prompts
- [ ] **8.2** Tool Definition — Schema (name, description, parameters), required vs optional, return handling
- [ ] **8.3** OpenAI Function Calling — Detect function call → execute → feed result back → multi-turn
- [ ] **8.4** Agent Architectures:
  - **ReAct** (Reason + Act) — start here
  - **CoT Agent** — explicit reasoning chains
  - **RAG Agent** — retrieval + action (customer support use case)
  - **MCP** (Model Context Protocol) — Anthropic's standardized tool interface
- [ ] **8.5** Agent Memory — Short-term (context), long-term (vector DB), episodic, semantic, compression

**Build**: Personal assistant with memory — stores preferences, retrieves past context, personalizes responses.

#### Module 9: Building Production Agents
- [ ] **9.1** Manual Agent Loop — Iteration cap, error handling, timeout protection, step logging
- [ ] **9.2** LangChain Agents — Zero-shot ReAct, Conversational, OpenAI Functions agent types
- [ ] **9.3** Multi-Agent Systems — CrewAI, AutoGen, LangGraph; sequential/parallel/hierarchical patterns
- [ ] **9.4** Agent Evaluation — Task success rate, tool use accuracy, efficiency (steps per task), cost per task
- [ ] **9.5** Agent Security — Prompt injection defense, tool sandboxing, PII handling, cost limits, human-in-the-loop

**Build**: Content creation pipeline — Research agent → Writing agent → Fact-checker → Editor.

#### Module 10: Multimodal AI
- [ ] **10.1** Image Understanding — GPT-4V, base64/URL encoding, OCR, detail levels
- [ ] **10.2** Image Generation — DALL-E 3 API, prompt engineering for images, quality/style/size options
- [ ] **10.3** Speech-to-Text — Whisper API, multilingual, timestamps, audio translation
- [ ] **10.4** Text-to-Speech — TTS-1/TTS-1-HD, voice options (alloy, echo, fable, onyx, nova, shimmer)
- [ ] **10.5** Multimodal Applications — Combine vision + text + speech in one app

**Build**: Multimodal assistant — voice input (Whisper) + image analysis (GPT-4V) + voice output (TTS) + image generation (DALL-E).

---

### Phase 4 — Production

#### Module 11: Production & Monitoring
- [ ] **11.1** Debugging & Logging — Structured JSON logs, trace agent steps, performance metrics
- [ ] **11.2** LangSmith — Trace visualization, dataset creation, evaluation, feedback collection
- [ ] **11.3** Cost Optimization — Model selection, prompt caching, response caching, batch processing, fallback models
- [ ] **11.4** Rate Limiting — Exponential backoff, request queuing, RPM/TPM management

---

### Phase 5 — Specialization

#### Module 12: Advanced Topics
- [ ] **12.1** Fine-tuning — When to fine-tune vs RAG vs prompting; JSONL data prep; OpenAI fine-tuning API
- [ ] **12.2** Local LLM with Ollama — Llama 3 / Mistral locally, quantization, GPU vs CPU inference
- [ ] **12.3** Agentic Workflows — Sequential, parallel, conditional, loop, hierarchical patterns
- [ ] **12.4** MCP Deep Dive — Build MCP server, connect to Claude Desktop, standard tool interfaces

---

## Projects Checklist

| # | Project | Module | Status |
|---|---------|--------|--------|
| 1 | CLI Chatbot with conversation history | 2.2 | [ ] |
| 2 | Token counter + cost estimator utility | 2.3 | [ ] |
| 3 | ChatGPT-like UI with streaming | 2.4 | [ ] |
| 4 | Email/spam classifier (few-shot) | 3.2 | [ ] |
| 5 | Content generator with self-critique loop | 3.5 | [ ] |
| 6 | Semantic search over personal notes | 4.4 | [ ] |
| 7 | Vector DB benchmark (3 DBs, 10K docs) | 5.5 | [ ] |
| 8 | Manual RAG pipeline (no frameworks) | 7.1 | [ ] |
| 9 | Chat with PDFs app | 7.1 | [ ] |
| 10 | RAG with LangChain | 7.2 | [ ] |
| 11 | RAG with LlamaIndex | 7.3 | [ ] |
| 12 | RAG evaluation benchmark | 7.5 | [ ] |
| 13 | Multi-tool agent (calculator, weather, search) | 8.3 | [ ] |
| 14 | Personal assistant with long-term memory | 8.5 | [ ] |
| 15 | Content creation multi-agent pipeline | 9.3 | [ ] |
| 16 | Receipt scanner (Vision) | 10.1 | [ ] |
| 17 | Meeting transcriber (Whisper) | 10.3 | [ ] |
| 18 | Multimodal assistant (all modalities) | 10.5 | [ ] |
| 19 | Fine-tuned model on custom data | 12.1 | [ ] |
| 20 | Local RAG system with Ollama | 12.2 | [ ] |
| **F** | **Final: Production AI App (see below)** | Final | [ ] |

---

## Final Project Requirements

Build a production-ready AI app with all of:
- [ ] RAG system with custom knowledge base
- [ ] AI agent with 3+ tools
- [ ] Multimodal support (2+ modalities)
- [ ] Authentication + user management
- [ ] Monitoring and logging (LangSmith)
- [ ] Cost tracking and optimization
- [ ] Error handling and retries
- [ ] React frontend
- [ ] Node.js/Express backend
- [ ] Deployed (Vercel + Railway/Render)

**Idea options**: Customer Support Bot / Content Creator / Data Analyst Agent / Personal AI Assistant

---

## Key Concepts Cheat Sheet

### Prompt Engineering Frameworks
- **RISEN**: Role, Instructions, Steps, Examples, Negative examples
- **CoT**: "Let's think step by step" for math/logic
- **ReAct**: Thought → Action → Observation loop
- **HyDE**: Generate hypothetical answer → use as query embedding

### RAG Chunking Rules of Thumb
- Small chunks (256 tokens) → precise retrieval, less context
- Large chunks (1024 tokens) → more context, less precise
- Always add 50-100 token overlap
- Top-k: retrieve 3-10 chunks per query

### Agent Memory Storage Options
| Memory Type | Storage |
|------------|---------|
| Short-term | Conversation context |
| Long-term | Vector DB (semantic search over past) |
| Structured | SQL database |
| Fast access | Redis key-value |

### Model Selection Quick Guide
| Task | Model |
|------|-------|
| Complex reasoning | GPT-4 / Claude Opus |
| Fast, cheap tasks | GPT-3.5-turbo / Claude Haiku |
| Long context (200K) | Claude |
| Free / private | Llama 3 via Ollama |
| Code | GPT-4 / Codestral |

---

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| LLM API | OpenAI (GPT-4, GPT-3.5) | Start here |
| Alt LLM | Anthropic Claude | Best for long context |
| Local LLM | Ollama + Llama 3 | Free, private |
| Vector DB | ChromaDB → Pinecone | Prototype → Production |
| RAG Framework | Manual first, LangChain later | Learn internals first |
| Monitoring | LangSmith | Trace + evaluate |
| Frontend | React | You already know this |
| Backend | Node.js / Express | You already know this |
| Deployment | Vercel (FE) + Railway (BE) | |
| Embeddings | `text-embedding-3-small` | Cheap and good |
| Speech | Whisper (STT) + TTS-1 (TTS) | |
| Images | GPT-4V (analysis) + DALL-E 3 (gen) | |

---

## Your Existing Skills Mapped to AI

| Skill You Have | AI Use Case |
|----------------|-------------|
| React | Chat UIs, streaming interfaces, agent dashboards |
| Node.js | API integration, agent backends, tool servers |
| SQL | Structured agent data, analytics, pgvector |
| Redis | Embedding cache, rate limiting, session memory |

---

## Resources

**Books**: "AI Engineering" by Chip Huyen · "Building LLM Apps" by Chris Albon
**Courses**: DeepLearning.AI short courses · Andrew Ng on Coursera · Fast.ai
**Communities**: LangChain Discord · HuggingFace Forums · r/LLMDevs
**Stay updated**: HuggingFace Daily Papers · @OpenAI @AnthropicAI on Twitter

**Evaluation tools**: Ragas (RAG) · DeepEval (LLM) · LangSmith (tracing + evals)
**Agent frameworks**: LangChain · LlamaIndex · CrewAI · AutoGen · LangGraph
**Monitoring**: LangSmith · Helicone · LangFuse (open-source)