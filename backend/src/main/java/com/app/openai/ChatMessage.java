package com.app.openai;

import java.util.List;

public class ChatMessage {
    private String role;
    private List<Content> content;


    /*
    {
        "role": "user",
        "content": []
    }
    */

    public ChatMessage(String role, List<Content> content) {
        this.role = role;
        this.content = content;
    }   

    public String getRole() {
        return role;
    }

    public List<Content> getContent() {
        return content;
    }
}
