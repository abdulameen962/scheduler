# import tensorflow as tf
# from transformers import AutoTokenizer, TFBertForMaskedLM

# # Pre-trained masked language model
# MODEL = "bert-base-uncased"

# # Number of predictions to generate
# # K = 3

# class BERT_AI():
#     """
#         Using bert model to predict the next words of a user
#     """
    
#     def __init__(self,words=1):
#         self.model = TFBertForMaskedLM.from_pretrained(MODEL)
#         self.tokenizer = AutoTokenizer.from_pretrained(MODEL)
#         self.words = words
    
#     def predict_next_word(self, text):
#         """
#             Predict the next word of a user
#         """
#         # Tokenize input
#         text = f"{text} {self.tokenizer.mask_token}."
#         inputs = self.tokenizer(text, return_tensors="tf")
#         mask_token_index = self.get_mask_token_index(self.tokenizer.mask_token_id, inputs)
#         if mask_token_index is None:
#             result = f"Input must include mask token {self.tokenizer.mask_token}."
            
#             return result

#         # Use model to process input
#         result = self.model(**inputs, output_attentions=True)

#         # Generate predictions
#         mask_token_logits = result.logits[0, mask_token_index]
#         top_tokens = tf.math.top_k(mask_token_logits, self.words).indices.numpy()
#         for token in top_tokens:
#             result = text.replace(self.tokenizer.mask_token, self.tokenizer.decode([token]))
#             # result = result.replace(" .", "")
#             result = result[:-1]
#             return result
            
            
#     def get_mask_token_index(self,mask_token_id, inputs):
#         """
#         Return the index of the token with the specified `mask_token_id`, or
#         `None` if not present in the `inputs`.
#         """
#         # TODO: Implement this function
#         input_tokens = inputs.input_ids
        
#         try:
#             input_id = list(input_tokens[0]).index(mask_token_id)
#             return input_id
            
#         except Exception:
#             return None
        
#     def get_color_for_attention_score(self,attention_score):
#         """
#         Return a tuple of three integers representing a shade of gray for the
#         given `attention_score`. Each value should be in the range [0, 255].
#         """
#         # TODO: Implement this function
#         divisor = int(round(float(attention_score) * 255,0))
        
#         color_for_attention = (divisor,divisor,divisor)
        
#         return color_for_attention
    