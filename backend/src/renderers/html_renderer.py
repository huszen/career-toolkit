def render_cover_letter_html(metadata: dict, content: dict) -> str:

    html_template = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">

        <style>
            @page {{
                size: A4;
                margin: 1in;
            }}

            body {{
                font-family: "Georgia", serif;
                color: #2D3748;
                line-height: 1.75;
                font-size: 11.5pt;
                max-width: 700px;
                margin: 0 auto;
            }}

            .document {{
                width: 100%;
            }}

            .header {{
                margin-bottom: 48px;
                padding-bottom: 18px;
                border-bottom: 1px solid #E2E8F0;
            }}

            .name {{
                font-size: 22pt;
                font-weight: bold;
                color: #1A202C;
                margin-bottom: 8px;
                letter-spacing: 0.3px;
            }}

            .contact {{
                font-size: 10pt;
                color: #4A5568;
            }}

            .contact a {{
                color: #2B6CB0;
                text-decoration: none;
            }}

            .content {{
                margin-top: 12px;
            }}

            .greeting {{
                margin-bottom: 24px;
            }}

            .paragraph {{
                margin-bottom: 22px;
                text-align: justify;
            }}

            .closing {{
                margin-top: 36px;
                margin-bottom: 12px;
            }}

            .signature {{
                margin-top: 42px;
                font-weight: bold;
                color: #1A202C;
            }}
        </style>
    </head>

    <body>
        <div class="document">

            <div class="header">
                <div class="name">
                    {metadata['name']}
                </div>

                <div class="contact">
                    {metadata['email']} · {metadata['phone']}<br>

                    <a href="{metadata['linkedin']}">
                        LinkedIn Profile
                    </a>
                </div>
            </div>

            <div class="content">

                <div class="greeting">
                    {content['greeting']}
                </div>

                <div class="paragraph">
                    {content['opening_paragraph']}
                </div>

                <div class="paragraph">
                    {content['body_paragraph_1']}
                </div>

                <div class="paragraph">
                    {content['body_paragraph_2']}
                </div>

                <div class="paragraph closing">
                    {content['closing_paragraph']}
                </div>

                <div class="signature">
                    {content['sign_off']}
                </div>

            </div>
        </div>
    </body>
    </html>
    """

    return html_template