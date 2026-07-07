package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long>{
    
}
