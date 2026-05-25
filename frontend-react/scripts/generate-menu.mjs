import * as fs from 'node:fs'
import * as path from 'node:path'

const sections = []

function S(id, titleEn, titleZh, items) {
  sections.push({ id, titleEn, titleZh, items })
}

function i(num, en, zh, price, spicy = false, note) {
  const o = { num, en, zh, price }
  if (spicy) o.spicy = true
  if (note) o.note = note
  return o
}

S('appetizers', 'Appetizers', '頭盤', [
  i('1', 'Egg Roll (each)', '旦卷', '$3.50'),
  i('2', 'Spring Roll (two rolls / per order)', '春卷', '$4.50'),
  i('3', 'Deep Fried Wonton', '炸雲吞', '$9.95'),
  i('4', 'Honey Garlic Spareribs', '蒜子蜜骨', '$16.95'),
  i('5', 'Dry Garlic Spareribs', '蒜子干骨', '$16.95'),
  i('6', 'Fried Garlic Squid with Spicy Salt', '椒鹽鮮魷', '(S) $12.75 · (L) $19.75'),
  i('7', 'Fried Garlic Tofu with Spicy Salt', '椒鹽豆腐', '(S) $10.95 · (L) $16.95'),
  i('8', 'Fried Garlic Chicken Wings w/ Spicy Salt', '椒鹽雞翼', '$16.50'),
  i('9', 'Lettuce Wrap with Minced Beef', '牛肉生菜包', '$18.50'),
  i('10', 'Lettuce Wrap with Minced Chicken', '雞肉生菜包', '$18.50'),
  i('11', 'Lettuce Wrap with Minced Vegetable', '什菜生菜包', '$18.50'),
])

S('soup', 'Soup', '湯羹類', [
  i('12', 'Wonton Soup', '雲吞湯', '(M) $9.50 · (L) $16.95'),
  i('13', 'House Special Wor Wonton', '窩雲吞', '$16.95'),
  i('14', 'Hot & Sour Soup', '酸辣湯', '(M) $10.25 · (L) $16.95'),
  i('15', 'Cream Corn with Minced Chicken Soup', '雞茸粟米湯', '(M) $9.95 · (L) $16.50'),
  i('16', 'Mushroom Egg Swirl Soup', '青豆蛋花湯', '(M) $8.75 · (L) $14.95'),
  i('17', 'Diced Vegetables Soup', '雜菜清湯', '(M) $8.75 · (L) $14.95'),
  i('18', 'Bean Cake & Assorted Meat Soup', '雞錦豆腐湯', '(M) $10.95 · (L) $17.95'),
  i('19', 'Seafood Bean Cake Thick Soup', '海鮮豆腐羹', '(M) $11.25 · (L) $18.50'),
  i('20', 'Consomme Soup', '清湯', '$3.75'),
  i('21', 'Wonton Noodle in Soup', '雲吞麵', '$9.50'),
  i('22', 'B.B.Q. Pork Noodle in Soup', '叉燒湯麵', '$9.50'),
  i('23', 'B.B.Q. Pork & Wonton Noodle in Soup', '叉燒雲吞麵', '$9.95'),
  i('24', 'Beef Noodle in Soup', '牛肉湯麵', '$9.50'),
  i('25', 'Chicken Noodle in Soup', '雞肉湯麵', '$9.50'),
  i('26', 'Minced Beef & Egg White Soup', '西湖牛肉羹', '(M) $10.95 · (L) $17.95'),
])

S('western-chow-fried-rice', 'Western chow mein & fried rice', '西人炒飯炒麵', [
  i('27', 'Chicken Chow Mein or Fried Rice', '雞炒麵或炒飯', '$11.95'),
  i('28', 'B.B.Q. Pork Chow Mein', '叉燒炒麵', '$12.25'),
  i('29', 'Beef Chow Mein or Fried Rice', '牛肉炒麵或炒飯', '$12.25'),
  i('30', 'Mushroom Chow Mein or Fried Rice', '蘑菇炒麵或炒飯', '$11.25'),
  i('31', 'Shrimp Chow Mein or Fried Rice', '蝦仁炒麵或炒飯', '$12.50'),
  i('32', 'Chicken Mushroom Chow Mein or Fried Rice', '雞蘑菇炒麵或炒飯', '$12.50'),
  i('33', 'Beef & Tomato Chow Mein or Fried Rice', '番茄牛肉炒麵或炒飯', '$15.95'),
  i('34', 'Curried Beef Fried Rice', '咖哩牛肉炒飯', '$15.50'),
  i('35', 'Curried Chicken Fried Rice', '咖哩雞炒飯', '$15.50'),
])

S('cantonese-chow-mein', 'Cantonese chow mein', '炒粉麵類', [
  i('36', 'House Special Chow Mein', '招牌炒麵', '$16.75'),
  i('37', 'Chicken & Vegetable Chow Mein', '雞球炒麵', '$15.50'),
  i('38', 'Beef & Vegetable Chow Mein', '牛肉炒麵', '$15.50'),
  i('39', 'B.B.Q. Pork & Vegetable Chow Mein', '叉燒炒麵', '$15.50'),
  i('40', 'Prawn & Vegetable Chow Mein', '蝦球炒麵', '$16.95'),
  i('41', 'Seafood & Vegetable Chow Mein', '海鮮炒麵', '$16.95'),
  i('42', 'Beef & Tomato Chow Mein', '番茄牛肉炒麵', '$15.95'),
  i('43', 'Singapore Style Chow Mein', '星州炒米', '$16.50', true),
  i('44', 'Pan Fried Rice Noodle with Beef', '干炒牛河', '$17.50'),
  i('45', 'Japanese Style Chow Mein', '日式炒麵', '$14.95'),
  i('46', 'Ginger Chow Mein', '姜蔥炒麵', '$14.50'),
  i('47', 'Ginger Chicken or B.B.Q. Pork Chow Mein', '姜蔥雞或叉燒炒麵', '$14.95'),
  i('48', 'Beef with Black Bean Sauce Chow Mein', '豉椒牛肉炒麵', '$15.50'),
  i('49', 'Chicken with Black Bean Sauce Chow Mein', '豉椒雞炒麵', '$15.50'),
  i('50', 'Spareribs with Black Bean Sauce Chow Mein', '豉椒排骨炒麵', '$15.50'),
  i('51', 'Shredded Chicken Chow Mein', '雞絲炒麵', '$15.50'),
  i('51a', 'Satay Beef Chow Mein or Rice Noodle', '沙爹牛肉麵或河', '$16.50'),
  i('52', 'Soy Sauce Chicken Chow Mein', '豉油皇雞絲炒麵', '$15.50'),
  i('53', 'Mixed Vegetable Chow Mein', '雜菜炒麵', '$14.95'),
  i('54', 'Mixed Vegetable Chicken or Beef Chow Mein', '雜菜雞或牛肉炒麵', '$15.75'),
])

S('fried-rice', 'Fried rice', '炒飯類', [
  i('55', 'House Special Fried Rice', '招牌炒飯', '$15.95'),
  i('56', 'Shredded Chicken Fried Rice', '生炒雞絲飯', '$14.75'),
  i('57', 'Minced Beef Fried Rice', '生炒牛肉飯', '$14.75'),
  i('58', 'Shrimp Fried Rice', '蝦仁炒飯', '$15.75'),
  i('59', 'Young Chow Fried Rice', '揚州炒飯', '$15.75'),
  i('60', 'B.B.Q. Pork Fried Rice', '叉燒炒飯', '$14.75'),
  i('61', 'Mixed Vegetable Fried Rice', '雜菜炒飯', '$14.75'),
  i('62', 'Mushroom Fried Rice', '蘑菇炒飯', '$14.75'),
  i('63', 'Minced Beef & Tomato Fried Rice', '碎牛肉番茄炒飯', '$15.75'),
  i('64', 'Honeymoon Fried Rice', '鴛鴦炒飯', '$19.75'),
  i('65', 'Fook Chow Seafood Fried Rice', '福州炒飯', '$17.50'),
  i('66', 'Diced Chicken & Salted Fish Fried Rice', '咸魚雞粒炒飯', '$16.50'),
  i('67', 'Egg Plain Fried Rice', '旦炒飯', '$12.50'),
])

S('rice-plates', 'Dishes on rice', '飯類', [
  i('68', 'House Special on Rice', '招牌飯', '$15.75'),
  i('69', 'Beef with Scrambled Egg on Rice', '滑旦牛肉飯', '$15.75'),
  i('70', 'B.B.Q. Pork on Rice', '叉燒飯', '$14.50'),
  i('71', 'Beef with Black Bean Sauce on Rice', '豉椒牛飯', '$14.50'),
  i('72', 'Chicken w/ Black Bean Sauce on Rice', '豉椒雞飯', '$14.50'),
  i('73', 'Bean Cake & B.B.Q. Pork on Rice', '叉燒豆腐飯', '$14.50'),
  i('74', 'Seafood & Vegetable on Rice', '時菜海鮮飯', '$15.75'),
  i('75', 'Prawns & Vegetable on Rice', '時菜蝦球飯', '$15.95'),
  i('76', 'Fish & Bean Cake on Rice', '斑腩豆腐飯', '$15.50'),
  i('77', 'Fish & Vegetable on Rice', '時菜斑球飯', '$15.50'),
  i('78', 'Beef & Vegetable on Rice', '時菜牛肉飯', '$14.50'),
  i('79', 'Chicken & Vegetable on Rice', '時菜雞飯', '$14.50'),
  i('80', 'Minced Beef on Rice', '免治牛肉飯', '$14.50'),
  i('81', 'Curried Chicken on Rice', '咖哩雞飯', '$14.50'),
  i('82', 'Curried Beef on Rice', '咖哩牛肉飯', '$14.50'),
  i('83', 'Curried Prawns on Rice', '咖哩蝦飯', '$15.95'),
  i('84', 'Curried Mixed Vegetable on Rice', '咖哩什菜飯', '$14.25'),
  i('85', 'Cantonese Sweet & Sour Pork on Rice', '咕嚕肉飯', '$14.95'),
  i('86', 'Beef & Tomato on Rice', '鮮茄牛肉飯', '$14.95'),
  i('87', 'Minced Beef & Bean Cake on Rice', '麻婆豆腐飯', '$14.95'),
  i('88', 'Spareribs w/ Black Bean Sauce on Rice', '豉椒排骨飯', '$14.95'),
  i('89', 'Beef w/ Green Beans in Black Bean Sauce on Rice', '豉汁豆仔牛肉飯', '$14.95'),
])

S('chicken', 'Chicken', '雞類', [
  i('90', 'Mandarin Orange Chicken', '杏橙雞', '$20.25'),
  i('91', 'Lemon Boneless Chicken', '檸檬雞', '$18.50'),
  i('92', 'Breaded Almond Chicken', '杏仁酥雞', '$18.50'),
  i('93', 'Pineapple Sweet & Sour Chicken Balls', '甜酸雞球', '$18.50'),
  i('94', 'Cantonese Sweet & Sour Chicken', '廣東甜酸雞', '$20.25'),
  i('95', 'Cantonese Honey Garlic Chicken', '廣東蜜汁雞', '$20.25'),
  i('96', 'Deep Fried Chicken Wings', '炸雞翼', '$16.25'),
  i('97', 'Honey Garlic Chicken Wings', '蜜汁雞翼', '$16.95'),
  i('98', 'Boneless Chicken w/ Black Bean Sauce', '豉椒雞球', '$16.75'),
  i('99', 'Szechuan Style Chicken (Spicy)', '四川雞球', '$19.95', true),
  i('100', 'Chicken with 3 kinds of Mushrooms', '三菇雞球', '$20.25'),
  i('101', 'Diced Chicken w/ Cashew or Almond Nuts', '腰果/杏仁雞丁', '$16.75'),
  i('102', 'Curried Boneless Chicken (Spicy)', '咖哩雞球', '$16.95', true),
  i('103', 'Chicken with Broccoli', '百家利雞球', '$16.50'),
  i('104', 'Chicken with Gai Lan', '芥蘭雞球', '$17.95'),
  i('105', 'Chicken with Bok Choy', '時菜雞球', '$16.95'),
  i('106', 'Tomato with Chicken', '鮮茄雞球', '$16.95'),
  i('107', 'Green Beans with Chicken in Black Bean Sauce', '豉汁豆仔雞球', '$16.25'),
  i('108', 'Deep Fried Crispy Chicken w/ Hot Sauce', '川油淋雞', '$18.75'),
  i('109', 'Deep Fried Crispy Chicken w/ Shrimp Chips', '炸子雞', '(Half) $18.50 · (Whole) $32.95'),
])

S('beef', 'Beef', '牛肉類', [
  i('111', 'Satay with Tender Beef', '沙爹牛柳球', '$19.95'),
  i('111a', 'Satay with Sliced Beef', '沙爹牛肉', '$16.95'),
  i('112', 'Beef & Ginger with Green Onions', '姜蔥牛肉', '$19.95'),
  i('113', 'Beef with Black Bean Sauce', '豉椒牛肉', '$16.95'),
  i('114', 'Curried Beef', '咖哩牛肉', '$16.95'),
  i('115', 'Beef with 3 kinds of Mushrooms', '三菇牛肉', '$20.25'),
  i('116', 'Beef with Oyster Sauce', '蠔油牛肉', '$20.25'),
  i('117', 'Szechuan Beef (Spicy)', '四川牛肉', '$19.95', true),
  i('118', 'Chinese Style Tender Beef', '中式牛柳', '$19.95'),
  i('119', 'Tender Beef with Black Pepper Sauce', '黑椒牛柳', '$19.95'),
  i('120', 'Tender Beef with Mushroom Baby Corn', '生炒牛柳球', '$19.95'),
  i('121', 'Beef with Bok Choy', '時菜牛肉', '$16.95'),
  i('122', 'Beef with Gai Lan', '芥蘭牛肉', '$17.95'),
  i('123', 'Green Beans w/ Beef in Black Bean Sauce', '豉汁豆仔牛肉', '$16.25'),
  i('124', 'Beef with Broccoli', '百家利牛肉', '$16.50'),
  i('125', 'Soft Tofu with Beef', '牛肉滑旦付', '$16.50'),
  i('126', 'Ground Beef with Tofu', '麻婆豆付', '$16.50'),
  i('127', 'Tomato with Beef', '番茄牛肉', '$16.75'),
  i('128', 'Honey Ginger Beef (Spicy)', '薑焗牛肉', '$19.95', true),
])

S('seafood', 'Seafood', '海鮮類', [
  i('129', 'Deep Fried Prawns with Sweet & Sour Sauce', '酥炸大蝦', '$19.50'),
  i('130', 'Sauteed Prawns', '油泡蝦球', '$20.95'),
  i('131', 'Pan Fried Prawns with Broccoli', '百家利蝦球', '$19.50'),
  i('132', 'Prawns with Black Bean Sauce', '豉椒蝦球', '$19.50'),
  i('133', 'Curried Prawns (Spicy)', '咖哩蝦球', '$19.50', true),
  i('134', 'Pan Fried Prawns with Bok Choy', '時菜蝦球', '$19.50'),
  i('135', 'Prawns with 3 kinds of Mushrooms', '三菇蝦球', '$20.95'),
  i('136', 'Fried Prawns with Spicy Salt (shell off)', '椒鹽蝦球', '$21.75'),
  i('137', 'Szechuan Style Prawns (Spicy)', '四川蝦球', '$21.75', true),
  i('138', 'Sauteed Three kinds of Seafood', '油泡三鮮', '$19.95'),
  i('139', 'Scallops with Broccoli or Bok Choy', '時菜帶子', '$19.95'),
  i('140', 'Three kinds of Seafood with Broccoli or Bok Choy', '時菜三鮮', '$18.95'),
  i('141', 'Fried Garlic Fish Fillets w/ Spicy Salt', '椒鹽魚球', '$19.95'),
  i('142', 'Fried Fish Fillets w/ Cream Corn Sauce', '粟米現塊', '$19.95'),
  i('142a', 'Sweet & Sour Fish Fillets', '甜酸現塊', '$19.95'),
  i('143', 'Pan Fried Fish Fillets with Broccoli or Bok Choy', '時菜現塊', '$18.95'),
  i('144', 'Sauteed Fish Fillets', '油泡現球', '$19.95'),
  i('145', 'Pan Fried Prawns with Cashew Nuts', '腰果蝦球', '$18.95'),
  i('146', 'Pan Fried Prawns with Spicy Sauce', '醬爆蝦球', '$18.95', true),
  i('147', 'Pan Fried Prawns with Scrambled Egg', '滑旦蝦球', '$19.50'),
])

S('hot-pot', 'Hot pot', '煲仔類', [
  i('148', 'Beef & Ginger Hot Pot', '姜蔥牛肉煲', '$19.95'),
  i('149', 'Chicken & Ginger Hot Pot (Boneless)', '姜蔥雞球煲', '$19.95'),
  i('150', 'Singing Chicken with Chinese Sausage (Boneless)', '啫啫雞煲', '$19.95'),
  i('151', 'Fried Tofu with Mixed Meat', '八珍豆腐煲', '$18.50'),
  i('152', 'Fried Tofu with Seafood', '海鮮豆腐煲', '$19.95'),
  i('153', 'Fried Tofu with Fish Fillets', '班腩豆腐煲', '$18.95'),
  i('154', 'Salted Fish with Chicken & Soft Tofu', '咸魚雞粒豆腐煲', '$18.95'),
  i('155', 'Eggplant with Shredded Pork (Spicy)', '魚香茄子煲', '$18.50', true),
  i('156', 'Eggplant with Prawns (Spicy)', '蝦球茄子煲', '$19.50', true),
])

S('pork', 'Pork', '豬肉類', [
  i('157', 'Sweet & Sour Pork', '甜酸肉', '$15.75'),
  i('158', 'Cantonese Sweet & Sour Pork', '咕嚕肉', '$17.50'),
  i('159', 'Fried Pork Chop with Orange Sauce', '香橙豬扒', '$19.95'),
  i('160', 'Fried Pork Chop with Gourmet Sauce', '京都豬扒', '$19.95'),
  i('161', 'Fried Pork Chop with Spicy Salt', '椒鹽豬扒', '$19.95', true),
  i('162', 'Fried Pork Chop with Honey Garlic Sauce', '蜜汁豬扒', '$19.95', true),
  i('163', 'Fried Ribs with Spicy Salt', '椒鹽骨', '$16.95', true),
  i('164', 'Honey Garlic Pork or Ribs', '蜜汁肉/骨', '$16.95'),
  i('165', 'Dry Garlic Pork or Ribs', '蒜子干肉/骨', '$16.95'),
  i('166', 'Pan Fried Spareribs with Black Bean Sauce', '豉椒炆排骨', '$16.95'),
  i('167', 'Steamed Spareribs with Black Bean Sauce', '豉汁蒸排骨', '$19.95'),
  i('168', 'Steamed Minced Pork with Chinese Sausage', '臘腸蒸肉餅', '$19.95'),
  i('169', 'Steamed Minced Pork with Salted Fish', '咸魚蒸肉餅', '$19.95'),
  i('170', 'B.B.Q. Pork with Broccoli or Bok Choy', '百家利/白菜叉燒', '$16.50'),
  i('171', 'B.B.Q. Pork', '蜜汁叉燒', '$15.50'),
  i('171a', 'Sliced Pork w/ Garlic, Pepper & Cabbage', '回鍋肉', '$16.95'),
])

S('egg-foo-young', 'Egg foo young', '芙蓉類', [
  i('172', 'House Special Foo Young', '招牌芙蓉', '$16.50'),
  i('173', 'Chicken Foo Young', '雞芙蓉', '$15.50'),
  i('174', 'B.B.Q. Pork Foo Young', '叉燒芙蓉', '$15.50'),
  i('175', 'Mushroom Foo Young', '蘑菇芙蓉', '$15.50'),
  i('176', 'Shrimp Foo Young', '蝦仁芙蓉', '$16.50'),
  i('177', 'Chicken & Mushroom Foo Young', '雞蘑菇芙蓉', '$16.50'),
])

S('chop-suey', 'Chop suey', '什錦類', [
  i('178', 'House Special Chop Suey', '招牌什碎', '$17.95'),
  i('179', 'Beef Chop Suey', '牛肉什碎', '$16.50'),
  i('180', 'Chicken Chop Suey', '雞球什碎', '$16.50'),
  i('181', 'B.B.Q. Pork Chop Suey', '叉燒什碎', '$16.50'),
  i('182', 'Prawn Chop Suey', '蝦球什碎', '$17.50'),
  i('183', 'Seafood Chop Suey', '海鮮什碎', '$17.50'),
  i('184', 'Baby Corn with Beef', '粟米仔牛肉', '$17.95'),
  i('185', 'Baby Corn with Chicken', '粟米仔雞球', '$17.95'),
  i('186', 'Baby Corn with Seafood', '粟米仔海鮮', '$18.25'),
  i('188', 'Curried Potatoes with Beef or Chicken', '咖哩薯仔牛肉/雞', '$16.95', true),
  i('189', 'Curried Potatoes with Seafood', '咖哩薯仔海鮮', '$17.25', true),
  i('190', 'Bean Sprouts with Beef or Chicken', '芽菜牛肉/雞球', '$14.95'),
  i('191', 'Green Beans with Beef or Chicken in Black Bean Sauce', '豉汁四季豆牛肉/雞', '$16.25'),
  i('192', 'Green Beans with Minced Pork in Spicy Sauce', '干煸四季豆', '$15.95', true),
])

S('vegetarian', 'Vegetarian special', '蔬菜類', [
  i('193', 'Pan Fried Broccoli or Bok Choy', '清炒時菜', '$15.95'),
  i('194', '3 kinds of Mushrooms in Oyster Sauce', '蠔油曹三菇', '$18.50'),
  i('195', 'Pan Fried or Garlic Gai Lan', '清炒/蒜蓉芥蘭', '$16.95'),
  i('196', 'Pan Fried Mixed Vegetables', '清炒什菜', '$15.50'),
  i('197', 'Chinese Mushroom with Bok Choy', '時菜扒北菇', '$18.25'),
  i('198', 'Mixed Vegetables or Broccoli in Black Bean Sauce', '豉汁什菜或西蘭花', '$16.50'),
  i('199', 'Fried Tofu with Oyster Sauce', '紅燒豆付', '$16.95'),
  i('200', 'Soft Tofu with Mixed Vegetables', '什菜滑豆付', '$15.75'),
  i('201', 'Lettuce with Oyster Sauce', '蠔油生菜', '$10.95'),
  i('202', 'Deluxe Vegetables with Oyster Sauce', '蠔油四寶蔬', '$17.25'),
])

S('sides-drinks', 'Sides & beverages', '小食及飲品', [
  i('203', 'Shrimp Chips', '蝦片', '$3.75'),
  i('204', 'Sweet & Sour Sauce', '甜酸汁', '(S) $3.25 · (L) $4.25'),
  i('205', 'Black Bean Sauce', '豉汁', '(S) $3.25 · (L) $4.25'),
  i('206', 'Curry Sauce', '咖哩汁', '(S) $3.25 · (L) $4.25'),
  i('207', 'Steam Rice', '白飯', '(S) $3.25 · (M) $3.95 · (L) $4.75'),
  i('208', 'Canned Pop', '罐裝汽水', '$1.95'),
])

/** Hand-authored structure — edit `src/data/menuItems.js` or keep this in sync when regenerating. */
const dinnerCombosItems = [
  {
    type: 'dinner_combo',
    headlineEn: 'Dinner for one',
    headlineZh: '一人晚餐',
    price: '$15.75',
    hintEn: 'Choose one of four combinations.',
    layout: 'four_options',
    options: [
      { label: '# 1', dishes: ['Western Chicken Chow Mein', 'S & S Pork', 'Pork Fried Rice'] },
      { label: '# 2', dishes: ['Deep Fried Prawns', 'Western Chicken Chow Mein', 'S & S Pork'] },
      { label: '# 3', dishes: ['Beef Chop Suey', 'Western Chicken Chow Mein', 'Pork Foo Young'] },
      { label: '# 4', dishes: ['Pork Fried Rice', 'Deep Fried Prawns', 'Western Chicken Chow Mein'] },
    ],
  },
  {
    type: 'dinner_combo',
    headlineEn: 'Dinner for two',
    headlineZh: '二人晚餐',
    price: '$44.95',
    hintEn: 'Choose Style A or Style B.',
    layout: 'style_ab',
    options: [
      {
        label: 'Style A',
        dishes: [
          'Spring Roll (2 rolls)',
          'Lemon Chicken',
          'Prawn Mixed Vegetables',
          'B.B.Q. Pork Fried Rice',
        ],
      },
      {
        label: 'Style B',
        dishes: [
          'Spring Roll (2 rolls)',
          'Beef w/ Broccoli',
          'Cantonese S&S Pork',
          'Soy Sauce Chicken Chow Mein',
        ],
      },
    ],
  },
  {
    type: 'dinner_combo',
    headlineEn: 'Dinner for three',
    headlineZh: '三人晚餐',
    price: '$63.95',
    hintEn: 'Choose Style A or Style B.',
    layout: 'style_ab',
    options: [
      {
        label: 'Style A',
        dishes: [
          'Spring Roll (3 rolls)',
          'Beef Mixed Vegetables',
          'Cantonese S&S Pork',
          'Dry Garlic Ribs',
          'B.B.Q. Pork Fried Rice',
        ],
      },
      {
        label: 'Style B',
        dishes: [
          'Spring Roll (3 rolls)',
          'Beef w/ Broccoli',
          'S&S Chicken Balls',
          'Honey Garlic Ribs',
          'Soy Sauce Chicken Chow Mein',
        ],
      },
    ],
  },
  {
    type: 'dinner_combo',
    headlineEn: 'Dinner for four',
    headlineZh: '四人晚餐',
    price: '$82.95',
    hintEn: 'Fixed set — includes:',
    layout: 'fixed',
    dishes: [
      'Spring Roll (4 rolls)',
      'Cantonese S&S Pork',
      'House Special Mixed Vegetables',
      'Breaded Almond Chicken',
      'Young Chow Fried Rice',
      'Soy Sauce Chicken Chow Mein',
    ],
  },
  {
    type: 'dinner_combo',
    headlineEn: 'Dinner for six',
    headlineZh: '六人晚餐',
    price: '$112.95',
    hintEn: 'Fixed set — includes:',
    layout: 'fixed',
    dishes: [
      'Spring Roll (6 rolls)',
      'Deep Fried Prawns',
      'Beef w/ Broccoli',
      '1/2 Crispy Fried Chicken',
      'Cantonese S&S Pork',
      'House Special Fried Rice',
      'Soy Sauce Chicken Chow Mein',
    ],
  },
  {
    type: 'dinner_combo',
    headlineEn: 'Dinner for eight',
    headlineZh: '八人晚餐',
    price: '$149.95',
    hintEn: 'Fixed set — includes:',
    layout: 'fixed',
    dishes: [
      'Spring Roll (8 rolls)',
      'Deep Fried Prawns',
      'Beef w/ Broccoli',
      'Crispy Fried Chicken',
      'Cantonese S&S Pork',
      'Honey Garlic Ribs',
      'Young Chow Fried Rice',
      'Soy Sauce Chicken Chow Mein',
    ],
  },
]

S('dinner-combos', 'Dinner Combinations', '套餐', dinnerCombosItems)

const SECTION_NOTES = {
  'cantonese-chow-mein':
    'Above items with black bean sauce: add $1.00.',
  'rice-plates': 'Change to fried rice: add $1.00',
}

const header = `/**
 * Bamboo Menu (Feb 2025) — structured from printable menu.
 * Numbers match the printed menu where applicable.
 * Each section: titleEn, titleZh. Each item: en, zh (English first).
 */
`

const body = `export const MENU_SECTION_NOTES = ${JSON.stringify(SECTION_NOTES, null, 2)}

export const MENU_SECTIONS = ${JSON.stringify(sections, null, 2)}
`

fs.writeFileSync(path.join(process.cwd(), 'src/data/menuItems.js'), header + body, 'utf8')
console.log('Wrote', sections.length, 'sections,', sections.reduce((n, s) => n + s.items.length, 0), 'items')
