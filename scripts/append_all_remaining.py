import sys

remaining_csv = """
beaded-a-line-dress-2316052,Beaded A-Line Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Beaded A-Line Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2316052-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/0b8e61e05d2146f48039c656911fc6b3_w1440_q90,1,Beaded A-Line Dress - Black,FALSE,Beaded A-Line Dress,"Buy Beaded A-Line Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/0b8e61e05d2146f48039c656911fc6b3_w1440_q90,kg,active
beaded-a-line-dress-2316052,,,,,,,,Size,S,Color,Black,SAV-2316052-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/0b8e61e05d2146f48039c656911fc6b3_w1440_q90,kg,active
beaded-a-line-dress-2316052,,,,,,,,Size,M,Color,Black,SAV-2316052-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/0b8e61e05d2146f48039c656911fc6b3_w1440_q90,kg,active
beaded-a-line-dress-2316052,,,,,,,,Size,L,Color,Black,SAV-2316052-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/0b8e61e05d2146f48039c656911fc6b3_w1440_q90,kg,active
beaded-a-line-dress-2316052,,,,,,,,Size,XL,Color,Black,SAV-2316052-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/0b8e61e05d2146f48039c656911fc6b3_w1440_q90,kg,active
beaded-a-line-dress-2316052,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/c53ebff98b1b44ec9da8591871a35ae4_w1440_q90,2,Beaded A-Line Dress,,,,,,,,,,
beaded-a-line-dress-2316052,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/2a3d0263f4ce43d1a89c8942289659ec_w1440_q90,3,Beaded A-Line Dress,,,,,,,,,,
beaded-a-line-dress-2316052,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/66eb8595fe2040b2a7bf89d5320e84b8_w1440_q90,4,Beaded A-Line Dress,,,,,,,,,,
beaded-a-line-dress-2316052,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/45ca64aae51e44ceb95cb311d4d0e90c_w1440_q90,5,Beaded A-Line Dress,,,,,,,,,,
beaded-a-line-dress-2316052,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/1a6fbfd290374e79b763ec7a66fbc4b0_w1440_q90,6,Beaded A-Line Dress,,,,,,,,,,
backless-a-line-dress-2316062,Backless A-Line Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Backless A-Line Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2316062-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,1,Backless A-Line Dress - Black,FALSE,Backless A-Line Dress,"Buy Backless A-Line Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
backless-a-line-dress-2316062,,,,,,,,Size,S,Color,Black,SAV-2316062-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
backless-a-line-dress-2316062,,,,,,,,Size,M,Color,Black,SAV-2316062-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
backless-a-line-dress-2316062,,,,,,,,Size,L,Color,Black,SAV-2316062-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
backless-a-line-dress-2316062,,,,,,,,Size,XL,Color,Black,SAV-2316062-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/3029f60bfbdf4b44bda240b991823eb5_w1440_q90,kg,active
backless-a-line-dress-2316062,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/2a08dcfe7cb04ee2bca4ff9c26217fe7_w1440_q90,2,Backless A-Line Dress,,,,,,,,,,
backless-a-line-dress-2316062,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/52e46eef24f84cfa9fa7ef484d852a32_w1440_q90,3,Backless A-Line Dress,,,,,,,,,,
backless-a-line-dress-2316062,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/8d9efec4a45a498bb9ea4e85741639d6_w1440_q90,4,Backless A-Line Dress,,,,,,,,,,
backless-a-line-dress-2316062,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/ee1b6bda9bf4431e843ea8c772cb30ca_w1440_q90,5,Backless A-Line Dress,,,,,,,,,,
backless-a-line-dress-2316062,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/ffca3a62884742a781bf668da95a703d_w1440_q90,6,Backless A-Line Dress,,,,,,,,,,
tie-up-bodycon-dress-2317992,Tie Up Bodycon Dress,"<p><strong>Color:</strong> Black</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Tie Up Bodycon Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,black,party wear",TRUE,Size,XS,Color,Black,SAV-2317992-BLACK-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/d512a5db39d7494aa2b22ec7e58dc180_w1440_q90,1,Tie Up Bodycon Dress - Black,FALSE,Tie Up Bodycon Dress,"Buy Tie Up Bodycon Dress online in Black. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/d512a5db39d7494aa2b22ec7e58dc180_w1440_q90,kg,active
tie-up-bodycon-dress-2317992,,,,,,,,Size,S,Color,Black,SAV-2317992-BLACK-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/d512a5db39d7494aa2b22ec7e58dc180_w1440_q90,kg,active
tie-up-bodycon-dress-2317992,,,,,,,,Size,M,Color,Black,SAV-2317992-BLACK-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/d512a5db39d7494aa2b22ec7e58dc180_w1440_q90,kg,active
tie-up-bodycon-dress-2317992,,,,,,,,Size,L,Color,Black,SAV-2317992-BLACK-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/d512a5db39d7494aa2b22ec7e58dc180_w1440_q90,kg,active
tie-up-bodycon-dress-2317992,,,,,,,,Size,XL,Color,Black,SAV-2317992-BLACK-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/d512a5db39d7494aa2b22ec7e58dc180_w1440_q90,kg,active
tie-up-bodycon-dress-2317992,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/694da7318ec845f3ba8ba7c85aa16277_w1440_q90,2,Tie Up Bodycon Dress,,,,,,,,,,
tie-up-bodycon-dress-2317992,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/0f339cf32da5421c97a514d3f3f59074_w1440_q90,3,Tie Up Bodycon Dress,,,,,,,,,,
tie-up-bodycon-dress-2317992,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/8b248a313cae40289a6a8cb23fcb005a_w1440_q90,4,Tie Up Bodycon Dress,,,,,,,,,,
tie-up-bodycon-dress-2317992,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/3067dd5e4eb04c10a4005bda39a31aa9_w1440_q90,5,Tie Up Bodycon Dress,,,,,,,,,,
tie-up-bodycon-dress-2317992,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/73c4d7ecf01f4a4d8778fec5da1d93b9_w1440_q90,6,Tie Up Bodycon Dress,,,,,,,,,,
ruffle-tube-dress-2318202,Ruffle Tube Dress,"<p><strong>Color:</strong> Khaki</p>
<p><strong>Available Sizes:</strong> XS, S, M, L, XL</p>
<p>Elegant <strong>Ruffle Tube Dress</strong> — perfect for parties, evenings out, dates and special occasions.</p>
<p>✓ 7 days easy return &amp; exchange<br/>
✓ Free shipping available<br/>
✓ Delivery in 3-10 days<br/>
✓ Cash on delivery available</p>",,Apparel & Accessories > Clothing > Dresses,Dress,"dress,women,khaki,party wear",TRUE,Size,XS,Color,Khaki,SAV-2318202-KHAKI-XS,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,https://img201.savana.com/goods-pic/4508d0e74f8546b4904fe5a7ae2a3163_w1440_q90,1,Ruffle Tube Dress - Khaki,FALSE,Ruffle Tube Dress,"Buy Ruffle Tube Dress online in Khaki. Sizes XS, S, M, L, XL. Free shipping & 7 days easy returns. Delivery in 3-10 days.",Apparel & Accessories > Clothing > Dresses,Female,Adult,new,https://img201.savana.com/goods-pic/4508d0e74f8546b4904fe5a7ae2a3163_w1440_q90,kg,active
ruffle-tube-dress-2318202,,,,,,,,Size,S,Color,Khaki,SAV-2318202-KHAKI-S,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4508d0e74f8546b4904fe5a7ae2a3163_w1440_q90,kg,active
ruffle-tube-dress-2318202,,,,,,,,Size,M,Color,Khaki,SAV-2318202-KHAKI-M,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4508d0e74f8546b4904fe5a7ae2a3163_w1440_q90,kg,active
ruffle-tube-dress-2318202,,,,,,,,Size,L,Color,Khaki,SAV-2318202-KHAKI-L,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4508d0e74f8546b4904fe5a7ae2a3163_w1440_q90,kg,active
ruffle-tube-dress-2318202,,,,,,,,Size,XL,Color,Khaki,SAV-2318202-KHAKI-XL,400,shopify,100,deny,manual,1251,1390,TRUE,TRUE,,,,,,,,,,,,https://img201.savana.com/goods-pic/4508d0e74f8546b4904fe5a7ae2a3163_w1440_q90,kg,active
ruffle-tube-dress-2318202,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/3400a4ceb84646879899fa0c62b535fa_w1440_q90,2,Ruffle Tube Dress,,,,,,,,,,
ruffle-tube-dress-2318202,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/ea0617300df6487eaf4123dd06bf18d6_w1440_q90,3,Ruffle Tube Dress,,,,,,,,,,
ruffle-tube-dress-2318202,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/aa1e9c5aa85743b185341cfd1d360064_w1440_q90,4,Ruffle Tube Dress,,,,,,,,,,
ruffle-tube-dress-2318202,,,,,,,,,,,,,,,,,,,,,,,https://img201.savana.com/goods-pic/fc9fbeadce0c4b228e930f78bc4594c3_w1440_q90,5,Ruffle Tube Dress,,,,,,,,,,
"""
with open("scripts/raw_csv_complete.txt", "a") as f:
    f.write(remaining_csv)
