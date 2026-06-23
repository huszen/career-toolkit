import json

def check_and_parse(response):
    raw_json_output = response.text.strip()

    # remove accidental markdown wrappers
    if raw_json_output.startswith("```json"):
            raw_json_output = raw_json_output.replace("```json", "", 1)

    if raw_json_output.endswith("```"):
        raw_json_output = raw_json_output[:-3]

    raw_json_output = raw_json_output.strip()

    return raw_json_output