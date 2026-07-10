package com.app.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.service.ImageService;

@RestController
@RequestMapping("/api")
public class FoodRecognitionController {

    private final ImageService imgService;

    public FoodRecognitionController(ImageService imgService) {
        this.imgService = imgService;
    }

    @PostMapping("/recognizeFood")
    public ResponseEntity<?> recognizeFood(@RequestParam("image") MultipartFile img) {
        try {
            String base64Img = imgService.converToBase64(img);
            System.out.println(base64Img);
            return ResponseEntity.ok("img converted");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
