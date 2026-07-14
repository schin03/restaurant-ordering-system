package com.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.service.GeminiService;
import com.app.service.ImageService;
import com.app.service.OpenAIService;

@RestController
@RequestMapping("/api")
public class FoodRecognitionController {

    private final ImageService imgService;
    private final GeminiService geminiService;
    //private final OpenAIService openAIService;

    public FoodRecognitionController(ImageService imgService, GeminiService geminiService) {
        this.imgService = imgService;
        this.geminiService = geminiService;
    }

    @PostMapping("/recognizeFood")
    public ResponseEntity<?> recognizeFood(@RequestParam("image") MultipartFile img) {
        try {
            String base64Img = imgService.convertToBase64(img);
            String res = geminiService.analyzeImage(base64Img);

            return ResponseEntity.ok(res);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
