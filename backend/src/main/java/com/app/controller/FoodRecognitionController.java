package com.app.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.dto.PotentialFood;
import com.app.model.MenuItem;
import com.app.repository.MenuItemRepository;
import com.app.service.GeminiService;
import com.app.service.ImageService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

//add vercel endpoint too
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class FoodRecognitionController {

    private final ImageService imgService;
    private final GeminiService geminiService;
    private final MenuItemRepository menuItemRepository;
    //private final OpenAIService openAIService;

    public FoodRecognitionController(ImageService imgService, GeminiService geminiService, MenuItemRepository menuItemRepository) {
        this.imgService = imgService;
        this.geminiService = geminiService;
        this.menuItemRepository = menuItemRepository;
    }

    @PostMapping("/recognizeFood")
    public List<Long> recognizeFood(@RequestParam("image") MultipartFile img) {
        try {
            String base64Img = imgService.convertToBase64(img);
            String res = geminiService.analyzeImage(base64Img);

            ObjectMapper mapper = new ObjectMapper();
            List<String> guesses = mapper.readValue(res, new TypeReference<List<String>>() {
            });
            System.out.println(guesses);
            Set<String> keywords = extractKeywords(guesses);
            List<MenuItem> candidates = getPotentialFoods(keywords);

            Set<PotentialFood> dto = candidates.stream().map(
                    item -> new PotentialFood(item.getId(), item.getNameEn())
            ).collect(Collectors.toSet());

            Map<PotentialFood, Integer> mappedScores = calcScores(dto, keywords);
            for (Map.Entry<PotentialFood, Integer> entry : mappedScores.entrySet()) {
                PotentialFood food = entry.getKey();
                Integer score = entry.getValue();

                System.out.println(food.getName() + " -> " + score);
            }
            List<PotentialFood> potentialFoods = mappedScores.entrySet()
                    .stream()
                    .sorted(
                            Map.Entry.<PotentialFood, Integer>comparingByValue()
                                    .reversed())
                    .limit(5)
                    .map(Map.Entry::getKey)
                    .toList();

            return geminiService.matchCandidates(base64Img, potentialFoods);

        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/menu-test")
    public List<MenuItem> test() {
        List<MenuItem> res = menuItemRepository.findByNameEnContainingIgnoreCase("chicken");
        System.out.println(res);
        return res;
    }

    private Set<String> extractKeywords(List<String> guesses) {
        Set<String> words = new LinkedHashSet<>();

        for (String guess : guesses) {
            String[] split = guess.toLowerCase().split("\\s+");
            for (String word : split) {
                if (word.length() < 3) {
                    continue;
                }
                words.add(word);
            }
        }
        return words;
    }

    private List<MenuItem> getPotentialFoods(Set<String> keywords) {
        Set<MenuItem> candidates = new LinkedHashSet<>();
        for (String word : keywords) {
            candidates.addAll(
                    menuItemRepository.findByNameEnContainingIgnoreCase(word)
            );
        }

        return new ArrayList<>(candidates);
    }

    private Map<PotentialFood, Integer> calcScores(Set<PotentialFood> potentialFoods, Set<String> keywords) {
        Map<PotentialFood, Integer> scores = new HashMap<>();
        System.out.println(keywords);
        for (PotentialFood pf : potentialFoods) {
            String name = pf.getName().toLowerCase();
            int score = 0;
            for (String keyword : keywords) {
                String normalizedKeyword = normalizedWord(keyword);
                for (String word : name.split("\\s+")) {
                    word = word.replaceAll("[^a-z]", "");
                    if (word.equals(normalizedKeyword)) {
                        score++;
                        break;
                    }
                }
            }
            scores.put(pf, score);
        }
        return scores;
    }

    private String normalizedWord(String word) {
        if (word.endsWith("s")) {
            return word.substring(0, word.length() - 1);
        }
        return word;
    }

}
