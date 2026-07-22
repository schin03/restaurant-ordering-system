package com.app.openai;
import java.util.List;

public class ChatRequest {
    private String model;
    private List<ChatMessage> messages;
    

    /*
    {
        "model": "...",
        "messages": [...]
    }
    */

    public ChatRequest(String model, List<ChatMessage> msgs) {
        this.model = model;
        messages = msgs;
    }

    public String getModel() {
        return model;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

}   
