package com.app.service;

import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {
    
    public String convertToBase64(MultipartFile img) throws Exception {
        byte[] imgBytes = img.getBytes();
        return Base64.getEncoder().encodeToString(imgBytes);
    }

}
