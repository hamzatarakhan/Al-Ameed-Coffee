-- Generated from lib/mock-data.ts — catalog seed data.
-- image_url columns are left NULL; fill them in once photos are uploaded
-- to Supabase Storage.

insert into branches (id, lat, lng, name_ar, name_en, address_ar, address_en, hours_weekdays_ar, hours_weekdays_en, hours_weekend_ar, hours_weekend_en, phone, open_now) values
  ('shmaisani', 31.9701, 35.904, 'الشميساني', 'Shmeisani', 'الشميساني، عمّان', 'Shmeisani, Amman', 'يوميًا 7:00 ص – 11:30 م', 'Daily 7:00 AM – 11:30 PM', 'الجمعة 7:00 ص – 12:00 ص', 'Fri 7:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('alameed-experience', 31.965, 35.905, 'تجربة العميد', 'Al Ameed Experience', 'عمّان', 'Amman', 'يوميًا 8:00 ص – 1:00 ص', 'Daily 8:00 AM – 1:00 AM', 'يوميًا 8:00 ص – 1:00 ص', 'Daily 8:00 AM – 1:00 AM', '+962 6 579 9575', true),
  ('hujra-village', 31.88, 35.95, 'قرية الحجرة', 'Al Hajra Village', 'الحجرة، عمّان', 'Al Hajra, Amman', 'يوميًا 7:00 ص – 12:00 ص', 'Daily 7:00 AM – 12:00 AM', 'يوميًا 7:00 ص – 12:00 ص', 'Daily 7:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('khilda', 31.9744, 35.8494, 'خلدا', 'Khilda', 'خلدا، عمّان', 'Khilda, Amman', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'الجمعة 9:00 ص – 11:00 م', 'Fri 9:00 AM – 11:00 PM', '+962 6 581 4300', true),
  ('city-mall', 31.9585, 35.8654, 'سيتي مول', 'City Mall', 'سيتي مول، عمّان', 'City Mall, Amman', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('zarqa', 32.0728, 36.0876, 'الزرقاء', 'Al Zarqa', 'الزرقاء', 'Zarqa', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'الخميس–الجمعة درايف ثرو 8:00 ص – 12:00 ص', 'Thu–Fri drive-thru 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('irbid', 32.5556, 35.85, 'إربد', 'Irbid', 'إربد', 'Irbid', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'الخميس–الجمعة 8:00 ص – 12:00 ص', 'Thu–Fri 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('aqaba', 29.5321, 35.0063, 'العقبة', 'Aqaba', 'العقبة', 'Aqaba', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'الخميس–الجمعة 8:00 ص – 1:00 ص', 'Thu–Fri 8:00 AM – 1:00 AM', '+962 6 581 4300', true),
  ('madaba', 31.7197, 35.7942, 'مادبا', 'Madaba', 'مادبا', 'Madaba', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', '+962 6 581 4300', true),
  ('airport', 31.7226, 35.9932, 'مطار الملكة علياء الدولي', 'Queen Alia International Airport', 'الزيزياء', 'Zizya', 'مفتوح ٢٤ ساعة', 'Open 24 hours', 'مفتوح ٢٤ ساعة', 'Open 24 hours', '+962 6 581 4300', true),
  ('gardens', 31.9622, 35.8778, 'الجاردنز', 'Gardens', 'الجاردنز، عمّان', 'Gardens St, Amman', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'الجمعة 9:00 ص – 11:00 م', 'Fri 9:00 AM – 11:00 PM', '+962 6 581 4300', true),
  ('swefieh', 31.9509, 35.859, 'الصويفية', 'Swefieh', 'الصويفية، عمّان', 'Swefieh, Amman', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', '+962 6 581 4300', true),
  ('ithaa', 31.9791, 35.8848, 'شارع الإذاعة', 'Ithaa'' St.', 'شارع الإذاعة، عمّان', 'Ithaa'' St, Amman', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'الجمعة 9:00 ص – 11:00 م', 'Fri 9:00 AM – 11:00 PM', '+962 6 581 4300', true),
  ('marka', 31.9885, 35.9895, 'ماركا', 'Marka', 'ماركا، عمّان', 'Marka, Amman', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'الخميس–الجمعة درايف ثرو 8:00 ص – 12:00 ص', 'Thu–Fri drive-thru 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('jubeiha', 32.0177, 35.873, 'الجبيهة', 'Jubeiha', 'الجبيهة، عمّان', 'Jubeiha, Amman', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', 'يوميًا 8:00 ص – 11:00 م', 'Daily 8:00 AM – 11:00 PM', '+962 6 581 4300', true),
  ('sameh-airport-road', 31.9068, 35.9622, 'سامح مول - طريق المطار', 'Sameh Mall Airport Road', 'طريق المطار، عمّان', 'Airport Road, Amman', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('sameh-tabarbour', 32.0089, 35.9436, 'سامح مول - طبربور', 'Sameh Mall Tabarbour', 'طبربور، عمّان', 'Tabarbour, Amman', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('ctown-abdali', 31.9633, 35.9028, 'سي تاون - العبدلي مول', 'C Town Abdali Mall', 'العبدلي مول، عمّان', 'Abdali Mall, Amman', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('souk-bab-madina-zarqa', 32.077, 36.088, 'سوق باب المدينة - الزرقاء', 'Souk Bab Al Madina, Zarqa', 'سوق باب المدينة، الزرقاء', 'Souk Bab Al Madina, Zarqa', 'يوميًا 9:00 ص – 11:00 م', 'Daily 9:00 AM – 11:00 PM', 'يوميًا 9:00 ص – 11:00 م', 'Daily 9:00 AM – 11:00 PM', '+962 6 581 4300', true),
  ('madina-munawara', 31.9836, 35.8747, 'شارع المدينة المنورة', 'Al Madina Al Munawara St.', 'شارع المدينة المنورة، عمّان', 'Al Madina Al Munawara St, Amman', 'يوميًا 7:00 ص – 12:00 ص', 'Daily 7:00 AM – 12:00 AM', 'الخميس–الجمعة 7:00 ص – 1:00 ص', 'Thu–Fri 7:00 AM – 1:00 AM', '+962 6 581 4300', true),
  ('cozmo-7th-circle', 31.9502, 35.8721, 'كوزمو - الدوار السابع', 'Cozmo, 7th Circle', 'الدوار السابع، عمّان', '7th Circle, Amman', 'يوميًا 7:45 ص – 12:00 ص', 'Daily 7:45 AM – 12:00 AM', 'يوميًا 7:45 ص – 12:00 ص', 'Daily 7:45 AM – 12:00 AM', '+962 6 581 4300', true),
  ('ctown-jabal-hussein', 31.9614, 35.9188, 'سي تاون - جبل الحسين', 'C Town Jabal Al Hussein', 'جبل الحسين، عمّان', 'Jabal Al Hussein, Amman', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('middle-east-university', 31.9908, 36.0243, 'جامعة الشرق الأوسط', 'Middle East University', 'جامعة الشرق الأوسط، عمّان', 'Middle East University, Amman', 'الأحد–الخميس 7:30 ص – 3:30 م', 'Sun–Thu 7:30 AM – 3:30 PM', 'مغلق الجمعة والسبت', 'Closed Fri–Sat', '+962 6 581 4300', false),
  ('weibdeh', 31.9553, 35.928, 'اللويبدة', 'Weibdeh', 'اللويبدة، عمّان', 'Weibdeh, Amman', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('sameh-jabal-shamali', 32.5606, 35.8467, 'سامح مول - الجبل الشمالي', 'Sameh Mall, Al Jabal Al Shamali', 'الجبل الشمالي، إربد', 'Al Jabal Al Shamali, Irbid', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('sameh-shafa-badran', 32.0217, 35.9095, 'سامح مول - شفا بدران', 'Sameh Mall, Shafa Badran', 'شفا بدران، عمّان', 'Shafa Badran, Amman', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', true),
  ('irbid-community-garden', 32.557, 35.852, 'حديقة إربد المجتمعية', 'Irbid Community Garden', 'إربد', 'Irbid', 'يوميًا 9:00 ص – 10:00 م', 'Daily 9:00 AM – 10:00 PM', 'يوميًا 9:00 ص – 10:00 م', 'Daily 9:00 AM – 10:00 PM', '+962 6 581 4300', true),
  ('seventy-three', 31.9515, 35.9239, '٧٣ باي بن العميد', 'Seventy Three by Al Ameed', 'عمّان', 'Amman', 'يوميًا 8:30 ص – 11:00 م', 'Daily 8:30 AM – 11:00 PM', 'يوميًا 8:30 ص – 11:00 م', 'Daily 8:30 AM – 11:00 PM', '+962 77 738 9941', true),
  ('mecca-mall', 31.9629, 35.8564, 'مكة مول', 'Mecca Mall', 'مكة مول، عمّان', 'Mecca Mall, Amman', 'السبت–الخميس 10:00 ص – 12:00 ص', 'Sat–Thu 10:00 AM – 12:00 AM', 'الجمعة 2:00 م – 12:00 ص', 'Fri 2:00 PM – 12:00 AM', '+962 6 581 4300', true),
  ('madina-munawara-2', 31.982, 35.876, 'شارع المدينة المنورة ٢', 'Al Madina Al Munawara St. 2', 'شارع المدينة المنورة، عمّان', 'Al Madina Al Munawara St, Amman', 'يوميًا 7:00 ص – 12:00 م', 'Daily 7:00 AM – Noon', 'الجمعة 7:00 ص – 1:00 ص', 'Fri 7:00 AM – 1:00 AM', '+962 6 581 4300', true),
  ('irbid-city-center', 32.5486, 35.8544, 'إربد سيتي سنتر', 'Irbid City Center', 'إربد', 'Irbid', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', 'يوميًا 8:00 ص – 12:00 ص', 'Daily 8:00 AM – 12:00 AM', '+962 6 581 4300', false)
on conflict (id) do nothing;

insert into menu_categories (id, name_ar, name_en) values
  ('hot', 'مشروبات ساخنة', 'Hot Drinks'),
  ('cold', 'مشروبات باردة', 'Cold Drinks'),
  ('food', 'مأكولات', 'Food'),
  ('beans', 'بن وحبوب', 'Beans & Grounds')
on conflict (id) do nothing;

insert into menu_items (id, category_id, name_ar, name_en, desc_ar, desc_en, price) values
  ('turkish-coffee', 'hot', 'قهوة تركية', 'Turkish Coffee', 'قهوة تركية أصيلة محضّرة على الطريقة التقليدية.', 'Traditionally prepared authentic Turkish coffee.', 1.5),
  ('cappuccino', 'hot', 'كابتشينو العميد', 'Al Ameed Cappuccino', 'إسبريسو غني مع رغوة حليب كريمية، وصفتنا المميزة.', 'Rich espresso with creamy milk foam, our signature recipe.', 2.5),
  ('espresso', 'hot', 'إسبريسو', 'Espresso', 'جرعة إسبريسو مركّزة من حبوب عربيكا 100%.', 'A concentrated shot from 100% Arabica beans.', 2),
  ('latte', 'hot', 'لاتيه', 'Latte', 'إسبريسو مع حليب مبخّر ورغوة خفيفة.', 'Espresso with steamed milk and a light foam top.', 2.75),
  ('iced-latte', 'cold', 'آيس لاتيه', 'Iced Latte', 'لاتيه بارد منعش مع مكعبات ثلج.', 'A refreshing cold latte served over ice.', 3),
  ('cold-brew', 'cold', 'كولد برو', 'Cold Brew', 'قهوة منقوعة ببرودة لساعات طويلة، نكهة ناعمة وقليلة الحموضة.', 'Slow-steeped cold coffee, smooth and low in acidity.', 3.25),
  ('iced-americano', 'cold', 'أيس أمريكانو', 'Iced Americano', 'إسبريسو مع ماء بارد وثلج.', 'Espresso with cold water over ice.', 2.5),
  ('croissant', 'food', 'كرواسون بالزبدة', 'Butter Croissant', 'كرواسون فرنسي طازج مقرمش من الخارج وطري من الداخل.', 'Fresh French croissant, crisp outside and soft inside.', 1.75),
  ('chocolate-cake', 'food', 'كيكة الشوكولاتة', 'Chocolate Cake', 'قطعة كيكة شوكولاتة غنية بطبقة كريمة.', 'A rich slice of chocolate cake with a cream layer.', 2.5),
  ('ground-coffee-250', 'beans', 'بن عربيكا مطحون 250غ', 'Ground Arabica 250g', 'كيس بن عربيكا 100% مطحون طازج، وزن 250 غرام.', '100% Arabica, freshly ground, 250g bag.', 4.5),
  ('roasted-beans-500', 'beans', 'حبوب بن محمّص 500غ', 'Roasted Beans 500g', 'حبوب بن كاملة محمّصة طازجة، وزن 500 غرام.', 'Whole freshly roasted beans, 500g bag.', 8)
on conflict (id) do nothing;

insert into rewards (id, name_ar, name_en, cost, desc_ar, desc_en, emoji, category_ar, category_en) values
  ('coasters', 'فرشات المشروبات', 'Beverage Coasters', 550, 'طقم 4 قطع فرشات مطاط بنقشة بن العميد، معبأة بعلبة أنيقة.', 'A set of 4 rubber coasters subtly branded with the Al Ameed Coffee pattern, boxed.', '☕', 'أدوات قهوة', 'Coffeeware'),
  ('backpack', 'حقيبة الظهر', 'Drawstring Backpack', 425, 'حقيبة ظهر رياضية خفيفة، قماش مقاوم للماء، مقاس واحد يناسب الجميع.', 'Lightweight sports backpack, water-resistant fabric, one size fits all.', '🎒', 'إكسسوارات', 'Accessories'),
  ('mug', 'كوب سيراميك', 'Ceramic Mug', 180, 'كوب سيراميك سعة 350 مل بلوجو بن العميد، آمن للفرن المايكروويف وغسالة الصحون.', '350ml ceramic mug with the Al Ameed logo, microwave and dishwasher safe.', '🍵', 'أدوات قهوة', 'Coffeeware'),
  ('beans', 'كيس بن مطحون 500غ', 'Ground Coffee 500g', 90, 'كيس بن عربيكا 100% مطحون طازج، وزن 500 غرام.', '100% Arabica, freshly ground, 500g bag.', '🫘', 'بن', 'Coffee')
on conflict (id) do nothing;
