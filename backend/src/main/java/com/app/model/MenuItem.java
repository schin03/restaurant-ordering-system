package com.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String num;

    @Column(name="name_en")
    private String nameEn;

    @Column(name="name_zh")
    private String nameZh;

    private String category;

    private boolean spicy;


    // GETTERS 
    public Long getId() {
        return id;
    }

    public String getNum() {
        return num;
    }

    public String getNameEn() {
        return nameEn;
    }

    public String getNameZh() {
        return nameZh;
    }

    public String getCategory() {
        return category;
    }

    public boolean isSpicy() {
        return spicy;
    }


    // SETTERS
    public void setNum(String num) {
        this.num = num;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public void setNameZh(String nameZh) {
        this.nameZh = nameZh;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setSpicy(boolean spicy) {
        this.spicy = spicy;
    }

}
    
