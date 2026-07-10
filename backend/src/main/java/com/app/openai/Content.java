package com.app.openai;


public class Content {


    private String type;
    private String text;
    private ImageUrl image_url;


    public Content(
            String type,
            String text,
            ImageUrl image_url
    ){
        this.type = type;
        this.text = text;
        this.image_url = image_url;
    }


    public String getType(){
        return type;
    }


    public String getText(){
        return text;
    }


    public ImageUrl getImage_url(){
        return image_url;
    }


}