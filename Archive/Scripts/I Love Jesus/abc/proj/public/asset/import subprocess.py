import subprocess

def lambda_handler(event, context):
    """

    :param event:
    :param context:
    """
    url = event['url']

    xml_output = subprocess.check_output(["./mediainfo", "--full", "--output=XML", url])
    return xml_output