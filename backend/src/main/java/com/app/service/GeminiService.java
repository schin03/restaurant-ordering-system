package com.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.app.gemini.Content;
import com.app.gemini.GeminiRequest;
import com.app.gemini.InlineData;
import com.app.gemini.Part;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public GeminiService() {
        // have builder's base so future calls don't need to add it
        this.webClient = WebClient.builder().baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public String analyzeImage(String img) {
        String prompt
                = """
                    You are helping a restaurant ordering application.
                    Analyze the uploaded food image. 
                    Return ONLY a JSON array containing exactly 5 strings. 

                    Rules:
                    - Return only the JSON array.
                    - Do not include markdown.
                    - Do not include explanations.
                    - Do not include numbering.
                    - Do not include any other text.
                    - Use common restaurant menu item names.

                    Example output:
                    ["Vegetable Spring Rolls", "Pork Egg Rolls", "Shrimp Rolls", "Lumpia", "Chicken Spring Rolls"]
                    """;

        Part imagePart = new Part(null, new InlineData("image/jpeg", img));

        Part textPart = new Part(prompt, null);

        Content content = new Content(List.of(imagePart, textPart));

        GeminiRequest req = new GeminiRequest(List.of(content));

        String res = webClient.post()
                .uri(uriBuilder -> uriBuilder
                .path("/v1beta/models/gemini-3.1-flash-lite:generateContent")
                .queryParam("key", apiKey)
                .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException(body)))
                .bodyToMono(String.class)
                .block();

        return res;
    }

}
