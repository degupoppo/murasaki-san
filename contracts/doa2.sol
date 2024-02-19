
//--- ToDo
/*

    UX意味論
        魅力的な命題・コンセプト：
            地下99Fと100Fに居る "ETC, the Queen" と "BTC, the King" をAstar君が頑張って倒しにゆく。
        プレイの実感：
            判断を誤ると全ロスする緊張感
            拡大再生産を実感できる
                序盤では集めるのに時間と労力がそれなりに掛かった素材/武器も、
                    中盤のLvと装備ならば楽に蓄積できる。
                    つまり、限界層の資源が十分に蓄積されていれば、
                    育てたAstrが死んでも次回のキャッチアップが早い
                    クエストボスを倒すと、次の階層では前階層の素材が潤沢に手に入る。
                「強くてニューゲーム」、を繰り返している実感を目指す。
                    たとえ死んでしまっても、次はもっと強く/上手く育成できるかも、と思える。
                    具体的には、より成長値補正の高いアイテムで育成してみたくなる、がわかりやすいか。
            分析と努力の結果に対して報酬がある
                有効な属性装備を用意すると報酬効率が上がる
                階層ごとに有効な解答を明確に用意しておく
                あまり運の要素は含めず、有効打を用意すればリターンも多くなるバランスで。
            階層ごとにメリハリを感じる
                クエストボスで区切られた10階層がある
                各階層は、特徴的なクエストボスを倒すための準備期間
                階層の浅い階で方向性をなんとなく提示する
                    （死なない程度の毒攻撃が多いな → 階層主は毒属性か、など）
                ボス階までに多少の苦労を伴って準備し、ボスを突破するとその階層は稼ぎ階となる。
                「下のフロアはなにか特別な感じがする...」とボスフロアを提示する
                    あるいは、recall floor指定時に、ボスフロア以上を指定すると
                        「38Fにはなにか特別な存在を感じる...」と警告を表示する。
            資産が蓄積する安心感
                死んだ時のexpをtotal expとして加算し、
                一定値に達したらトロフィーや勲章など、恒常的なブーストを付与する
                勲章強化は必須ではないが、あったほうが有利になる救済処置
                時間をかければ、勲章強化で難易度を下げてクリア可能

    アイテム案
        消費アイテム
            その冒険内でのみ有効
            成長率ブースト系
                ATK成長率上昇
                DEF成長率上昇
                HP成長率上昇
            耐性付与系
                火炎耐性付与
                冷気耐性付与
                四元素耐性付与
            攻撃属性付与系
                暗黒攻撃属性付与
                毒属性攻撃付与
                地獄属性攻撃付与
                混沌属性攻撃付与
            決戦物資
                1FだけATK+100
                1FだけDEF+100
        装備
            武器
                ATKとATK成長率に加算
                攻撃属性の有無
            防具
                DEFとDEF成長率に加算
                耐性の有無
            アクセサリー
                HPとHP成長率に加算
                耐性の有無
            

    バランス調整
        level-upの要求exp
        各フロアのクリア報酬exp
        各フロアのクリア報酬item
        → 優れたUXこそが調整目的の中心であるべき

    ログUI表示案：
        00:00   1Fの探索開始, 現在のHP: XXX
        00:00   モンスターIと遭遇
            Astarの攻撃, モンスターIは3のダメージを受けた
            モンスターIの攻撃, Astarは2のダメージを受けた, 残りHP: XXX.
            ・・・
            Astarの攻撃, モンスターIは3のダメージを受けた, モンスターIを倒した
            AstarはモンスターIとの戦闘に勝利した, 残りHP: XXX.
        00:00   モンスターIIと遭遇
        ・・・
        00:00   2Fへの下り階段を見つけた
            クリア時のHP: XXX
            XXXのEXPを得た
                Level 3 -> 4
                max HP XXX -> XXX
                ATK XXX -> XXX
                DEF XXX -> XXX
            宝箱を発見した
                アイテムI +X
                アイテムII +X
                アイテムIII +X
            休息を取りHPが全快した
        00:00   2Fの探索開始, 現在のHP: XXX

    一度の取得はgas limitに達して不可能なので、1フロアごとに取得する
        arg:
            astarStatus
            seed
            floorLevel
        return:
            enemyIds
            astarHps[101]
                0: floor stat HP
                1-10:   battle 1
                11-20:  battle 2
                ...
                90-100: battle 10
                101:    floor end HP
            enemyHps[101]
                0: dummy
                1-10:   battle 1, enemy 1
                ...
            astarStatus
            rewardItems[64]
    
    UIの整理
        出発時の選択
            どのNFTとfluffyで加護をつけるか
            帰還階の指示
        冒険中の情報取得
            これまでの階の状況
                どの種類の敵とどの順番で戦闘したか
                各戦闘の10ターンの経過
                階層をクリアしたかどうか
                階層クリア時のHP, exp, 強さ
                階層のクリア報酬
            現在の階の状況
                階層番号
                これまでの戦闘回数
                現在のHP
                帰還階ならば帰還可能を返す
            以上を時間に応じて公開する
        帰還時の情報
            expと強さ
            持ち帰り報酬


    adventure logの整理
        HP制は廃止
            1時間で1フロア
            1フロアで10回の戦闘
            1戦闘=6分
            3分戦闘、残り3分で休息してHP回復
            全快の状態で次の戦闘へ
        1Fから100Fまでは1000回の戦闘
            ショートカット時は1000回の途中から再開のイメージ
            1000体の配置はmastarSeedによって決定される
        フロアログで必要な情報：
            10体のenemyId
            各戦闘の結果
            フロア報酬
                exp
                item
                

    ユーザーの選択と体験の深慮
        選択
            出発時
                どのHoM由来のNFTで加護をつけるか
                どのDoAアイテムを持たせるか
                どの階を帰還指示に設定するか
            冒険中
                帰還指示を出し直すかどうか
            冒険後
                どのアイテムを消費して合成するか
        体験
            徐々に開示される冒険ログを眺める
            帰還させるか冒険を続けさせるかのジレンマに悩む
            無事に生還させられた時の報酬としてアイテムを得る
            強化したアイテムを持たせてより効率的な冒険へ出発させる
            HoMやMoMでの活動がDoAに有利になる

    要実装
        現在のHP表示
            冒険続行か帰還指示かの判断材料になる
        ランキング表示
            murasakiIdで最深到達階を表示する
        途中階への帰還
            クエスト階へはひとっ飛びでショートカット可能とする
    
    ローグライクルール
        気絶するとexpが0にリセットされ、DoAのアイテムはすべて失われる
        気絶せずに帰還するとexpは保持され、DoAのアイテムを持ち帰れる
            hengbandで倉庫が存在するゲーム性といえるだろうか

    要深慮
        気絶時に装備品をロストするかどうか
        装備品をマケプレで売買可能とするかどうか
            マケプレはオーソドックスな板取引とするか、
    
    要検討
        誰かのロストNFTをプールしておいて、のちの冒険者が拾える、などはどうか。
            まずロストNFTの拾い判定をして、外れたらランダムNFTを生成する
            浅い階でストックがパンクすることを防ぐため、ストック数は10や20とlimitを決める
            "The *** of fumamo's Astar" などと銘を刻む
            ある程度の強さ以上しかストックしない
                +5以上の修正値、など。
            自分の持ち物は、ロストした階の踏破時に高確率で回収できる、など。
                50%？90%？
            10個スロットを用意しておいて、死亡時に条件を見したNFTをランダムなスロットに入れる
                先にスロットが埋まっていても上書きされる
                誰かがその階を踏破したらd100ロール、d10以下なら次にスロットロール
                引いたスロットが0でないならば、そのアイテムを報酬として取得する
                0もしくはd30以下なら、ランダムな報酬NFTを生成、など。
                もちろん、NFTがmint/transferされるのはendAdventure()時
        連続踏破階数に応じてレアリティを上昇させる？
            浅い階から時間をかけて踏破していくと、ボーナスとしてアイテムドロップ率が上昇する、など。
        理想的なゲーム進行とバランス
            1年ほど進行したHoMのNFTとぬいちゃんで加護を付け、
                最大強化させたBTC特攻武器・防具を用意し、
                最大レベル50まで育てたキャラクターで、100Fに挑んで、
                およそ90%の確率で勝利できるバランスを目指す。
                また、ETHとBTCの特攻装備は少し変える。
                    弱点属性が異なる、攻撃属性が異なる、など。
                    ETH: nether攻撃/chaos耐性抜け, BTC: chaos攻撃/nether耐性抜け
            理不尽な死は極力発生させない
                最終装備のキャラが低層で死ぬことはほぼ無い。
            ただし、クエスト階はパズル要素を用意する
                どの種類の敵にも最適解となる万能武器はつくらない
                    38Fではこの属性の武器が無いとかなりの強さが必要で、
                    44Fではこの属性の防具を用意しないとダメージが辛すぎてほぼ勝てない、など。
        パラメータ案
            STR
            STR-attrib
            DEF
            DEF-resist
        加護案
            STR系NFT
                ATK増加担当
                固定値プラス型と、成長値プラス型の２種類
                上位NFTは耐性も付与させる？
            DEF系NFT
                DEF増加担当
                固定値プラス型と、成長値プラス型の２種類
                上位NFTは耐性も付与させる？
            INT系NFT
                耐性担当
                1-4個の耐性を付与する
                装備品の耐性抜けとの兼ね合いで選ぶ
            Fluffy
                HP増加担当
                固定値プラス型と、成長値プラス型の２種類
                上位NFTは耐性も付与させる？
            攻撃力が足りなければ、STR系を3つとFluffyを1つ、とかも可。
        属性/耐性案
            hengbandより：
                酸・電撃・火炎・冷気 + 毒・暗黒・地獄・混沌
                acid, elec, fire, cold, pois, dark, nether, chaos
                四元素属性が基本で、上位属性は特殊な攻撃・耐性とするか。
        戦闘システム案
            ダメージ計算案：
                https://note.com/daraneko_games/n/n9819dda2698a
            
        アイテム案
            武器
                +ATKと+ATK成長
                属性攻撃
            防具
                +DEFと+DEF成長
                耐性
            アクセサリー
                主には耐性
                装備を失わない帰還を許可する特殊アクセサリーなども。
        SBT案
            DoAのTBAにboundするSBT
            気絶・生還に関わらず、ステータスが恒常的に上昇する
            時間をかけてSBTを集めることで、いつか必ずクリア可能となる。
            収束関数で上限を決める。荒稼ぎで+100とかバランス崩壊させない。
            シンボル案は何が良いか
                宝石、でも良いだろうか。
                    diamond, ruby, sapphie, 
                    他に宝石類が使えなくなるのが問題だが。
                星、などでも良いだろうか。
                    スピカ, リゲル, ペテルギウス, 
                    マイナーなところで、"A"で始まる星シリーズでどうだろうか。
            取得タイミングはどうするか。
            効果：
                ATK+10やDEF+10
                ATK成長+1やDEF成長+1
    
    アイテム案
        HoMのアイテムは出発時に加護として預かるが、生還/気絶に関わらず返還される
        DoAのアイテムは出発時に装備させ、気絶したら失われる。
            武器
            防具
            アクセサリー
    
    パラメータ案
        ATK 攻撃力、
        DEF 防御力、AC
        AGL 素早さ
        属性 


    DoMのUXの深慮
        シビアなローグライク型
            失敗した冒険では何も得られない
            出発時にLv1に戻る
            適当に選択しているとゲーム資源がマイナスになりストレスを感じやすい
            ゲーム性の綿密なバランス調整が必要
            シビアさと戦略性が楽しい
            ローグライク型の根本はプレイヤーの実力の向上
                状況把握と適切な選択が具体的な実力の本体
                しかし、出発時しかプレイヤーの選択が発生しない本作では、
                実力が寄与するメカニズムを作りくい
            よって、ローグライク型にするにしても、
                部分的にローグライク的なりセットと緊張感を組み込むことは可能だが、
                繰り返しによって蓄積し持ち越せる何からのゲーム内資産は必要だろう。
            資産を失うことがあるのか、ないのか、がコンセプトとゲームバランスの分岐点だろうか。
            資産の蓄積と正しい選択肢によって成功を実現した、という「達成感」が楽しさの本体だろう。
        ゆるい蓄積型
            倒れてもゲーム資産がマイナスにならない
            レベルや資産はすべて持ち越せ蓄積する
            基本的にはゲーム資産は加算しかされない
            適当に直感でプレイ可能
            リワードを細かく実感できるバランス調整が必要
            資産と効率が増大してゆく実感が楽しく、ストレスを感じにくい
            プレイを継続すればいつかは必ずクリア可能
            「もっと先が見たい」と思わせるコンテンツボリュームが必要
            むしろ終わりがないぐらいのコンテンツボリュームを用意しなければならない
                100Fの敵を倒す、というゴールが設定されている場合には少し不向きだろうか。
        失うリスクのある資産
            倒れた際に所持していたDoA由来のアイテム
        失うリスクのない資産
            HoM由来のNFT
            

    DoM構想III
        コンセプト
            Mr. Astarが時価総額上位のCryptoを倒しながら地下100Fを目指すサブゲーム
        相互運用性
            HoMのNFT資産をDoAで使用可能
            MoMを所持するとDoAでボーナス付与
            DoAの戦利品はHoMでも使用可能
       *面白さのエッセンスは？
            
        プレイヤーの選択
            出発時に持たせる3つのNFTと1匹のfluffy
                レベルアップ時の補正値をブーストする
            どの階で帰還の巻物を使うかの指示
                その階クリア後に帰還する
                帰還の巻物の指示は、ログを見ながら冒険中も上書き可能とする
                ただし、+3F先のFloorからしか指定できない、など制限を設ける。
            消費アイテムをどれだけつぎ込むか
                すべて出発時に消費される
            装備品？
                気絶すると失われる。
        敵
            時価総額200位以内のクリプトシンボル
            特定階ではクエストボスが居る
                6, 12, 24, 38, 44, 50, 56, 62, 76, 88, 99, 100
                クエストボスを倒すとpresentboxを得られる
                クエストボスは一度しか出現しない？
                ATH修飾語など、何かしらの特別感を演出する
        フロア内でのイベント
            10体の敵との戦闘
            フロアのクリア時にまとめて報酬（expとitem）を得る
       *成長・強化ルール
            
       *戦闘ルール
            
        必要プレイ時間
            切りよく500 block = 1 floor
            1 emenyu/50 block (=10min)
            1 floor = 10 enemy
            およそ1年程度のプレイ時間で100Fをクリアできるバランスで。
        実装
            embarkAdventure()
                _astarId, _nftId1,2,3, _fluffyId, _scrollFloorなどを引数に取る
                所有権やcoolTimeをチェックする
                MoMの所持をチェックしてボーナスを加味する
                struct adventuresに初期パラメータを格納する
                100Fまでのフロアイベントを決定するseedOfAdventureを決定する
                NFTをすべてコントラクトへtransferする
            adventureLog() view
                _astarId, _floorIdを引数に取る
                seedOfAdventureを元に、endBlockを算出しチェックする
                    endBlockを超えていなければerrを返す
                    endBlockを超えていれば、blockHashを元にseedOfFloorを算出する
                seedOfAdventureを元に、_floorIdのイベントを生成する
                seedOfFloorを元に、イベント判定を行う
                可能であれば、1戦闘毎にlogを生成する
            endAdventure()
                isSurviveとreasScrollをチェックする
                生還時は報酬を処理する
                倒れたときは何もしない
                預かったNFTをownerへtransferして返す
            フロアイベントの生成
                出現する敵と順番
                フロアのクリア報酬（+exp, item）
                seedOfAdventureから生成する
            シリーズNFTの管理
                DoAのNFTはmmに紐づくTBAで管理する
                    Astarではなくmmに紐づかせる
        UI
            embark時にもって行かせるNFTを選択する画面
            現在の探索フロア数とステータス
            フロア数を指定してログ表示させるウィンドウ
            直近3フロアのログは開いたときに表示させる
            Scroll of Returnを読むフロアの指示ボタン
                フロアクリア後に読む
            
                
    DoM構想II
        意味論
            Mr. Astarが時価総額上位のCryptoを倒しながら地下100Fを目指すサブゲーム
            HoMでクラフトされたNFTを3つとfluffy 1匹を連れて冒険に送り出す放置型RPG。
            ブロック生成に伴ってターン結果が開示されてゆく。
            生還できれば、冒険中に得たアイテムを持ち帰れる。倒れた場合は持ち帰れない。
                持ち込んだNFTは失われない。
            敵は、時価総額200位以内のクリプト。浅い階ほど時価総額の小さい銘柄。
            100F踏破に1年はかかるバランスに調整する。
                1階の探索にかかる時間はどの程度に設定するか。
        要バランス調整
            exp - Lv換算表
            Lv - パラメータ増加表
            敵出現率テーブル
        成長
            冒険中に成長するパラメータ
            ただし、txなしで計算のみで成長を表現することができるだろうか。
            → expをが溜まってゆき、総expをレベルに換算してパラメータを計算する
                各フロアlog生成時は、直近フロアの返り値expを参照する
        強化
            冒険毎にリセットされない、次回に持ち越せる蓄積する資産
            基本的には失われず、少しずつでもためてゆけばいずれは必ず100Fに到達できる。
        ボス
            10F毎にユニークなボスを配置する
                あるいは、ランクエ階でも良いか。
                6, 12, 24, 38, 44, 50, 56, 62, 76, 88, 99
            ボスフロアではボスとの戦闘のみ発生し、謎解き要素を強めに設定する
                12Fは炎属性のFluffierが弱点、など。
                詰まないようにいくつかの解答を用意しておく。
                また、ランクは一緒だが性質はプレイヤーごとに異なる。
                    Fluffierが必要だが、色が違う、など。
                    色も3-4種類用意しておく。
                特攻の解答というだけで、不利ではあるが強引な突破も可能にしておく。
            99FはQueen Ether, ラスボス100FはKing Bitcoin
                100 Bitcoin
                99  Ether
                88  MATIC
                76  ATOM
                62  NEAR
                50  EGLD
                44  FTM
                38  AXS
                24  FLOW
                12  KCS
                6   PEPE
            一度倒したbossは二度と出現しない
                よって、ボス討伐時は特化装備で挑む必要がある。
        敵
            敵の強さ補正を示す修飾語
                Crashing
                Bearish
                (Neutral)
                Bullish
                All-Time High
        状態異常
            プレイヤーキャラクター側の状態異常
                Extreme Fear
                Fear
                Neutral
                Greed
                Extreme Greed
            バランス調整が複雑になるのでひとまず棚上げ
        戦闘ルール
            命中・回避判定
                ACと回避率からhitのtrue/falseを判定
                d1は必ず回避、d20は必ず命中
                d20+攻撃ボーナス ≧ 目標のAC
                攻撃ロールとダメージへの修正値は同一
                脆弱性(x2)と抵抗性(x1/2)
                殴打・斬撃・刺突
            ダメージ計算
                XdYでダメージ計算
                    固定ダメージでも良いか
                ACで軽減
                敵のHPから引き算する
            このロールをお互い交互に行い、hp<=0になったら戦闘終了
                無限ループを避けるため、10回か、5回程度のロール上限を設定しておく
                ロール上限に達したら、モンスターは逃げ出したで戦利品やexpは得られない
                モンスターによってロール値を設定しておいても良いだろうか。
                    limitLoop=3で逃げ足が早い、など。
            また、乱数はseed値が同じなら同じ結果を返すよう実装する
                blockHash, blockMiner, owner, _astarId, から算出させる
            ある程度ACが高くなれば、低レベルの敵からはほとんどダメージを受けなくなる。
                敵からのダメージはロール判定ではなく固定AC判定、固定ダメージでも良いかも知れない。
        プレイヤーの選択
            出発時に持たせる3つのNFTと1匹のfluffy
                レベルアップ時の補正を変化させるか
            どの階で帰還するか
                帰還の巻物を使う階を指定
                また、帰還の巻物の指示は、ログを見ながら冒険中も可能とする
                    mapping strollFloorをあとから書き換える
                    ただし、+3F先のFloorからしか指定できない、など制限を設ける。
            消費アイテムをどれだけつぎ込むか
                即時プラス補正が得られるアイテム
                成長にプラス補正が得られるアイテム
                すべて出発時に消費される
        フロアイベント・ルール
            踏破時間: 500 block (=90min)
            戦闘回数: 10回
            報酬取得: クリア時に+exp, 固定報酬, ランダム報酬
        次の階へ引き継ぐ情報
            _isSurvive, 階を生存できたか、_hpで代替可能だろうか
            _exp, それまでの累積exp, 階の内部計算でLvへ変換する
            _hp, 現在のhp
            その他, 取得アイテム、(状態異常)
            
        実装
            call_adventureLog()
                引数: _astarId, _floorId, _nftId1, _nftId2, _nftId3, _fluffyId, _blookOfDeparture
                    → 出発時に設定されるnftIdなどは、structへ代入して一括管理してしまうか。
                    → adeventureLog()関数内で出発時のstructを参照して得ることとする。
                返り値: bool _isSurvive, uint _exp, uint _hp?, _adventureLog(形式不明, string?), _requireBlook
                内部処理：
                    _isAdventureチェック
                    _isAliveAtPreventFloorチェック
                        直近のcall_adventureLogでtrueをチェックする
                    _expをcall_adventureLogで直近floorより取得する
                    _hpも取得する？
                    これらの情報を元に、floorのsurvive, expなどを計算する
                    計算時に使う_seedは、_requireBlookのハッシュ値を使う
                        _requireBlookは_blokkOfDepartureから計算する
                        このblookが生成されていないとlogが生成されない実装
            → 直近階のexpを参照すると、延々と参照してしまい100Fでは1Fから再計算になってしまう。
            → よって、階を突破したときに固定expを得るようにするしかないか。
            → 出発seed値によって、100Fまでの出現モンスターと取得アイテムなどのフロアイベントはすべて計算し、
                敵を倒せるかどうかの判定のみ、FloorごとのblockHashで判定する、ではどうか。
                この方法だと、Floorごとの取得expがランダムとすることができる。
        キャラクターのステータス
            クリプトキーワードならば：
                scalability, interoperability and sustainability
            D&Dならば：
                基本AC, 基本攻撃力, 
                +補正AC, +補正攻撃力

    放置・謎解き型サイドゲームの構想I
        仮題：ゆけ！Astar君！
        要素
            放置型RPG
            むらさきさんがクラフトしたNFTを持たせて、Astar君をダンジョンへお出かけさせる
            もたせたNFTに応じてstatusにブーストが掛かる
            また、NFTごとにシナジーが発生して、ダンジョンや敵によっては有利になったり不利になったりする
                NFTにはseedから算出して、火・水・風などの属性を割り振る
            各行動の結果はブロック毎に進んでゆく。
                行動seedを決定するのは出発時のtxの時のみ
                それ以降の行動は、最初のseed値を元に算出される
                該当blockに達したら結果が開示される
                内部計算を担うコントラクトはverifyせずにblackboxとする。
            出発させるとAstar君と各NFTは一旦手元を離れる。
                冒険終了後にclaimすると報酬と一緒に手元に戻ってくる。
        コンセプト
            ダンジョン探索系でよいだろうか
                世界観が合わないか。
            お花畑にお花探し、でもよいだろうか。
                pippelとバッティングするか。
            むらさきさんの世界観で、
            Astar君がお出かけする先として不自然ではなく、
            RPGを連想しやすい行き先は何が妥当だろうか。
        実装
            乱数生成
                開始時のseedと、指定blockのhashを組み合わせて乱数を生成する
                その乱数によって判定を行う
            行動
                行動中
                    指定blockに到達するまで以前の行動を継続中
        概要
            深度100Fの一方通行ダンジョン
                ダンジョン名案：鉄獄、家の井戸、タンスの奥、壁の穴、
            一度出ると強さはリセットされる
                初期アイテムとして3種類のNFTを持ち込む
                持ち込んだNFTは生還・失敗に関わらず失われない
                ダンジョン内で拾ったアイテムは生還できれば持ち帰れる
                出発時に、帰還の巻物を使う階層を予め決めておく
            敵
                基本的にはangband, hengbandより、版権フリーなものを参照する
                ラスボスはキング・ビットコイン、99Fの門番はクイーン・イーサリアム
                80F以降は時価総額順に主要コインを登場させる
                むしろ敵キャラはすべてコインやクリプトにまつわる概念・キャラクターでよいか。
                アスターくんが他のクリプトを打倒してゆく冒険
                就職後
                    bearing
                    bulling
                    ATH
            アイテム
                重要な初期武装はHoMのNFTを借りてゆく
                    HoMのNFTは生還・失敗に関わらず失われない
                    その組み合わせによって、敵によってはシナジーを発生させる
            時間
                ブロックが生成される毎に時間を進める
                    1フロアあたり、何ブロックとするか。
                    また、深度によって滞在ブロック数を変化させるかどうか。
                    できるだけシンプルなルールにしたい。
                100F到達には1年ぐらい必要なバランスで。                



 ok 耐性メカニズムの実装
    
    紋章システムの実装
        死亡時にtotal expを蓄積させる
        蓄積値に応じてproof of XXXを発行する
            SBTにするか、struct内の変数にするか。
    
    MoMボーナスの実装
    

    改善案
        itemのNFT化
            強化の検討
                目的が難しい
                上のランクのアイテムを得ることとの差別化は？
            使用時の総獲得exp値
            帰還階は誰かがロストしたNFTを獲得する可能性がある
            NFTは無限にmintされてしまうが、冒険でロストするので減る
            合成の検討
                NFT消費メカニズムのひとつ
                ゴミアイテムの減少
    
    バランス
        最終到達点
            HP  2100
            ATK 1024 +100 boost
            DEF 1024 +100 boost
            全耐性
            属性攻撃不要
        BTC
            HP  2100
            ATK 1328
            DEF 915
            全属性攻撃
            耐性なし
        BTCからの攻撃：(100+rnd)*10 = 1020
            DEF MaxでHPが2～44残る
        BTCへの攻撃
            ATK Max +100 boosで2100を確定で削りきれる
            耐性なしなので耐性抜けは狙えない
            育成と装備を用意すれば確定で勝てる
        最終ステータス内訳
            ATK/DEF
                初期値24
                Lv50なので10pint/Lvがmax成長 = +490
                うち、もとから+2/Lvされる, 残りの+8は装備か紋章で稼ぐ
                装備による補正上限 = +522
                合計 24 + 490 + 510 = 1024
                最終戦勝利には、成長値ATK+10, DEF+10, 装備補正+522を用意する
                ATKは武器、DEFは防具で+補正を稼ぐ
            HP
                初期値 240
                20 point/Lvで+980
                装備で+880
                maxHPはアクセサリー枠で+補正を稼ぐ
                基本的には、ちょっと足りないDEF差をHPでカバーする
                    が、高いHPにはあまり意味はなく、Lvや進行度の指標の位置づけ。
                    耐性抜けやDEF不足はだいたい一撃死のため。
                乱数で1Floor=10Battle=100stepで100～500のダメージを受ける。平均250。
                    ATK高く早めに敵を倒せればその分被ダメージは小さくなる。
            耐性
                種類は4+4
                防具で付けられるのは3つまで
                アクセサリーで付けられるのは3つまで
                加護で付けられるのは3つまで。
        紋章案
            紋章なしでギリギリカンスト可能
            紋章あればその分カンストまでの準備が楽
                HP+10
                HP+20
                HP+30
                HP+40   (合計+100）
                火炎耐性
                冷気耐性（耐性パズル有利）
                ATK成長+1
                ATK成長+1
                DEF成長+1
                DEF成長+1（合計+2）
                ATK+10
                DEF+10
        加護案
            何かしらの耐性付与
            何かしらの攻撃属性付与（四元素まで）
            あとはHP+10やATK+10など適当なものを割り振る
            最終的には、耐性の穴を加護で埋めることになる。
        MoMボーナス
            成長率に+1
        防具案
            基本性能は一定で、耐性のみ異なるシリーズを用意する
                耐性のリング：耐火耐冷耐電耐酸のうちどれか
                上位耐性のリング：暗黒地獄混沌毒のうちどれか、など。
                上質な殻：下位耐性１つ＋上位耐性１つ、など。
            補正値は+10が成長値最大のLv1分に相当する。
        武器案
            成長値重視の育成装備か、成長値0で補正値大の最終装備かに分類する。
            ロスト前提のため、合成を必要とする武器強化は必須としない。

    resume関数の実装
    bossの実装
        クエスト階の10番目の敵がbossになる
        flagで管理してbossを倒せばtrueとなり以降出てこない
        bossを倒せばその次の階へのrecallが解禁となる
        boss踏破にはそれなりの報酬を用意しておく
        また、bossとの戦闘は特別なfunctionを用意してもよいだろうか
            enemyIdで引っ掛けて分岐させる
    属性攻撃の実装
        全部で8種類（下位4 + 上位4）
        二進法でtrue/falseを表す
            11111111 = 255で全属性
            11011011 = 219で6属性、など。
        攻撃属性に対して防御側が属性なければそのままのダメージ
            防御側が属性耐性あれば1/3のダメージ
            属性攻撃は強めに設定する
            また、すべての耐性をつけないと防御効果は得られない
        防御側：
            攻撃属性全てに耐性持ちの時：DEF*3
        攻撃側：
            属性攻撃は基本的にダメージ多めに設定する
        「物理」という属性も加える
            物理耐性ありの敵は、何かしらの別耐性で攻撃する必要がある。
        耐性持ちの敵は、耐性以外で攻撃しないとほとんど倒せない
            「物理」が主となるだろう。物理耐性持ちを突破するために、属性攻撃にインセンティブをつける
    報酬とDoA由来itemによるブーストの実装
    勝利の実装
    恒常的なブースト：勲章システムの実装
        Proof of the Wisdom, などを10種類ほど考える
        後半のものほど効果が高い
    戦闘補正案
        ArthSwapで24hrで+3%以上ならばburish補正がつく
        可能であれば、各tokenもburish bearish補正を考える
        Astarから参照可能なtokenはどれだろうか。


    # from rarity, based on D%D3.5, rarity_crafting_materials.sol
    # 敵ACをチェックして、判定trueならばダメージを与えられる
    # 少ない攻撃回数でhealthを0にできればrewardが増える
    function scout(uint _summoner) public view returns (uint reward) {
        uint _level = rm.level(_summoner);
        uint _class = rm.class(_summoner);
        (uint32 _str, uint32 _dex, uint32 _const,,,) = _attr.ability_scores(_summoner);
        int _health = int(health_by_class_and_level(_class, _level, _const));
        int _dungeon_health = dungeon_health;
        int _damage = int(damage(_str));
        int _attack_bonus = attack_bonus(_class, _str, _level);
        bool _to_hit_ac = to_hit_ac(_attack_bonus);
        bool _hit_ac = armor_class(_dex) < dungeon_to_hit;
        if (_to_hit_ac) {
            for (reward = 10; reward >= 0; reward--) {
                _dungeon_health -= _damage;
                if (_dungeon_health <= 0) {break;}
                if (_hit_ac) {_health -= dungeon_damage;}
                if (_health <= 0) {return 0;}
            }
        }
    }




*/


// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;


// openzeppelin v4.8
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/ERC721.sol";



// dungeon of astar
contract Dungeon_of_Astar is Ownable, ReentrancyGuard, Pausable {
    
    // sueside
    function QyAt (uint _astarId) external nonReentrant whenNotPaused () {
        //***TODO*** sueside
    }
    
    // internal, check element resistance
    // element info shows uint8 numerics (0-255)
    // ex) attaker: 253 (11111101) vs defender: 255 (11111111) -> resist
    // ex) attaker: 3 (00000011) vs defender: 253 (11111101) -> not resist
    function _checkElementResistance (uint _attacker, uint _defender) public pure returns (bool) {
        bool[8] memory _attackerElementList = _convertToBinary(uint8(_attacker));
        bool[8] memory _defenderElementList = _convertToBinary(uint8(_defender));
        return _isElementDefenced(_attackerElementList, _defenderElementList);
    }
    
    // internal, convert uint8 to bool[8]
    // ex) 11111101 -> 253
    function _convertToBinary(uint8 number) public pure returns (bool[8] memory) {
        bool[8] memory binaryArray;
        for (uint8 i = 0; i < 8;) {
            unchecked {
                if (number & 1 == 1) {
                    binaryArray[7 - i] = true;
                } else {
                    binaryArray[7 - i] = false;
                }
                number = number >> 1;
                i++;
            }
        }
        return binaryArray;
    }

    // internal, convert bool[8] to uint[8]
    function _convertToUint8 (bool[8] memory binaryArray) public pure returns (uint8) {
        uint8 number = 0;
        for (uint8 i = 0; i < 8; i++) {
            if (binaryArray[i]) {
                number |= uint8(1 << (7 - i));
            }
        }
        return number;
    }
    
    // internal, comparison attacker element and defender element
    // when all elements of the attacker are defensed, return true
    function _isElementDefenced (
        bool[8] memory _attackerElements, 
        bool[8] memory _defenderElements
    ) public pure returns (bool) {
        for (uint8 i = 0; i < 8;) {
            unchecked {
                if (_attackerElements[i] && !_defenderElements[i]) {
                    return false; // A=true, B=false -> Return false immediately
                }
                i++;
            }
        }
        return true; // No mismatch found, return true
    }
    
    // internal, combine the element/resi
    // ex) 00011110 (30) + 01001111 (79) -> 01011111 (95)
    function _combineElement (uint _elem1, uint _elem2) public pure returns (uint) {
        bool[8] memory _elem1Bool = _convertToBinary(uint8(_elem1));
        bool[8] memory _elem2Bool = _convertToBinary(uint8(_elem2));
        for (uint8 i = 0; i < 8;) {
            unchecked {
                // update elem1Bool
                // elem1Bool[x] == true or elem2Bool[x] == true -> elem1Bool = true
                if (_elem2Bool[i] == true && _elem1Bool[i] == false) {
                    _elem1Bool[i] = true;
                }
                i++;
            }
        }
        return uint(_convertToUint8(_elem1Bool));
    }
    
    //pausable
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    } 
    
    
    //--- variants
    
    // global variants
    uint public TIME_PER_FLOOR = 1;
    
    // current adventure info
    struct adventureInfo {
        bool inAdventure;
        bool isAlive;
        uint embarkTime;
        uint embarkFloor;
        uint[8] astarStatus;    // MaxHP, ATK, DEF, EXP, elem, resi
        uint[8] astarStatusAtEnd; // HP, ATK, DEF, EXP
        uint astarHpAtEnd;
        uint recallFloorLevel;
        uint masterSeed;
        uint endTime;
        uint[8] nftIdOfHoM;
        uint[3] astarAdd;   // HP, ATK, DEF, add point per level-up
    }
    mapping (uint => adventureInfo) public adventureInfos;  // astarId => info
    // getter
    function call_adventureInfos (uint _astarId) external whenNotPaused view returns (
        bool inAdventure,
        bool isAlive,
        uint embarkTime,
        uint embarkFloor,
        uint[8] memory astarStatus,    // MaxHP, ATK, DEF, EXP
        uint[8] memory astarStatusAtEnd, // HP, ATK, DEF, EXP
        uint astarHpAtEnd,
        //uint astarLv,
        uint recallFloorLevel,
        uint masterSeed,
        uint endTime,
        uint[8] memory nftIdOfHoM,
        uint[3] memory astarAdd   // HP, ATK, DEF, add point per level-up
    ) {
        inAdventure = adventureInfos[_astarId].inAdventure;
        isAlive = adventureInfos[_astarId].isAlive;
        embarkTime = adventureInfos[_astarId].embarkTime;
        embarkFloor = adventureInfos[_astarId].embarkFloor;
        astarStatus = adventureInfos[_astarId].astarStatus;
        astarStatusAtEnd = adventureInfos[_astarId].astarStatusAtEnd;
        astarHpAtEnd = adventureInfos[_astarId].astarHpAtEnd;
        //astarLv = _calc_level(astarStatusAtEnd[3]);
        recallFloorLevel = adventureInfos[_astarId].recallFloorLevel;
        masterSeed = adventureInfos[_astarId].masterSeed;
        endTime = adventureInfos[_astarId].endTime;
        nftIdOfHoM = adventureInfos[_astarId].nftIdOfHoM;
        astarAdd = adventureInfos[_astarId].astarAdd;
    }
    
    // past adventure info
    // astarId => adventureNum => info
    mapping (uint => mapping (uint => adventureInfo)) public pastAdventureInfos;
    // getter
    function call_pastAdventureInfos (uint _astarId, uint _num) external whenNotPaused view returns (
        bool inAdventure,
        bool isAlive,
        uint embarkTime,
        uint embarkFloor,
        uint[8] memory astarStatus,    // MaxHP, ATK, DEF, EXP
        uint[8] memory astarStatusAtEnd, // HP, ATK, DEF, EXP
        uint astarHpAtEnd,
        uint recallFloorLevel,
        uint masterSeed,
        uint endTime,
        uint[8] memory nftIdOfHoM,
        uint[3] memory astarAdd   // HP, ATK, DEF, add point per level-up
    ) {
        inAdventure = pastAdventureInfos[_astarId][_num].inAdventure;
        isAlive = pastAdventureInfos[_astarId][_num].isAlive;
        embarkTime = pastAdventureInfos[_astarId][_num].embarkTime;
        embarkFloor = pastAdventureInfos[_astarId][_num].embarkFloor;
        astarStatus = pastAdventureInfos[_astarId][_num].astarStatus;
        astarStatusAtEnd = pastAdventureInfos[_astarId][_num].astarStatusAtEnd;
        astarHpAtEnd = pastAdventureInfos[_astarId][_num].astarHpAtEnd;
        recallFloorLevel = pastAdventureInfos[_astarId][_num].recallFloorLevel;
        masterSeed = pastAdventureInfos[_astarId][_num].masterSeed;
        endTime = pastAdventureInfos[_astarId][_num].endTime;
        nftIdOfHoM = pastAdventureInfos[_astarId][_num].nftIdOfHoM;
        astarAdd = pastAdventureInfos[_astarId][_num].astarAdd;
    }
    
    // astar info
    struct astarInfo {
        uint[64] rewardItems;
        uint countOfAdventure;
        uint countOfLose;
        uint floorReached;
        uint countOfVictory;
        bool[12] defeatedBosses;
        bool[24] earnedProofs;
        uint totalExp;
    }
    mapping (uint => astarInfo) public astarInfos;  // astarId => info
    // getter
    function call_astarInfo (uint _astarId) external whenNotPaused view returns (
        uint[64] memory rewardItems,
        uint countOfAdventure,
        uint countOfLose,
        uint floorReached,
        uint countOfVictory,
        bool[12] memory defeatedBosses,
        bool[24] memory earnedProofs,
        uint totalExp
    ) {
        rewardItems = astarInfos[_astarId].rewardItems;
        countOfAdventure = astarInfos[_astarId].countOfAdventure;
        countOfLose = astarInfos[_astarId].countOfLose;
        floorReached = astarInfos[_astarId].floorReached;
        countOfVictory = astarInfos[_astarId].countOfVictory;
        defeatedBosses = astarInfos[_astarId].defeatedBosses;
        earnedProofs = astarInfos[_astarId].earnedProofs;
        totalExp = astarInfos[_astarId].totalExp;
    }
    
    
    //--- embark adventure
    
    // embark adventure
    // args: astar ID, NFT list of HoM, recall floor level
    function embarkAdventure (
        uint _astarId, 
        uint[8] memory _nftIds, 
        uint _recallFloorLevel
    ) external nonReentrant whenNotPaused {
        
        // check astar ID
        require(_checkEmbarkAdventure(_astarId, msg.sender));
        
        // check NFTs
        require(_checkNFTs(_astarId, _nftIds, msg.sender));
        
        // update parameters
        _setAdventureInfo(_astarId, _nftIds, _recallFloorLevel);
    }
    
    // internal, check astar ID 
    function _checkEmbarkAdventure (uint _astarId, address _wallet) public view returns (bool) {
        //***TODO*** check astarId
        // HoMを参照してastarの所有者をチェックする
        require(adventureInfos[_astarId].inAdventure == false);
        return true;
    }
    
    // internal, chekc NFT
    function _checkNFTs (uint _astarId, uint[8] memory _nftIds, address _wallet) public view returns (bool) {
        //***TODO*** check NFT
        // Homを参照して所有者チェック
        return true;
    }
    
    // internal, update adventure parameters
    function _setAdventureInfo (
        uint _astarId,
        uint[8] memory _nftIds, 
        uint _recallFloorLevel
    ) public {
        // prepare astar status
        uint[8] memory _astarStatus = _get_astarStatus(_astarId);
        // prepare master seed
        uint _masterSeed = _get_masterSeed(_astarId);
        // prepare status add point
        uint[3] memory _astarAdd = _get_astarAdd(_nftIds);
        // initialize adventure info
        adventureInfos[_astarId] = adventureInfo(
            true,
            true,
            block.timestamp,
            1,
            _astarStatus,
            _astarStatus,
            _astarStatus[0], // HP
            _recallFloorLevel,
            _masterSeed,
            0,
            _nftIds,
            _astarAdd
        );
    }
    
    // internal, get astar status
    function _get_astarStatus (uint _astarId) public view returns (uint[8] memory) {
        //***TODO*** astar status
        // 装備品による初期ブーストなどの計算する
        // initial astar status
        uint[8] memory _astarStatus = [uint(500), 50, 50, 0, 1, 0, 0, 0];
        // when astar is alive, get previous status from current adventure info
        if (adventureInfos[_astarId].isAlive) {
            _astarStatus = adventureInfos[_astarId].astarStatusAtEnd;
        }
        return _astarStatus;
    }
    
    // internal, get master seed for the current adventure
    function _get_masterSeed (uint _astarId) public view returns (uint) {
        // generate seed, 0-65534
        string memory _input = string(
            abi.encodePacked(
                block.timestamp,
                blockhash(block.number - 1),
                block.coinbase,
                _astarId,
                msg.sender
            )
        );
        return uint256(keccak256(abi.encodePacked(_input))) % 65535;
    }
    
    // internal, get astar add point per level-up
    function _get_astarAdd (uint[8] memory _nftIds) public view returns (uint[3] memory) {
        //***TODO*** add point
        // 加護につけるNFTや武器などによって成長率に加算する
        return [uint(10), 1, 1];
    }
        
    
    //--- end adventure
    
    // arg: just astar ID
    function endAdventure (
        uint _astarId
    ) external nonReentrant whenNotPaused {
        
        //***TODO*** reward
        // rewardの処理を考える
        // 持っていくのか、取得したものはどうするのか、帰還時にどこに加算するのか
        
        // check astar ID
        require(_checkEndAdventure(_astarId, msg.sender));
        
        // get current floor infos
        (
            uint _clearedFloorLevel,    // cloared floor leve, not greater than recall floor level
            bool _isEndable,    // when reached to the recall floor level or dead -> true
            bool _isAlive,  // when HP > 0 at the end of battles in the current floor -> true
            uint _astarHp,
            uint[8] memory _astarStatus,    // hpMax, atk, def, exp
            uint[64] memory _rewardItems    // accumulated items from embark level to current level
        ) = _get_clearedFloorLevelAndInfos(_astarId);
        
        // check endable
        require(_isEndable);
        
        // when not alive, just isAlive=false
        // calc total exp and check proof gain
        if (!_isAlive) {
            adventureInfos[_astarId].isAlive = false;
            _updateExpAndCheckProof(_astarId, _astarStatus);
        }
        
        // when alive and reached the recall floor leve, update status and reward items
        if (_isAlive) {
            // update astar status
            adventureInfos[_astarId].astarStatusAtEnd = _astarStatus;
            adventureInfos[_astarId].astarHpAtEnd = _astarHp;
            astarInfos[_astarId].rewardItems = _rewardItems;
        }
        
        // end adventure
        _endAdventure(_astarId, _clearedFloorLevel);
    }
    
    // internal, check astar ID
    function _checkEndAdventure (uint _astarId, address _wallet) public view returns (bool) {
        //***TODO*** astar id
        // 所有権のチェック
        require(adventureInfos[_astarId].inAdventure == true);
        return true;
    }
    
    // internal, get cleared floor level
    function _get_clearedFloorLevelAndInfos (uint _astarId) public view returns (
        uint,   // _clearedFloorLevel,
        bool,   // _isEndable,
        bool,   // _isAlive,
        uint,   // _astarHp,
        uint[8] memory, // astarStatus
        uint[64] memory // rewardItems
    ) {
        
        // calc current floor level
        uint _currentFloorLevel = _get_currentFloorLevel(_astarId);
        
        // prepare previous floor level
        uint _previousFloorLevel = _currentFloorLevel - 1;
        require(_previousFloorLevel > 0);   // require >0
        
        // check recall floor and update previous floor
        // when previous floor > recall floor, previous floor will be replaced to recall floor
        bool _isEndable;
        if (adventureInfos[_astarId].recallFloorLevel < _previousFloorLevel) {
            _previousFloorLevel = adventureInfos[_astarId].recallFloorLevel;
            // when reached recall floor, endable
            _isEndable = true;
        }
        
        // calc whole adventure log from embark floor level to current floor level
        (
            uint _astarHp,  // final astar HP, HP=0 -> dead, HP>0 -> alive
            uint[8] memory _astarStatus,   // maxHP, ATK, DEF, Exp
            uint[64] memory _rewardItems    // items possesed before adv. + items rewarded during adv.
        ) = _calc_adventureLog(_astarId, _previousFloorLevel);
        
        // judge alive or dead, and endable or not
        bool _isAlive;
        if (_astarHp > 0) {
            _isAlive = true;
        } else {
            // when dead, endable
            _isEndable = true;
        }
        
        return (
            _previousFloorLevel,
            _isEndable,
            _isAlive,
            _astarHp,
            _astarStatus,
            _rewardItems
        );
    }
    
    // internal, get current floor level depends on delta sec
    function _get_currentFloorLevel (uint _astarId) public view returns (uint) {
        uint _deltaSec = block.timestamp - adventureInfos[_astarId].embarkTime;
        uint _currentFloorLevel = adventureInfos[_astarId].embarkFloor + _deltaSec / TIME_PER_FLOOR;
        return _currentFloorLevel;
    }
    
    // internal, calc whole adventure log from embark floor to previous floor
    function _calc_adventureLog (uint _astarId, uint _previousFloorLevel) public view returns (
        uint _astarHp,  // final astar HP
        uint[8] memory _astarStatus,    // max HP, ATK, DEF, EXP, after level-up
        uint[64] memory _rewardItems    // items possessed before adv. + items rewarded during adv.
    ) {
        
        // prepare astar status at the embark adventure
        _astarStatus = _get_astarStatus(_astarId);  // maxHP, ATK, DEF, Exp
        _rewardItems = astarInfos[_astarId].rewardItems;
        
        // calc astat status at the end of each floor level
        uint _numberOfEnemyDefeated;
        for (uint i=adventureInfos[_astarId].embarkFloor; i<_previousFloorLevel+1;) {
            
            // get result of the floor: final astar HP, number of enemy defeated, accumulated items
            // the adventure result will be calculated depending on the astar max HP
            // (the astar HP will be recovered at earch tyming of floor cleared)
            (_astarHp, _numberOfEnemyDefeated, _rewardItems) = _calc_floorClear(
                _astarStatus,   // max HP, ATK, DEF, EXP(not required)
                i,  // floor level
                adventureInfos[_astarId].masterSeed,
                _rewardItems    // accumulated items
            );
            
            // check alive
            if (_astarHp > 0) {
                // calc exp and try level-up
                uint _astarExpAdd = _calc_expAdd(i, _numberOfEnemyDefeated);
                uint _deltaAstarLevel = _calc_deltaAstarUp(_astarStatus[3], _astarExpAdd);
                // update status depends on level-up
                _astarStatus[0] += adventureInfos[_astarId].astarAdd[0] * _deltaAstarLevel; // max HP
                _astarStatus[1] += adventureInfos[_astarId].astarAdd[1] * _deltaAstarLevel; // ATK
                _astarStatus[2] += adventureInfos[_astarId].astarAdd[2] * _deltaAstarLevel; // DEF
                _astarStatus[3] += _astarExpAdd; // EXP
            } else {
                // when dead, break the loop with 0 value of astar HP
                break;
            }
            
            // increment
            unchecked {
                i++;
            }
        }
        return (_astarHp, _astarStatus, _rewardItems);
    }
    
    // internal, calc exp add point depends on the number of enemy defeated and floor level
    function _calc_expAdd (uint _floorLevel, uint _numberOfEnemyDefeated) public view returns (uint) {
        //***TODO*** exp add
        return _numberOfEnemyDefeated*10;
    }
    
    // internal, calc delta level-up of astar depending on previous exp and added exp
    function _calc_deltaAstarUp (uint _previousExp, uint _expAdd) public pure returns (uint) {
        uint _previousLevel = _calc_level(_previousExp);
        uint _currentLevel = _calc_level(_previousExp + _expAdd);
        return _currentLevel - _previousLevel;
    }
    
    // internal, define astar level from astar exp
    function _calc_level (uint _exp) public pure returns (uint _level) {
        //***TODO*** astar Lv
        if (_exp >= 122500) {
            _level = 50;
        } else if (_exp >= 117600) {
            _level = 49;
        } else if (_exp >= 112800) {
            _level = 48;
        } else if (_exp >= 108100) {
            _level = 47;
        } else if (_exp >= 103500) {
            _level = 46;
        } else if (_exp >= 99000) {
            _level = 45;
        } else if (_exp >= 94600) {
            _level = 44;
        } else if (_exp >= 90300) {
            _level = 43;
        } else if (_exp >= 86100) {
            _level = 42;
        } else if (_exp >= 82000) {
            _level = 41;
        } else if (_exp >= 78000) {
            _level = 40;

        } else if (_exp >= 19000) {
            _level = 20;
        } else if (_exp >= 17100) {
            _level = 19;
        } else if (_exp >= 15300) {
            _level = 18;
        } else if (_exp >= 13600) {
            _level = 17;
        } else if (_exp >= 12000) {
            _level = 16;
        } else if (_exp >= 10500) {
            _level = 15;
        } else if (_exp >= 9100) {
            _level = 14;
        } else if (_exp >= 7800) {
            _level = 13;
        } else if (_exp >= 6600) {
            _level = 12;
        } else if (_exp >= 5500) {
            _level = 11;

        } else if (_exp >= 4500) {
            _level = 10;
        } else if (_exp >= 3600) {
            _level = 9;
        } else if (_exp >= 2800) {
            _level = 8;
        } else if (_exp >= 2100) {
            _level = 7;
        } else if (_exp >= 1500) {
            _level = 6;
        } else if (_exp >= 1000) {
            _level = 5;
        } else if (_exp >= 600) {
            _level = 4;
        } else if (_exp >= 300) {
            _level = 3;
        } else if (_exp >= 100) {
            _level = 2;
        } else {
            _level = 1;
        }
    }

    // internal, overhead processing at the end of adventure 
    function _endAdventure (uint _astarId, uint _clearedFloorLevel) public {
        // update current adventure info
        adventureInfos[_astarId].endTime = block.timestamp;
        adventureInfos[_astarId].inAdventure = false;
        // update astar info
        astarInfos[_astarId].countOfAdventure++;
        if (adventureInfos[_astarId].isAlive == false) {
            astarInfos[_astarId].countOfLose++;
        }
        if (astarInfos[_astarId].floorReached < _clearedFloorLevel) {
            astarInfos[_astarId].floorReached = _clearedFloorLevel;
        }
        // store past adventure info
        pastAdventureInfos[_astarId][astarInfos[_astarId].countOfAdventure] = adventureInfos[_astarId];
        // ***TODO*** nft transfer
        // nftを返還する
    }
    
    // internal, judge floor clear
    // calc final astar HP and rewards from astar status and floor level
    function _calc_floorClear (
        uint[8] memory _astarStatus,    // max HP, ATK, DEF, EXP(not required)
        uint _floorLevel,
        uint _masterSeed,
        uint[64] memory _rewardItems
    ) public view returns (
        uint,   // _astarHp
        uint,   // _numberOfEnemyDefeated,
        uint[64] memory // rewardItems
    ) {
        
        // prepare enemy id list from floor level
        uint[10] memory _enemyIds = _get_enemyIds(_floorLevel, _masterSeed);
        
        // simulate battle and get HP lists
        // using the same function in the adventure log
        /*
        (
            uint[101] memory _astarHps, 
            uint[101] memory _enemyHps, 
            uint _numberOfEnemyDefeated
        ) = _simulateBattle(_astarStatus, _enemyIds, _masterSeed);

        // prepare final astar HP at the end of floor
        uint _astarHp = _astarHps[100];
        */
        
        // simulate battle simple
        (
            uint _astarHp,
            uint _numberOfEnemyDefeated
        ) = _simulateBattleSimple(_astarStatus, _enemyIds, _masterSeed);
        
        
        // when alive, update reward items
        if (_astarHp > 0) {
            _rewardItems = _update_rewardItems(
                _floorLevel, 
                _masterSeed, 
                _numberOfEnemyDefeated, 
                _rewardItems
            );
        }
        
        return (
            _astarHp,
            _numberOfEnemyDefeated,
            _rewardItems
        );
    }
    
    // internal, get enemy id list from floor level
    function _get_enemyIds (uint _floorLevel, uint _seed) public view returns (uint[10] memory) {
        //***TODO*** enemy list
        /*
        uint[10] memory _enemyIds = [
            uint(_floorLevel),
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel
            ];
        */
        uint[10] memory _enemyIds = [ uint(1), 1,1,1,1,1,1,1,1,1];
        return _enemyIds;
    }
    
    // internal, prepare enemu status from enemy ID
    // return enemyId itself as the 4th value
    function _get_enemyStatus (uint _enemyId) public view returns (uint[8] memory) {
        uint _enemyHp = _table_enemyHp[_enemyId];
        uint _enemyAtk = _table_enemyAtk[_enemyId];
        uint _enemyDef = _table_enemyDef[_enemyId];
        return [_enemyHp, _enemyAtk, _enemyDef, _enemyId, 0, 0, 0, 0];
    }
    
    // internal, update reward items depends on floor leve
    // previous item list -> accumulated item list
    function _update_rewardItems (
        uint _floorLevel, 
        uint _seed, 
        uint _numberOfEnemyDefeated,
        uint[64] memory _rewardItems
    ) public view returns (uint[64] memory) {
        //***TODO*** reward items
        _rewardItems[1]++;
        _rewardItems[2]++;
        _rewardItems[3]++;
        return _rewardItems;
    }
    
    // internal, update total Exp and check proof obtaining
    function _updateExpAndCheckProof (uint _astarId, uint[8] memory _astarStatus) public {
        // update total Exp
        uint _totalExp = astarInfos[_astarId].totalExp + _astarStatus[3];
        astarInfos[_astarId].totalExp = _totalExp;
        // check and obtain proof
        if (_totalExp >= 7800 *100) {
            astarInfos[_astarId].earnedProofs[11] = true;
        }
        if (_totalExp >= 6600 *100) {
            astarInfos[_astarId].earnedProofs[10] = true;
        }
        if (_totalExp >= 5500 *100) {
            astarInfos[_astarId].earnedProofs[9] = true;
        }
        if (_totalExp >= 4500 *100) {
            astarInfos[_astarId].earnedProofs[8] = true;
        }
        if (_totalExp >= 3600 *100) {
            astarInfos[_astarId].earnedProofs[7] = true;
        }
        if (_totalExp >= 2800 *100) {
            astarInfos[_astarId].earnedProofs[6] = true;
        }
        if (_totalExp >= 2100 *100) {
            astarInfos[_astarId].earnedProofs[5] = true;
        }
        if (_totalExp >= 1500 *100) {
            astarInfos[_astarId].earnedProofs[4] = true;
        }
        if (_totalExp >= 1000 *100) {
            astarInfos[_astarId].earnedProofs[3] = true;
        }
        if (_totalExp >= 600 *100) {
            astarInfos[_astarId].earnedProofs[2] = true;
        }
        if (_totalExp >= 300 *100) {
            astarInfos[_astarId].earnedProofs[1] = true;
        }
        if (_totalExp >= 100 *100) {
            astarInfos[_astarId].earnedProofs[0] = true;
        }
    }
    
    
    //--- adventure log

    // art: astar ID, adventure number, astar status, astar level-up point
    // return: enemy ID list, HP change lists, final astar status, accumulative reward items
    function adventureLog (
        uint _astarId,
        uint _adventureNum,
        uint[8] memory _astarStatus, 
        uint[4] memory _astarAdd,
        uint _floorLevel
    ) external whenNotPaused view returns (
        uint[10] memory _enemyIds,
        uint[101] memory _astarHps,
        uint[101] memory _enemyHps,
        uint[8] memory _endAstarStatus,
        uint[64] memory _rewardItems
    ) {
    
        // check integrity of parameters
        require(_check_adventureLog(_astarId, _adventureNum, _floorLevel));
        
        // prepare seed
        uint _seed;
        // when adventure num == 0, seed = master seed of current adventure
        if (_adventureNum == 0) {
            _seed = adventureInfos[_astarId].masterSeed;
        // else, seed = master seed of past adventure
        } else {
            _seed = pastAdventureInfos[_astarId][_adventureNum].masterSeed;
        }
        return(_adventureLog(
            _astarStatus, 
            _astarAdd,
            _seed,
            _floorLevel
        ));
    }
    
    // internal, check the integrity of log parameters
    function _check_adventureLog (
        uint _astarId, 
        uint _adventureNum, 
        uint _floorLevel
    ) public view returns (bool) {
        //***TODO*** check adv.
        // astarIdとadventure numberをチェックし、
        // すでに出発済みの冒険でしかlogを生成させない
        return true;
    }

    // internal, generate all adventure log infos 
    // from astar status, astar level-up point, floor level, and seed
    // return: enemy ID list, astar hp list, enemy hp list, astar status at the end, accumulated reward items
    function _adventureLog (
        uint[8] memory _astarStatus, 
        uint[4] memory _astarAdd,
        uint _seed,
        uint _floorLevel
    ) public view returns (
        uint[10] memory _enemyIds,
        uint[101] memory _astarHps,
        uint[101] memory _enemyHps,
        uint[8] memory _endAstarStatus,
        uint[64] memory _rewardItems
    ) {
    
        // prepare end status at first
        _endAstarStatus = _astarStatus;

        // prepare enemy id
        _enemyIds = _get_enemyIds(_floorLevel, _seed+_floorLevel);
        
        // calc whole HP change list and enemy defeated count from astar status and enemy ID list
        uint _numberOfEnemyDefeated;
        (
            _astarHps, 
            _enemyHps, 
            _numberOfEnemyDefeated
        ) = _simulateBattle(_astarStatus, _enemyIds, _seed);
        
        // when alive, update astar status
        if (_astarHps[100] > 0) {

            // calc exp and try level-up
            uint _astarExpAdd = _calc_expAdd(_floorLevel, _numberOfEnemyDefeated);
            uint _deltaAstarLevel = _calc_deltaAstarUp(_astarStatus[3], _astarExpAdd);

            // update end astar status
            _endAstarStatus[0] += _astarAdd[0] * _deltaAstarLevel;
            _endAstarStatus[1] += _astarAdd[1] * _deltaAstarLevel;
            _endAstarStatus[2] += _astarAdd[2] * _deltaAstarLevel;
            _endAstarStatus[3] += _astarExpAdd;
            
            // update reward items
            _rewardItems = _update_rewardItems(_floorLevel, _numberOfEnemyDefeated, _seed, _rewardItems);
        
        // when not alive, final HP = 0
        } else {
            _endAstarStatus[0] = 0;
        }
        
        return (
            _enemyIds,
            _astarHps,
            _enemyHps,
            _endAstarStatus,
            _rewardItems
        );
    }

    // internal, simulate battle result, also used in the endAdventure()
    // arg: astar status, enemy ID list
    // return: whole HP change list and number of enemy defeated
    function _simulateBattle (
        uint[8] memory _astarStatus, 
        uint[10] memory _enemyIds,
        uint _seed
    ) public view returns (
        uint[101] memory _astarHps, // [100] = final astar HP
        uint[101] memory _enemyHps,
        uint _numberOfEnemyDefeated
    ) {

        // prepare HPs
        uint _astarHp = _astarStatus[0];

        // prepare current astar HP
        _astarHps[0] = _astarHp;
        
        // prepare index (cumulative number of battles in the floor)
        uint _index = 1;

        // simulat each battle
        for (uint i=0; i<10;) {
            
            // prepare enemy ID and status
            uint _enemyId = _enemyIds[i];
            uint[8] memory _enemyStatus = _get_enemyStatus(_enemyId);
            uint _enemyHp = _enemyStatus[0];
            
            // prepare elem and resi
            // when Astar attack is resisted, Astar ATK /2
            // to avoid stack too deep error, enemy DEF = Astar ATK /2
            if ( _checkElementResistance(_astarStatus[4], _enemyStatus[5]) ){
                _enemyStatus[2] *= _astarStatus[1]/2;
            }
            // when Enemy attack is not resisted, enemy ATK *2
            if ( !_checkElementResistance(_enemyStatus[4], _astarStatus[5]) ){
                _enemyStatus[1] *= 2;
            }
            
            // simulate each battle step
            for (uint j=0; j<10;) {
                
                // calc astar HP and enemy HP after battle step from both status
                (_astarHp, _enemyHp) = _calc_hpsOfBattleStepV2(
                    _astarHp,
                    _enemyHp,
                    _astarStatus, 
                    _enemyStatus, 
                    _seed 
                    //_index
                );
                
                // store hp change in the HP list
                _astarHps[_index] = _astarHp;
                _enemyHps[_index] = _enemyHp;
                
                // increment
                unchecked {
                    j++;
                    _index++;
                }
            }
            
            // after the battle, check enemy defeated
            if (_enemyHp == 0) {
                _numberOfEnemyDefeated++;
            }
            
            // increment
            unchecked {
                i++;
            }
        }
    }
    
    // internal, simulate battle simple
    // HP change lists were removed and asta HP final was added
    function _simulateBattleSimple (
        uint[8] memory _astarStatus, 
        uint[10] memory _enemyIds,
        uint _seed
    ) public view returns (
        uint _astarHpFinal, // added
        //uint[101] memory _astarHps, // [100] = final astar HP
        //uint[101] memory _enemyHps,
        uint _numberOfEnemyDefeated
    ) {

        // prepare HPs
        uint _astarHp = _astarStatus[0];

        // prepare current astar HP
        //_astarHps[0] = _astarHp;
        
        // prepare index (cumulative number of battles in the floor)
        //uint _index = 1;

        // simulat each battle
        for (uint i=0; i<10;) {
            
            // prepare enemy ID and status
            uint _enemyId = _enemyIds[i];
            uint[8] memory _enemyStatus = _get_enemyStatus(_enemyId);
            uint _enemyHp = _enemyStatus[0];
            
            // prepare elem and resi
            if ( _checkElementResistance(_astarStatus[4], _enemyStatus[5]) ){
                _enemyStatus[2] *= _astarStatus[1]/2;
            }
            // when Enemy attack is not resisted, enemy ATK *2
            if ( !_checkElementResistance(_enemyStatus[4], _astarStatus[5]) ){
                _enemyStatus[1] *= 2;
            }
            
            // simulate each battle step
            for (uint j=0; j<10;) {
                
                // calc astar HP and enemy HP after battle step from both status
                (_astarHp, _enemyHp) = _calc_hpsOfBattleStepV2(
                    _astarHp,
                    _enemyHp,
                    _astarStatus, 
                    _enemyStatus, 
                    _seed 
                    //_index
                );
                
                // store hp change in the HP list
                //_astarHps[_index] = _astarHp;
                //_enemyHps[_index] = _enemyHp;
                
                // increment
                unchecked {
                    j++;
                    //_index++;
                }
            }
            
            // after the battle, check enemy defeated
            if (_enemyHp == 0) {
                _numberOfEnemyDefeated++;
            }
            
            // increment
            unchecked {
                i++;
            }
        }
        
        _astarHpFinal = _astarHp;
        return(_astarHpFinal, _numberOfEnemyDefeated);
    }
    
    // internal, simulate battle step V1
    // arg: astar and enemy status, and _seed and _index for generate rnd
    // return: astar and enemy final HPs
    /*
    function _calc_hpsOfBattleStepV1 (
        uint _astarHp,
        uint _enemyHp,
        uint[4] memory _astarStatus,
        uint[4] memory _enemyStatus,
        uint _seed,
        uint _index
    ) public pure returns (
        uint,   // astarHp
        uint    // enemyHp
    ) {

        // prepare each astar status
        uint _astarAtk = _astarStatus[1];
        uint _astarDef = _astarStatus[2];

        // prepare each enemy status
        uint _enemyAtk = _enemyStatus[1];
        uint _enemyDef = _enemyStatus[2];
        uint _enemyId = _enemyStatus[3];

        // calc damage for enemy
        uint _dmgForEnemy;
        if (_astarAtk > _enemyDef) {
            _dmgForEnemy = _astarAtk - _enemyDef;
        }
        if (_astarHp == 0) {
            _dmgForEnemy = 0;
        } else {
            _dmgForEnemy += _xorshift(_seed + _enemyId + _index, 3);
        }
        
        // calc damage for astar
        uint _dmgForAstar;
        if (_enemyAtk > _astarDef) {
            _dmgForAstar = _enemyAtk - _astarDef;
        }
        if (_enemyHp == 0) {
            _dmgForAstar = 0;
        } else {
            _dmgForAstar += _xorshift(_seed + _enemyId + _index + 1, 3);
        }

        // recalc HPs
        if (_astarHp > _dmgForAstar) {
            _astarHp -= _dmgForAstar;
        } else {
            _astarHp = 0;
        }
        if (_enemyHp > _dmgForEnemy) {
            _enemyHp -= _dmgForEnemy;
        } else {
            _enemyHp = 0;
        }
        
        return (_astarHp, _enemyHp);
    }
    */

    // internal, simulate battle step V2
    // optimized by ChatGPT
    function _calc_hpsOfBattleStepV2 (
        uint _astarHp,
        uint _enemyHp,
        uint[8] memory _astarStatus,
        uint[8] memory _enemyStatus,
        uint _seed
    ) public pure returns (uint, uint) {
        uint _astarAtk = _astarStatus[1];
        uint _astarDef = _astarStatus[2];
        uint _enemyAtk = _enemyStatus[1];
        uint _enemyDef = _enemyStatus[2];

        uint _dmgForEnemy = _astarHp > 0 ? (_astarAtk > _enemyDef ? _astarAtk - _enemyDef : 0) + _xorshift(_seed + _astarHp, 5) : 0;
        uint _dmgForAstar = _enemyHp > 0 ? (_enemyAtk > _astarDef ? _enemyAtk - _astarDef : 0) + _xorshift(_seed + _astarHp + 1, 5) : 0;

        _astarHp = _astarHp > _dmgForAstar ? _astarHp - _dmgForAstar : 0;
        _enemyHp = _enemyHp > _dmgForEnemy ? _enemyHp - _dmgForEnemy : 0;

        return (_astarHp, _enemyHp);
    }

    // internal, xorshift to generate rnd
    function _xorshift (uint _seed, uint _num) public pure returns (uint) {
        _seed ^= (_seed << 13);
        _seed ^= (_seed >> 17);
        _seed ^= (_seed << 5);
        return _seed % _num + 1;    // ignore 0 damage
    }


    //--- codex

    // reward EXP list for each floor breakthrough
    uint[11] public _table_expList = [
        0,  // 0F, dummy
        100,
        200,
        400,
        800,
        1600,
        3200,
        6400,
        12800,
        256000,
        512000
    ];
    
    uint[10] public _table_enemyHp = [
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
        1000
    ];

    uint[10] public _table_enemyAtk = [
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100
    ];

    uint[10] public _table_enemyDef = [
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100
    ];
    
    
    //--- admin
    
    // modify time per floor
    function admin_set_TIME_PER_FLOOR (uint _val) external onlyOwner {
        TIME_PER_FLOOR = _val;
    }
    
    // override adventure info
    function admin_modify_adventureInfo1 (
        uint _astarId,
        bool inAdventure,
        bool isAlive,
        uint embarkTime,
        uint embarkFloor,
        uint[8] memory astarStatus,
        uint[8] memory astarStatusAtEnd
    ) external onlyOwner {
        adventureInfos[_astarId].inAdventure = inAdventure;
        adventureInfos[_astarId].isAlive = isAlive;
        adventureInfos[_astarId].embarkTime = embarkTime;
        adventureInfos[_astarId].embarkFloor = embarkFloor;
        adventureInfos[_astarId].astarStatus = astarStatus;
        adventureInfos[_astarId].astarStatusAtEnd = astarStatusAtEnd;
    }
    function admin_modify_adventureInfo2 (
        uint _astarId,
        uint astarHp,
        uint recallFloorLevel,
        uint masterSeed,
        uint endTime,
        uint[8] memory nftIdOfHoM,
        uint[3] memory astarAdd
    ) external onlyOwner {
        adventureInfos[_astarId].astarHpAtEnd = astarHp;
        adventureInfos[_astarId].recallFloorLevel = recallFloorLevel;
        adventureInfos[_astarId].masterSeed = masterSeed;
        adventureInfos[_astarId].endTime = endTime;
        adventureInfos[_astarId].nftIdOfHoM = nftIdOfHoM;
        adventureInfos[_astarId].astarAdd = astarAdd;
    }
}


//---old

/*

    階層テーマ案：
        なにもなしフロア
            単純に階層ごとに強さが徐々にインフレする
        物理耐性層
            何かしらの属性を付与しないと攻撃が通らない
        火炎攻撃層
            火炎属性でATK高めに設定
            火炎耐性必須
        火炎＋冷気攻撃層
            火炎・冷気耐性必須
        4元素攻撃層
            4元素耐性を確保するまで苦戦を強いられる
        上位属性層
            威力の高い上位属性１種類を多用する層
            4元素は相変わらず必須
        上位属性複数層
            威力の高い上位属性２種類を多用する層
            4元素は相変わらず必須
        雷しか通らない層
            物理耐性を含め、雷以外の全耐性を有する敵が頻出する
        タフ層
            単純に高いATKを要求してくる層
            耐性抜けをついても厳しい

    階層案
        前提
            すべての階層で、最初の1-3Fは対策なしでも死なない
                その階の雰囲気を探るお試し階
            最初の1-3Fでその階層の解答を収集する
            後半のフロア数では、前階層のレアアイテムが潤沢に入手できる
            後半のフロアで準備し、最終フロアのクエストボスに挑む
            bossを倒せば、次の回へのrecallが解禁される
        1-10F: ノーマル
            属性攻撃なし・耐性なし
            階層に応じてATK/DEFが増えた敵が出現する
            boss: ATK/DEF高め
            reward: 特徴特になし
        11-20F: 火炎攻撃フロア
            耐性なし・火炎属性の攻撃が頻出
            防具に火炎耐性を付与しないと突破が難しい
            boss: 火炎攻撃, 火炎耐性で突破可能
            reward: 耐火ポーション, 耐火装備
        21-30F: 冷気攻撃フロア
            耐性なし・冷気属性の攻撃が頻出
            冷気耐性必須
            boss: 冷気攻撃, 冷気耐性で突破可能
            reward: 耐冷ポーション, 耐冷装備
        31-40F: 四元素フロア・物理耐性
            何かしらの四元素攻撃を行う敵が頻出
            四元素すべての耐性を確保しないと運ゲー
            殆どが物理耐性持ち。
            こちらも何かしらの属性攻撃を付与しないと攻撃が通らない
            boss: 四元素攻撃・物理耐性, 四元素耐性と属性攻撃で突破可能
            reward: 火炎属性付与ポーション, 火炎武器
        41-50F: 毒攻撃フロア・物理耐性
            全員が毒耐性を行う
            四元素耐性を全員が持つ
            なんとかして毒耐性を付けないと厳しい
            何かしらの属性攻撃が必須
            boss: 四元素毒攻撃・物理耐性, 毒耐性と属性攻撃で突破可能
            reward: 耐性ポーション, 元素耐性装備
        51-60F: 暗黒攻撃フロア
            全員が暗黒攻撃を行う
            boss: 暗黒攻撃・物理耐性, 暗黒耐性で突破可能
        61-70F: 地獄攻撃フロア
            全員が暗黒＋地獄攻撃を行う
            boss: 暗黒＋地獄攻撃・物理耐性, 地獄耐性で突破可能
        71-80F: 混沌攻撃フロア
            全員が暗黒＋地獄＋混沌攻撃を行う
            boss: 暗黒＋地獄＋混沌攻撃・物理耐性, 混沌耐性で突破可能
        81-90F: ガチンコフロア
            無属性攻撃・無耐性
            HP/ATK/DEFが純粋に高い
            boss: 高ステータス, 良い武具が必須
        91-98F: 全属性攻撃・物理四元素耐性
            全耐性の網羅が必須
            何かしらの上位属性攻撃が必須
            最初は薬で一時的に攻撃属性を付与し、いずれは恒常的な属性付与された武器を見つける
        99F: ETH, the Queen戦
            1種類の上位耐性抜け
            日によって抜けてる耐性が変化する
            全属性の攻撃
            全耐性と耐性抜けを突いた武器の用意が必須
        100F: BTC, the King戦
            全耐性・全属性攻撃
            限界成長率のLv50+優秀な武器・防具で踏破可能
            育成計画こそが全て。

*/