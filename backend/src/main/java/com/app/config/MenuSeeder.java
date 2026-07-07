package com.app.config;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.app.model.MenuItem;
import com.app.model.MenuPrice;
import com.app.repository.MenuItemRepository;
import com.app.repository.MenuPriceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MenuSeeder implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;
    private final MenuPriceRepository menuPriceRepository;

    public MenuSeeder(MenuItemRepository menuItemRepository, MenuPriceRepository menuPriceRepository) {
        this.menuItemRepository = menuItemRepository;
        this.menuPriceRepository = menuPriceRepository;
    }


    @Override
    public void run(String... args) throws Exception {

        // Prevent duplicate inserts every time server starts
        if (menuItemRepository.count() > 0) {
            System.out.println("Menu already seeded.");
            return;
        }


        ObjectMapper mapper = new ObjectMapper();


        InputStream inputStream = getClass()
                .getClassLoader()
                .getResourceAsStream("menu.json");

        if (inputStream == null) {
            throw new RuntimeException("menu.json not found");
        }

        List<Map<String, Object>> categories =
                mapper.readValue(
                        inputStream,
                        new TypeReference<List<Map<String,Object>>>() {}
                );


        for (Map<String,Object> category : categories) {


            String categoryName =
                    (String) category.get("titleEn");


            List<Map<String,Object>> items =
                    (List<Map<String,Object>>) category.get("items");


            for (Map<String,Object> item : items) {


                MenuItem menuItem = new MenuItem();


                menuItem.setCategory(categoryName);

                menuItem.setNum(
                        (String) item.get("num")
                );


                menuItem.setNameEn(
                        (String) item.get("en")
                );


                menuItem.setNameZh(
                        (String) item.get("zh")
                );

                Boolean spicy =
                        (Boolean) item.get("spicy");


                menuItem.setSpicy(
                        spicy != null && spicy
                );


                menuItemRepository.save(menuItem);

                String priceString = (String) item.get("price");

                List<MenuPrice> prices = parsePrices(priceString, menuItem);

                for (MenuPrice price : prices) {
                    menuPriceRepository.save(price);
                }

            }

        }
        System.out.println("Menu seeded successfully!");
    }

    private List<MenuPrice> parsePrices(String priceString, MenuItem menuItem) {
        List<MenuPrice> prices = new ArrayList<>();

        if (priceString == null || priceString.isBlank()) {
            return prices;
        }

        // check if price has sizes
        Pattern sizedPattern = Pattern.compile("\\((.*?)\\)\\s*\\$(\\d+\\.\\d+)");
        Matcher matcher = sizedPattern.matcher(priceString);

        boolean hasSize = false;

        while (matcher.find()) {
            hasSize = true;

            String size = matcher.group(1);

            BigDecimal price = new BigDecimal(matcher.group(2));

            MenuPrice menuPrice = new MenuPrice();

            menuPrice.setMenuItem(menuItem);
            menuPrice.setSize(size);
            menuPrice.setPrice(price);
            
            prices.add(menuPrice);
        }

        // no sizes = NULL size, reg price
        if (!hasSize) {
            Pattern normalPattern = Pattern.compile("\\$(\\d+\\.\\d+)");
            Matcher normalMatcher = normalPattern.matcher(priceString);

            if (normalMatcher.find()) {
                MenuPrice menuPrice = new MenuPrice();

                menuPrice.setMenuItem(menuItem);
                menuPrice.setSize(null);
                menuPrice.setPrice(new BigDecimal(normalMatcher.group(1)));

                prices.add(menuPrice);
            }
        }
        return prices;

    }

}