export const countTokens = (_text: string, _model: string): number => {
  // 1. Map _model to a tiktoken-compatible model name if needed:
  //    - "gpt-4o" and "gpt-4o-mini" are both supported by tiktoken directly
  //    - If an unsupported model is passed → throw new Error("Unsupported model: ...")
  //
  // 2. Get the encoder for the model:
  //    encoding_for_model(_model as TiktokenModel)
  //    - This returns a model-specific BPE encoder
  //
  // 3. Encode the input text into tokens:
  //    encoder.encode(_text)
  //    - Returns a Uint32Array of token IDs
  //
  // 4. Read the token count:
  //    encoded.length
  //
  // 5. Free the encoder to release WASM memory:
  //    encoder.free()
  //    - Must always run, even on error — wrap steps 3-4 in try/finally
  //
  // 6. Return the token count as a number
  throw new Error("Not implemented");
};
