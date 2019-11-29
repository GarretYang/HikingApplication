import subprocess
import os

# File system path for the shell script of running model
# TODO: Change this path to your own config
IM2TXT_SCRIPT = '/home/apt_team2/models/research/im2txt/caption.sh'
IM2TXT_DIR = '/home/apt_team2/models/research/im2txt/'

def get_sanitized_caption(output):
    if not output:
        return None
    tokens = output.split('\n')[1].strip().split()
    tokens = tokens[1:-1]
    if tokens[-1] == '.':
        tokens.pop()
    tokens[0] = tokens[0].capitalize()
    caption = ' '.join(tokens)
    return caption

def get_im2txt_output(file_name):
    # Call the subprocess of shell script
    output = None
    try:
        os.chdir(IM2TXT_DIR)
        output = subprocess.check_output(
            ['sh', IM2TXT_SCRIPT, file_name]
        ).decode()
    except (subprocess.CalledProcessError, OSError) as e:
        print(e)
    return output

def get_img_caption(file_name):
    # file_name: file system path of the image to be captioned
    output = get_im2txt_output(file_name)
    print('Output of prediction: ')
    print(output)
    print('After sanitizing the output: ')
    output = get_sanitized_caption(output)
    print(output)
    return output

get_img_caption('/home/apt_team2/models/research/im2txt/image.jpeg')
