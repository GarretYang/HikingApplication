from flask import Flask, request
from PIL import Image
import base64
import json
from img_captioner import get_img_caption
import os

app = Flask(__name__)


@app.route('/')
def hello():
    return "Hello World!"


@app.route('/caption', methods=['POST'])
def caption():
    json_content = request.get_json(silent=False)
    img = json.loads(json_content)['photo']
    img = bytes(img, 'utf-8')
    img = base64.b64decode(img)
    with open("caption.jpeg", "wb") as fh:
        fh.write(img)
        fh.close()
    caption = get_img_caption(os.getcwd() + '/caption.jpeg')
    # Remove the file
    # os.remove('./caption.jpeg')
    return caption


if __name__ == '__main__':
    app.run()
