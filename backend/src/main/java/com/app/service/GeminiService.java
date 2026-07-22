package com.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.app.dto.PotentialFood;
import com.app.gemini.Content;
import com.app.gemini.GeminiRequest;
import com.app.gemini.InlineData;
import com.app.gemini.Part;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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
                    Return ONLY a JSON array containing exactly 3 strings. 

                    Rules:
                    - Return only the JSON array.
                    - Do not include markdown.
                    - Do not include explanations.
                    - Do not include numbering.
                    - Do not include any other text.
                    - Use common restaurant menu item names.

                    Example output:
                    ["Spring Rolls", "Deep Fried Rolls", "Shrimp Rolls"]
                    """;

        Part imagePart = new Part(null, new InlineData("image/jpeg", img));

        Part textPart = new Part(prompt, null);

        Content content = new Content(List.of(imagePart, textPart));

        GeminiRequest req = new GeminiRequest(List.of(content));

        ObjectMapper objectMapper = new ObjectMapper();

        String res = webClient.post()
                .uri(uriBuilder -> uriBuilder
                .path("/v1beta/models/gemini-3.1-flash-lite:generateContent")
                .queryParam("key", apiKey)
                .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        try {
            JsonNode root = objectMapper.readTree(res);

            String text = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();
            return text;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini response ", e);
        }
    }

    public List<Long> matchCandidates(String img, List<PotentialFood> candidates) {
        // take dto'd list of candidates and convert to string
        ObjectMapper mapper = new ObjectMapper();
        try {
            String menuJson = mapper.writeValueAsString(candidates);
            String prompt = """
                    There are 2 things being uploaded right now, an image which you have already analyzed, 
                    and a list of potential foods that we have on our menu.

                    Here is the potential foods from our menu I want you to compare to the image:
                    %s
                    
                    The uploaded list is a jsonMapped string which contains a food item's id that we store in our system
                    and that food's name in our system. I want you to look at the image and look at the menu items we uploaded
                    and see which of those uploaded menu item names looks the closest to the uploaded image. I want the output 
                    to be the ids of the food in descending order of the most similar to least.

                    For the response, I just want a JSON array of the ranked ids, but just of the top 3. 

                    For example:
                    input = [{"id":2, "name":"Spring Roll"}, {"id":14, "name":"Egg Roll"}]
                    output = [2,14]

                    """.formatted(menuJson);
            Part imagePart = new Part(null, new InlineData("image/jpeg", img));

            Part textPart = new Part(prompt, null);

            Content content = new Content(List.of(imagePart, textPart));

            GeminiRequest req = new GeminiRequest(List.of(content));

            ObjectMapper objectMapper = new ObjectMapper();

            String res = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                    .path("/v1beta/models/gemini-3.1-flash-lite:generateContent")
                    .queryParam("key", apiKey)
                    .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(req)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(res);

            String text = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();
            return mapper.readValue(text, new TypeReference<List<Long>>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini response ", e);
        }
    }

}
