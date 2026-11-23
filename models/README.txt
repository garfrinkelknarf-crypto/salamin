OPTIONAL: host the speech model yourself

By default, the first transcript downloads the speech model from huggingface.co (about 80 to 300 MB),
and the browser keeps it for next time. If huggingface.co is blocked on the school network, the person
who manages the website can put the model here instead. Salamin checks this folder first.

Folder layout (one folder per model, same names as on Hugging Face):
  models/onnx-community/whisper-base/    for "Faster, smaller download"
  models/onnx-community/whisper-small/   for "More accurate, slower"

How to fill it, on a computer that can reach huggingface.co:
  git lfs install
  git clone https://huggingface.co/onnx-community/whisper-base models/onnx-community/whisper-base
  (and the same for whisper-small if you want it)
Then upload the models folder with the rest of the app. The repository holds several versions of
each file; the app uses only some of them, so you may delete .onnx files you do not need, but keep
all the .json files and the onnx folder.
