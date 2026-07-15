package com.app.controller;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public List<MenuItem> recognizeFood(@RequestParam("image") MultipartFile img) {
        try {
            String base64Img = imgService.convertToBase64(img);
            String res = geminiService.analyzeImage(base64Img);

            ObjectMapper mapper = new ObjectMapper();
            List<String> guesses = mapper.readValue(res, new TypeReference<List<String>>() {});

            Set<MenuItem> matches = new LinkedHashSet<>();

            for (String guess : guesses) {
                
                String[] words = guess.split(" ");
                for (String word : words) {
                    if (word.length() < 3) continue;

                    List<MenuItem> results = menuItemRepository.findByNameEnContainingIgnoreCase(guess);
                    matches.addAll(results);
                    if (matches.size() >= 3) break;
                }
            }

            System.out.println(matches);
            return new ArrayList<>(matches);

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

}
