
# List available models
for model in client.models.list():
    print(f"Model: {model.name}")