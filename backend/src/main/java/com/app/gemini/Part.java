package com.app.gemini;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Part (
    String text,
    InlineData inlineData
){}
