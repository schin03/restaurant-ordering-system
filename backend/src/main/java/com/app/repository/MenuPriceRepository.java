package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.model.MenuPrice;

public interface MenuPriceRepository extends JpaRepository<MenuPrice, Long>{
    
}
