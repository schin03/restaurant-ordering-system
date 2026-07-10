package com.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.service.ImageService;
import com.app.service.OpenAIService;

@RestController
@RequestMapping("/api")
public class FoodRecognitionController {

    private final ImageService imgService;
    private final OpenAIService openAIService;

    public FoodRecognitionController(ImageService imgService, OpenAIService openAIService) {
        this.imgService = imgService;
        this.openAIService = openAIService;
    }

    @PostMapping("/recognizeFood")
    public ResponseEntity<?> recognizeFood(@RequestParam("image") MultipartFile img) {
        try {
            String base64Img = imgService.convertToBase64(img);

            String res = openAIService.analyzeImage(base64Img);

            return ResponseEntity.ok(res);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
