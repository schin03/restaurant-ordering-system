package com.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.model.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long>{
    List<MenuItem> findByNameEnContainingIgnoreCase(String name);
}
