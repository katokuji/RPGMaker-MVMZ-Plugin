# KRSF_ScreenSharpness.js
ゲーム画面全体にシャープネス効果をかけるRPGツクールMV(RPG Maker MV)用プラグインです。  
ウィンドウを半端な倍率に拡大・縮小した際の画面のぼやけを見た目上、軽減します。  

ゲーム画面内(GameCanvas内)で実行されるPIXI.Filterと異なり、CSSでGameCanvas要素そのものにエフェクトをかけているので
ゲーム画面がぼやけた上からシャープネス・アンシャープ効果がかかります。  
ただし、Webブラウザやスマートフォン上での実行などでブラウザ自体が拡大縮小された場合はさらにその上からぼやけます。  

## MZ対応について
RPGツクールMZを持ってないので動作確認できません。  
作業時間もとれないのでMZ対応の修正箇所をプルリク投げといてくれると助かります。

## サンプル画像(Sample image)
MVのテスト実行後にウィンドウサイズを適当に拡大して、ゲーム画面がぼやけた所にフィルタを適用。

フィルタなし  
![krsfsharp1_none](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/9451bba0-dcee-43a9-91e4-daf0e0447b43)

シャープネス(Sharpness) 50%  
![krsfsharp1_shrap50](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/0089269f-2d2e-4eb7-9ac0-a6e221295b78)

アンシャープマスク(unsharpmask) 50%  
![krsfsharp1_unmsk50](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/90023204-247d-4421-86f0-5c1f73f04cbd)

シャープネス(Sharpness) 20%  
![krsfsharp1_shrap20](https://github.com/katokuji/RPGMakerMVPlugin/assets/1003233/5fe1d445-99cb-48d5-aea3-524887420f27)

## 使い方
プラグインコマンド、スクリプトコマンドから操作します。

### プラグインコマンド
```
KRSF_ScreenSharpness setFilter <filtername> <strength> <flag>

  <filter>    フィルタの種類の文字列
        none ................. フィルタなし
        sharpness ............ シャープネス
        unsharpmask .......... アンシャープマスク

  <strength>  フィルタの強度
        [1-100](default:50) ... 1～100でフィルタの適用量の値

  <flag>      フィルタの有効/無効を切替。
        true .................. フィルタON
        false ................. フィルタOFF

コマンド例:
  //シャープネスを強度50で有効にする
  KRSF_ScreenSharpness setFilter sharpness 50 true

  //アンシャープマスクを強度20で無効にする(=フィルターは適用されない)
  KRSF_ScreenSharpness setFilter unsharpmask 20 false

  //フィルタなしの強度50で有効にする(=フィルターは適用されない)
  KRSF_ScreenSharpness setFilter none 50 true
```

### スクリプトコマンド
プラグインコマンドとオプションは同じですが、引数を省略またはnullが指定可能です。  
省略された場合は現在の値を引継ぎます。
```
krsf.screenSharpness.setFilter(<filter>, <strength>, <flag>)

コマンド例:
  //シャープネスを強度50で有効にする
  krsf.screenSharpness.setFilter('sharpness', 50, true)

  //フィルタをアンシャープマスクに変更、強度と有効/無効の状態は引継ぐ
  krsf.screenSharpness.setFilter('unsharpmask')

  //強度を20に変更、フィルタ指定と有効/無効の状態は引継ぐ
  krsf.screenSharpness.setFilter(null, 20)

  //フィルタを無効にする。フィルタ指定と強度の値の状態は引継ぐ
  krsf.screenSharpness.setFilter(null, null, false)
```

## ライセンス(License)
MIT license.
