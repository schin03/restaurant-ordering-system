package com.app.gemini;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InlineData (

    @JsonProperty("mime_type")
    String mimeType,
    String data
){}
