package com.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    // create 1 web client to reuse for every request
    private final WebClient webClient;

    public OpenAIService() {
        // make builder have base for "http://api.openai.com" so future calls do not need to add it
        this.webClient = WebClient.builder().baseUrl("http://api.openai.com").build();
    }

    public String analyzeImage(String base64Img) {
        String res = webClient.post()
                .uri("/v1/chat/completions")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return res;
    }

}
