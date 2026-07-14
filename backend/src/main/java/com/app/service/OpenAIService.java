package com.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.app.openai.ChatMessage;
import com.app.openai.ChatRequest;
import com.app.openai.Content;
import com.app.openai.ImageUrl;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    // create 1 web client to reuse for every request
    private final WebClient webClient;

    public OpenAIService() {
        // make builder have base for "http://api.openai.com" so future calls do not need to add it
        this.webClient = WebClient.builder().baseUrl("https://api.openai.com").build();
    }

    public String analyzeImage(String base64Img) {

        Content textContent = new Content("text", "What food is shown in the image?", null);

        ImageUrl imgUrl = new ImageUrl("data:image/jpeg;base64," + base64Img);

        Content imgContent = new Content("image_url", null, imgUrl);

        ChatMessage msg = new ChatMessage("user", List.of(textContent, imgContent));

        ChatRequest req;
        req = new ChatRequest("gpt-4.1-mini", List.of(msg));

        String res = webClient.post()
                .uri("/v1/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
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
