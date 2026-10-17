# Open-Source AI Integration

## Goal

Use an open-source/local inference stack as the default model layer while keeping the application provider-neutral.

Recommended integrations:

- **gpt-oss**: primary open-weight model family when locally available.
- **Ollama**: local model lifecycle and HTTP inference adapter.
- **llama.cpp**: direct GGUF inference adapter for machines where a separate model server is preferred.
- **OpenAI-compatible endpoints**: compatibility adapter for other local or self-hosted servers.
- **Open WebUI**: optional separate user interface; it is not a dependency of the core runtime.

The application should not copy another product's proprietary source code or assets. Its UI can instead be independently redesigned around the same broad interaction patterns: conversation history, model selection, attachments, tool status, settings, and a workspace/sandbox panel.

## Model architecture

```text
Agent
  -> ModelRouter
      -> LocalProvider
          -> OllamaAdapter
          -> LlamaCppAdapter
          -> OpenAICompatibleAdapter
      -> OptionalRemoteProvider
```

## Model selection

Configuration determines the default provider and model. Agents depend only on the `ModelProvider` contract, so changing from Ollama to llama.cpp does not require changing agent code.

## Missing-file strategy

When a model or provider is unavailable:

1. Detect the unavailable module during startup.
2. Mark the module unavailable rather than crashing unrelated modules.
3. Return a typed provider error to the router.
4. Attempt an explicitly configured fallback provider.
5. Surface the provider state in the UI.

## License and provenance

Keep third-party projects as external dependencies or documented integrations unless their licenses and source structure have been reviewed. Do not copy source code, trademarks, private assets, or proprietary UI implementations into this repository merely to reproduce a product.
