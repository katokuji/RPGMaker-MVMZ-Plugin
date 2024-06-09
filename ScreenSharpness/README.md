# KRSF_ScreenSharpness.js
ゲーム画面全体にシャープネス効果をかけるRPGツクールMV(RPG Maker MV)用プラグインです。
ウィンドウを半端な倍率に拡大・縮小した際の画面のぼやけを見た目上、軽減します。
ゲーム内(GameCanvas内)で実行されるPIXI.FilterやWebGLImageFilterと異なり、CSSでGameCanvas要素そのものにエフェクトをかけているので
ゲーム画面がぼやけた上からシャープネス・アンシャープ効果がかかります。
ただし、Webブラウザやスマートフォン上での実行などでブラウザ自体が拡大縮小された場合はさらにその上からぼやけます。

## サンプル画像(Sample image)
MVのテスト実行後にウィンドウサイズを適当に拡大して、ゲーム画面がぼやけた所にフィルタを適用

フィルタなし  
![krsfsharp1_none](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/9451bba0-dcee-43a9-91e4-daf0e0447b43)

シャープネス(Sharpness) 50%  
![krsfsharp1_shrap50](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/0089269f-2d2e-4eb7-9ac0-a6e221295b78)

アンシャープマスク(unsharpmask) 50%  
![krsfsharp1_unmsk50](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/90023204-247d-4421-86f0-5c1f73f04cbd)

シャープネス(Sharpness) 20%  
![krsfsharp1_shrap20](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/5fe1d445-99cb-48d5-aea3-524887420f27)

## ライセンス(License)
MIT license.
