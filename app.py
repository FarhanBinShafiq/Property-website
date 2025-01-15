from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# Function to load and extract plain text from HTML pages
def load_website_content():
    content = ""
    pages = ["index.html", "vila-voio.html", "vila-petra2.html", "vila-oikos.html", "about-us.html"]

    for page in pages:
        if os.path.exists(page):
            with open(page, "r", encoding="utf-8") as file:
                soup = BeautifulSoup(file, "html.parser")
                page_text = soup.get_text().lower()  # Extract text and convert to lowercase
                print(f"Loaded content from {page}: {page_text[:200]}...")  # Debugging: first 200 characters of page text
                content += page_text  # Combine content from all pages
    return content

# A function to search the plain text content from the website
def search_website(message):
    website_content = load_website_content()  # Load the plain text from the website
    print(f"Full website content loaded: {website_content[:300]}...")  # Debugging: preview of full content

    message = message.lower()  # Normalize user message
    match = re.search(r"([^.]*?{}[^.]*\.)".format(re.escape(message)), website_content)
    
    if match:
        return match.group(0)  # Return the sentence containing the matched word
    else:
        return None  # No match found

# A simple chatbot logic to find and return feedback
def chatbot_response(message):
    matched_content = search_website(message)  # Search for message in website content

    if matched_content:
        return jsonify({"text": matched_content})
    else:
        return jsonify({"text": "Sorry, I couldn't find any relevant information."})

@app.route("/")
def home():
    return "Chatbot is running!"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    response = chatbot_response(user_message)
    return response

if __name__ == "__main__":
    app.run(debug=True)
