package com.app.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class FoodRecognitionController {
    
    @PostMapping("/food-recognition")
    public String recognizeFood(@RequestParam("image") MultipartFile img) throws IOException{
        System.out.println(img.getOriginalFilename());
        return "received image";
    }

}
