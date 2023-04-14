from dotenv import load_dotenv
import os
import openai
load_dotenv("../.env")

openai.organization = "org-gBnGsLiVPIUoGc2xnPBzDfl0"
openai.api_key = os.getenv("GPT_KEY")
list = openai.Model.list()

print(list)