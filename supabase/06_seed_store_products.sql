-- =============================================================================
-- منتجات تجريبية لمتجر ORIX (قوارير أصلية · معبأة · معطّرات جو)
-- الصور من Unsplash وتناسب كل فئة — نفّذ في Supabase → SQL Editor
-- تنبيه: إعادة التشغيل تضاعف الصفوف؛ احذف المنتجات من لوحة التحكم أو استخدم
-- DELETE FROM public.store_products; قبل التجربة فقط على بيئة تجريبية.
-- =============================================================================

insert into public.store_products (name, description, price, category, image_urls, sort_order, is_active)
values
  -- ─── قوارير أصلية (original_bottle) — زجاج فاخر ───
  (
    'قارورة كريستال رويال 100 مل',
    'زجاج شفاف بغطاء ذهبي؛ مناسبة للعطور المركّزة والهدايا.',
    89.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=85']::text[],
    1,
    true
  ),
  (
    'قارورة إمبراطوري 50 مل',
    'تصميم كلاسيكي بزوايا ناعمة؛ جودة عالية للاستخدام اليومي.',
    65.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1595425974618-759fc9e9de7a?w=900&q=85']::text[],
    2,
    true
  ),
  (
    'قارورة ميني أوميغا 30 مل',
    'حجم عملي للحقيبة؛ غطاء محكم لحماية العطر.',
    48.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=85']::text[],
    3,
    true
  ),
  (
    'قارورة لامعة أسود ومذهب 75 مل',
    'لمسة فاخرة؛ تبرز العطور الشرقية والخشبية.',
    92.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=85']::text[],
    4,
    true
  ),
  (
    'قارورة زجاج مطفي 100 مل',
    'سطح ناعم غير لامع؛ أنيقة للمعروضات والهدايا.',
    78.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=900&q=85']::text[],
    5,
    true
  ),
  (
    'قارورة سلندر شفافة 60 مل',
    'شكل أسطواني حديث يسهل تخزينها ووضع الملصق.',
    58.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1523293182080-0792f5b59ea4?w=900&q=85']::text[],
    6,
    true
  ),
  (
    'قارورة بيضاء مطورة 90 مل',
    'لمسة نضارة؛ مناسبة للعطور الزهرية والمنعشة.',
    84.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1583484963886-0d59033e4e97?w=900&q=85']::text[],
    7,
    true
  ),
  (
    'مجموعة قوارير سفر 3 × 15 مل',
    'ثلاث قطع صغيرة مع علبة هدايا؛ مثالية للتجربة.',
    72.00,
    'original_bottle',
    array['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=85']::text[],
    8,
    true
  ),

  -- ─── قوارير معبأة (prefilled_bottle) — جاهزة بالكمية ───
  (
    'عطر جاهز 50 مل — طبقة علوية منعشة',
    'معبأ مسبقاً بتركيبة منعشة؛ جاهز للاستخدام فوراً.',
    55.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1608571423902-eed4a5af6378?w=900&q=85']::text[],
    10,
    true
  ),
  (
    'عطر جاهز 30 مل — رائحة زهرية',
    'حجم متوسط بخاخ ناعم؛ للخروج اليومي.',
    42.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1617897903246-719242758050?w=900&q=85']::text[],
    11,
    true
  ),
  (
    'رول أون معبأ 10 مل',
    'سهولة في الاستخدام بدون بخاخ؛ يدوم طويلاً على البشرة.',
    28.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1563170353-be503732fd18?w=900&q=85']::text[],
    12,
    true
  ),
  (
    'زجاجة بخاخ معبأة 100 مل',
    'كمية عائلية؛ رائحة مخملية خفيفة.',
    62.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1571875257727-256c39daae03?w=900&q=85']::text[],
    13,
    true
  ),
  (
    'عطر سفر معبأ 20 مل',
    'غطاء محكم؛ مناسب للشنطة والطيران.',
    35.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=900&q=85']::text[],
    14,
    true
  ),
  (
    'مجموعة معبأة — قطعتان 25 مل',
    'زوج للنهار والمساء؛ تغليف جاهز للإهداء.',
    68.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=85']::text[],
    15,
    true
  ),
  (
    'بخاخ معبأ خفيف 75 مل',
    'تركيبة نهارية منعشة؛ شفافية ولمعان بسيط.',
    52.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85']::text[],
    16,
    true
  ),
  (
    'عطر كريمي معبأ 40 مل',
    'لمسة دافئة؛ مناسب للمساء الشتوي.',
    46.00,
    'prefilled_bottle',
    array['https://images.unsplash.com/photo-1612817288484-6f98c0f8a0b3?w=900&q=85']::text[],
    17,
    true
  ),

  -- ─── معطّرات جو (air_freshener) — منزل وسيارة ───
  (
    'معطّر غرفة بالقشور الخشبية',
    'قاعدة خشب وقصب بخور؛ للصالون والمكتب.',
    34.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=85']::text[],
    20,
    true
  ),
  (
    'بخاخ جو منعش 250 مل',
    'برائحة حمضيات نظيفة للمطابخ والحمامات.',
    22.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=85']::text[],
    21,
    true
  ),
  (
    'معطّر سيارة مع مشبك تهوية',
    'ثبات على منافذ التكييف؛ لا يترك بقعاً.',
    18.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&q=85']::text[],
    22,
    true
  ),
  (
    'عبوة معطّر تركيز عالي 150 مل',
    'قليل الكمية يفي بالغرفة المتوسطة.',
    26.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1612817288484-6f98c0f8a0b3?w=900&q=85']::text[],
    23,
    true
  ),
  (
    'مجموعة معطّرات سيارة 3 قطع',
    'روائح متنوعة؛ للاستبدال حسب المزاج.',
    32.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=85']::text[],
    24,
    true
  ),
  (
    'معطّر بالزيوت العطرية — قارورة زجاج',
    'قطرة في جهاز التوزيع أو الماء الدافئ.',
    29.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1608571423902-eed4a5af6378?w=900&q=85']::text[],
    25,
    true
  ),
  (
    'بخاخ أقمشة وغرف 200 مل',
    'للستائر والكنب؛ رائحة نجيلة خفيفة.',
    24.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=85']::text[],
    26,
    true
  ),
  (
    'معطّر أنبوبي للخزانة',
    'صغير الحجم؛ يدوم عدة أسابيع في الخزانة.',
    15.00,
    'air_freshener',
    array['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&q=85']::text[],
    27,
    true
  );
