import sys

batch1 = """
3d-embroidery-a-line-dress-2319742,3D Embroidery A-Line Dress,"<p><strong>Color:</strong> Blue</p>
<p><strong>Available Sizes:</strong> S, M, L</p>
<p>Elegant <strong>3D Embroidery A-Line Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,blue,party wear",TRUE,Size,S,Color,Blue,SAV-2319742-BLUE-S,400,shopify,100,deny,manual,3192,3990,TRUE,TRUE,,https://img201.savana.com/goods-pic/0b9042b4742a4980a9e712a76f6fbca2_w1440_q90,1,3D Embroidery A-Line Dress - Blue,FALSE,3D Embroidery A-Line Dress,"Buy 3D Embroidery A-Line Dress online in Blue. Sizes S, M, L. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/0b9042b4742a4980a9e712a76f6fbca2_w1440_q90,kg,active
3d-embroidery-a-line-dress-2319742,,,,,,,,Size,M,Color,Blue,SAV-2319742-BLUE-M,400,shopify,100,deny,manual,3192,3990,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/0b9042b4742a4980a9e712a76f6fbca2_w1440_q90,kg,active
3d-embroidery-a-line-dress-2319742,,,,,,,,Size,L,Color,Blue,SAV-2319742-BLUE-L,400,shopify,100,deny,manual,3192,3990,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/0b9042b4742a4980a9e712a76f6fbca2_w1440_q90,kg,active
3d-embroidery-a-line-dress-2319742,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/c53ebff98b1b44ec9da8591871a35ae4_w1440_q90,2,3D Embroidery A-Line Dress,,,,,,,,,,
3d-embroidery-a-line-dress-2319742,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/74286b12e677465b98e3317c5f32230d_w1440_q90,3,3D Embroidery A-Line Dress,,,,,,,,,,
3d-embroidery-a-line-dress-2319742,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/680a45173e044cf9a149cf3328b3d654_w1440_q90,4,3D Embroidery A-Line Dress,,,,,,,,,,
3d-embroidery-a-line-dress-2319742,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/724441e033574b9c9387f56f7b98eddd_w1440_q90,5,3D Embroidery A-Line Dress,,,,,,,,,,
sheer-a-line-dress-2319832,Sheer A-Line Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Sheer A-Line Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2319832-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,1,Sheer A-Line Dress - Black,FALSE,Sheer A-Line Dress,"Buy Sheer A-Line Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
sheer-a-line-dress-2319832,,,,,,,,Size,S,Color,Black,SAV-2319832-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
sheer-a-line-dress-2319832,,,,,,,,Size,M,Color,Black,SAV-2319832-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
sheer-a-line-dress-2319832,,,,,,,,Size,L,Color,Black,SAV-2319832-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
sheer-a-line-dress-2319832,,,,,,,,Size,XL,Color,Black,SAV-2319832-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
sheer-a-line-dress-2319832,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/2a08dcfe7cb04ee2bca4ff9c26217fe7_w1440_q90,2,Sheer A-Line Dress,,,,,,,,,,
sheer-a-line-dress-2319832,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/52e46eef24f84cfa9fa7ef484d852a32_w1440_q90,3,Sheer A-Line Dress,,,,,,,,,,
sheer-a-line-dress-2319832,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/8d9efec4a45a498bb9ea4e85741639d6_w1440_q90,4,Sheer A-Line Dress,,,,,,,,,,
sheer-a-line-dress-2319832,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/ffca3a62884742a781bf668da95a703d_w1440_q90,5,Sheer A-Line Dress,,,,,,,,,,
gathered-a-line-dress-2319962,Gathered A-Line Dress,"<p><strong>Color:</strong> Orange</p>
<p><strong>Available Sizes:</strong> S, M, L, XL</p>
<p>Elegant <strong>Gathered A-Line Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,orange,party wear",TRUE,Size,S,Color,Orange,SAV-2319962-ORANGE-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/13aa8143276a4678891ab7b2fd2419b0_w1440_q90,1,Gathered A-Line Dress - Orange,FALSE,Gathered A-Line Dress,"Buy Gathered A-Line Dress online in Orange. Sizes S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/13aa8143276a4678891ab7b2fd2419b0_w1440_q90,kg,active
gathered-a-line-dress-2319962,,,,,,,,Size,M,Color,Orange,SAV-2319962-ORANGE-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/13aa8143276a4678891ab7b2fd2419b0_w1440_q90,kg,active
gathered-a-line-dress-2319962,,,,,,,,Size,L,Color,Orange,SAV-2319962-ORANGE-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/13aa8143276a4678891ab7b2fd2419b0_w1440_q90,kg,active
gathered-a-line-dress-2319962,,,,,,,,Size,XL,Color,Orange,SAV-2319962-ORANGE-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/13aa8143276a4678891ab7b2fd2419b0_w1440_q90,kg,active
gathered-a-line-dress-2319962,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/962c7d41131d470cb0db413ee0dd721c_w1440_q90,2,Gathered A-Line Dress,,,,,,,,,,
gathered-a-line-dress-2319962,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/27543e9a1373460ab3c347f888e0b608_w1440_q90,3,Gathered A-Line Dress,,,,,,,,,,
gathered-a-line-dress-2319962,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/cf3a02a5daea412ebd219c61ab0e5297_w1440_q90,4,Gathered A-Line Dress,,,,,,,,,,
gathered-a-line-dress-2319962,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/63bbaf7187cd40c59b485eb46308ceef_w1440_q90,5,Gathered A-Line Dress,,,,,,,,,,
backless-a-line-dress-2322742,Backless A-Line Dress,"<p><strong>Color:</strong> Light Blue</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Backless A-Line Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,light-blue,party wear",TRUE,Size,XS,Color,Light Blue,SAV-2322742-LIGHT-BLUE-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/7ef15558fea544cdb04871a57f467dea_w1440_q90,1,Backless A-Line Dress - Light Blue,FALSE,Backless A-Line Dress,"Buy Backless A-Line Dress online in Light Blue. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/7ef15558fea544cdb04871a57f467dea_w1440_q90,kg,active
backless-a-line-dress-2322742,,,,,,,,Size,S,Color,Light Blue,SAV-2322742-LIGHT-BLUE-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/7ef15558fea544cdb04871a57f467dea_w1440_q90,kg,active
backless-a-line-dress-2322742,,,,,,,,Size,M,Color,Light Blue,SAV-2322742-LIGHT-BLUE-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/7ef15558fea544cdb04871a57f467dea_w1440_q90,kg,active
backless-a-line-dress-2322742,,,,,,,,Size,L,Color,Light Blue,SAV-2322742-LIGHT-BLUE-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/7ef15558fea544cdb04871a57f467dea_w1440_q90,kg,active
backless-a-line-dress-2322742,,,,,,,,Size,XL,Color,Light Blue,SAV-2322742-LIGHT-BLUE-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/7ef15558fea544cdb04871a57f467dea_w1440_q90,kg,active
backless-a-line-dress-2322742,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/9a337da36aeb4ace910048dc268aece4_w1440_q90,2,Backless A-Line Dress,,,,,,,,,,
backless-a-line-dress-2322742,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/e0c5cd3a511446f7a9d2fcad9b28f084_w1440_q90,3,Backless A-Line Dress,,,,,,,,,,
backless-a-line-dress-2322742,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/0104959498a94d378eeaa0184f8aef66_w1440_q90,4,Backless A-Line Dress,,,,,,,,,,
sheer-bodycon-dress-2322802,Sheer Bodycon Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Sheer Bodycon Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2322802-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/4b1d6d094ec74f29a90c1dfb733a220c_w1440_q90,1,Sheer Bodycon Dress - Black,FALSE,Sheer Bodycon Dress,"Buy Sheer Bodycon Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/4b1d6d094ec74f29a90c1dfb733a220c_w1440_q90,kg,active
sheer-bodycon-dress-2322802,,,,,,,,Size,S,Color,Black,SAV-2322802-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4b1d6d094ec74f29a90c1dfb733a220c_w1440_q90,kg,active
sheer-bodycon-dress-2322802,,,,,,,,Size,M,Color,Black,SAV-2322802-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4b1d6d094ec74f29a90c1dfb733a220c_w1440_q90,kg,active
sheer-bodycon-dress-2322802,,,,,,,,Size,L,Color,Black,SAV-2322802-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4b1d6d094ec74f29a90c1dfb733a220c_w1440_q90,kg,active
sheer-bodycon-dress-2322802,,,,,,,,Size,XL,Color,Black,SAV-2322802-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4b1d6d094ec74f29a90c1dfb733a220c_w1440_q90,kg,active
sheer-bodycon-dress-2322802,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/ddbd4fce6059465289bb197521721ab1_w1440_q90,2,Sheer Bodycon Dress,,,,,,,,,,
sheer-bodycon-dress-2322802,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/edbcc89259d64ccd9b9ac27e0b7ae9a3_w1440_q90,3,Sheer Bodycon Dress,,,,,,,,,,
sheer-bodycon-dress-2322802,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/a6b1216d6014462e83d32404aa7c59d2_w1440_q90,4,Sheer Bodycon Dress,,,,,,,,,,
sheer-bodycon-dress-2322802,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/f86d879fcbbc40ffb9770f48d2246974_w1440_q90,5,Sheer Bodycon Dress,,,,,,,,,,
button-shirt-dress-2322952,Button Shirt Dress,"<p><strong>Color:</strong> White</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Button Shirt Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,white,party wear",TRUE,Size,XS,Color,White,SAV-2322952-WHITE-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/a1403dd63763495780d64931fd0fdea1_w1440_q90,1,Button Shirt Dress - White,FALSE,Button Shirt Dress,"Buy Button Shirt Dress online in White. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/a1403dd63763495780d64931fd0fdea1_w1440_q90,kg,active
button-shirt-dress-2322952,,,,,,,,Size,S,Color,White,SAV-2322952-WHITE-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/a1403dd63763495780d64931fd0fdea1_w1440_q90,kg,active
button-shirt-dress-2322952,,,,,,,,Size,M,Color,White,SAV-2322952-WHITE-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/a1403dd63763495780d64931fd0fdea1_w1440_q90,kg,active
button-shirt-dress-2322952,,,,,,,,Size,L,Color,White,SAV-2322952-WHITE-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/a1403dd63763495780d64931fd0fdea1_w1440_q90,kg,active
button-shirt-dress-2322952,,,,,,,,Size,XL,Color,White,SAV-2322952-WHITE-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/a1403dd63763495780d64931fd0fdea1_w1440_q90,kg,active
button-shirt-dress-2322952,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/39cdbbbc327c43e2a4f1fdf587870fc5_w1440_q90,2,Button Shirt Dress,,,,,,,,,,
button-shirt-dress-2322952,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/9fdd273cd8f5420a9dffe5e50cd64b7a_w1440_q90,3,Button Shirt Dress,,,,,,,,,,
button-shirt-dress-2322952,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/72c1bb5cae154d5fb87a28d1249898f9_w1440_q90,4,Button Shirt Dress,,,,,,,,,,
gathered-shirt-dress-2325942,Gathered Shirt Dress,"<p><strong>Color:</strong> Khaki</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Gathered Shirt Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,khaki,party wear",TRUE,Size,XS,Color,Khaki,SAV-2325942-KHAKI-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/08daab52cc76442a90c6393df9b3edc4_w1440_q90,1,Gathered Shirt Dress - Khaki,FALSE,Gathered Shirt Dress,"Buy Gathered Shirt Dress online in Khaki. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/08daab52cc76442a90c6393df9b3edc4_w1440_q90,kg,active
gathered-shirt-dress-2325942,,,,,,,,Size,S,Color,Khaki,SAV-2325942-KHAKI-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/08daab52cc76442a90c6393df9b3edc4_w1440_q90,kg,active
gathered-shirt-dress-2325942,,,,,,,,Size,M,Color,Khaki,SAV-2325942-KHAKI-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/08daab52cc76442a90c6393df9b3edc4_w1440_q90,kg,active
gathered-shirt-dress-2325942,,,,,,,,Size,L,Color,Khaki,SAV-2325942-KHAKI-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/08daab52cc76442a90c6393df9b3edc4_w1440_q90,kg,active
gathered-shirt-dress-2325942,,,,,,,,Size,XL,Color,Khaki,SAV-2325942-KHAKI-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/08daab52cc76442a90c6393df9b3edc4_w1440_q90,kg,active
gathered-shirt-dress-2325942,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/7e834486833f40979184cd1e87bbd27e_w1440_q90,2,Gathered Shirt Dress,,,,,,,,,,
gathered-shirt-dress-2325942,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/daa2f62fde264880a51e8d0106eedc3c_w1440_q90,3,Gathered Shirt Dress,,,,,,,,,,
gathered-shirt-dress-2325942,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/2188ed3f24644b0baac16c8f98dea5d8_w1440_q90,4,Gathered Shirt Dress,,,,,,,,,,
draped-bodycon-dress-2326822,Draped Bodycon Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Draped Bodycon Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2326822-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/70802a4f8a324f9bb1462eb59ca8ac3b_w1440_q90,1,Draped Bodycon Dress - Black,FALSE,Draped Bodycon Dress,"Buy Draped Bodycon Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/70802a4f8a324f9bb1462eb59ca8ac3b_w1440_q90,kg,active
draped-bodycon-dress-2326822,,,,,,,,Size,S,Color,Black,SAV-2326822-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/70802a4f8a324f9bb1462eb59ca8ac3b_w1440_q90,kg,active
draped-bodycon-dress-2326822,,,,,,,,Size,M,Color,Black,SAV-2326822-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/70802a4f8a324f9bb1462eb59ca8ac3b_w1440_q90,kg,active
draped-bodycon-dress-2326822,,,,,,,,Size,L,Color,Black,SAV-2326822-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/70802a4f8a324f9bb1462eb59ca8ac3b_w1440_q90,kg,active
draped-bodycon-dress-2326822,,,,,,,,Size,XL,Color,Black,SAV-2326822-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/70802a4f8a324f9bb1462eb59ca8ac3b_w1440_q90,kg,active
draped-bodycon-dress-2326822,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/0cdfd30da17a4e859f5869ac595bc0a2_w1440_q90,2,Draped Bodycon Dress,,,,,,,,,,
draped-bodycon-dress-2326822,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/a48fd8fd50164133bb8d6c6132eef6a4_w1440_q90,3,Draped Bodycon Dress,,,,,,,,,,
draped-bodycon-dress-2326822,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/76279ac9fb00491a97c02f5a078a416d_w1440_q90,4,Draped Bodycon Dress,,,,,,,,,,
gathered-a-line-dress-2331462,Gathered A-Line Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Gathered A-Line Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2331462-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/af05fadb9f1d4df8b0cb82b7d21313d1_w1440_q90,1,Gathered A-Line Dress - Black,FALSE,Gathered A-Line Dress,"Buy Gathered A-Line Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/af05fadb9f1d4df8b0cb82b7d21313d1_w1440_q90,kg,active
gathered-a-line-dress-2331462,,,,,,,,Size,S,Color,Black,SAV-2331462-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/af05fadb9f1d4df8b0cb82b7d21313d1_w1440_q90,kg,active
gathered-a-line-dress-2331462,,,,,,,,Size,M,Color,Black,SAV-2331462-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/af05fadb9f1d4df8b0cb82b7d21313d1_w1440_q90,kg,active
gathered-a-line-dress-2331462,,,,,,,,Size,L,Color,Black,SAV-2331462-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/af05fadb9f1d4df8b0cb82b7d21313d1_w1440_q90,kg,active
gathered-a-line-dress-2331462,,,,,,,,Size,XL,Color,Black,SAV-2331462-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/af05fadb9f1d4df8b0cb82b7d21313d1_w1440_q90,kg,active
gathered-a-line-dress-2331462,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/8eba9f29eaa94c86ab5e2ccab19eb578_w1440_q90,2,Gathered A-Line Dress,,,,,,,,,,
gathered-a-line-dress-2331462,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/d26ca739ba114d819a08b228afeb85d8_w1440_q90,3,Gathered A-Line Dress,,,,,,,,,,
gathered-a-line-dress-2331462,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/4c8a741df94c4cfdb36c9305f1ddd007_w1440_q90,4,Gathered A-Line Dress,,,,,,,,,,
embroidered-slip-dress-2331472,Embroidered Slip Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Embroidered Slip Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2331472-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/db7e2865538d4adc9c7dae5db2631597_w1440_q90,1,Embroidered Slip Dress - Black,FALSE,Embroidered Slip Dress,"Buy Embroidered Slip Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/db7e2865538d4adc9c7dae5db2631597_w1440_q90,kg,active
embroidered-slip-dress-2331472,,,,,,,,Size,S,Color,Black,SAV-2331472-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/db7e2865538d4adc9c7dae5db2631597_w1440_q90,kg,active
embroidered-slip-dress-2331472,,,,,,,,Size,M,Color,Black,SAV-2331472-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/db7e2865538d4adc9c7dae5db2631597_w1440_q90,kg,active
embroidered-slip-dress-2331472,,,,,,,,Size,L,Color,Black,SAV-2331472-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/db7e2865538d4adc9c7dae5db2631597_w1440_q90,kg,active
embroidered-slip-dress-2331472,,,,,,,,Size,XL,Color,Black,SAV-2331472-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/db7e2865538d4adc9c7dae5db2631597_w1440_q90,kg,active
embroidered-slip-dress-2331472,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/c2451cad076b46e781f02fc5c27c78ae_w1440_q90,2,Embroidered Slip Dress,,,,,,,,,,
embroidered-slip-dress-2331472,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/9606418ac56e468eb867b33958ea1af4_w1440_q90,3,Embroidered Slip Dress,,,,,,,,,,
embroidered-slip-dress-2331472,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/d5f2b54bb9d74ee1a65a127892abc0ad_w1440_q90,4,Embroidered Slip Dress,,,,,,,,,,
"""
with open("scripts/raw_csv_complete.txt", "a") as f:
    f.write(batch1)
print("Batch 1 written")
