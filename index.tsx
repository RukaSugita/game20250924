import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// Data for each quiz version
const jrEastStations = [
  { name: "東京", line: "JR山手線・中央線など", hints: ["日本の首都を代表するターミナル", "丸の内や八重洲口がある", "多くの新幹線が発着する", "赤レンガの駅舎が象徴的"] },
  { name: "新宿", line: "JR山手線・中央線など", hints: ["世界一乗降客数が多い", "東京都庁の最寄り", "JR山手線や中央線などが乗り入れる", "多くの百貨店が集まる商業の中心地"] },
  { name: "渋谷", line: "JR山手線・埼京線など", hints: ["忠犬の像がある", "スクランブル交差点が有名", "若者文化の発信地", "JR山手線や埼京線が乗り入れる"] },
  { name: "横浜", line: "JR東海道線・根岸線など", hints: ["神奈川県最大のターミナル", "そごうや高島屋が直結", "JR東海道線、根岸線、横須賀線などが集まる", "駅の愛称は「ハマの玄関口」"] },
  { name: "品川", line: "JR山手線・京浜東北線など", hints: ["リニア中央新幹線の始発駅予定地", "JR山手線と京急本線の乗り換え駅", "水族館が併設されたホテルがある", "羽田空港へのアクセスが良い"] },
  { name: "池袋", line: "JR山手線・埼京線など", hints: ["サンシャインシティが有名", "JR山手線、埼京線、湘南新宿ラインが乗り入れる", "芸術劇場がある文化の街", "東口と西口で街の雰囲気が大きく異なる"] },
  { name: "上野", line: "JR山手線・京浜東北線など", hints: ["アメヤ横丁が近い", "多くの博物館や美術館が集まる公園がある", "JR山手線や京浜東北線が乗り入れる", "北の玄関口と呼ばれた歴史を持つ"] },
  { name: "秋葉原", line: "JR山手線・総武線など", hints: ["電気街として有名", "ポップカルチャーの中心地", "JR山手線とJR総武線が交差する", "つくばエクスプレスの始発駅"] },
  { name: "川崎", line: "JR東海道線・京浜東北線など", hints: ["音楽の街として知られる", "ラゾーナという大きな商業施設が直結", "JR東海道線とJR京浜東北線が停車", "多摩川を挟んで首都と隣接"] },
  { name: "千葉", line: "JR総武線など", hints: ["県庁所在地の中心", "都市モノレールに乗り換え可能", "そごうがランドマーク", "JR総武線と房総方面の路線の分岐点"] },
  { name: "吉祥寺", line: "JR中央線・総武線", hints: ["井の頭恩賜公園がすぐそば", "住みたい街ランキングで常に上位", "JR中央線・JR総武線が利用可能", "京王井の頭線の始発・終着駅"] },
  { name: "恵比寿", line: "JR山手線・埼京線", hints: ["ビール記念館があるガーデンプレイス", "おしゃれな飲食店が多い", "JR山手線で渋谷と目黒の間", "JR埼京線も乗り入れている"] },
  { name: "中野", line: "JR中央線・総武線", hints: ["サブカルの聖地「ブロードウェイ」がある", "サンプラзаがランドマークだった", "JR中央・総武線が乗り入れる", "東京メトロ東西線が直通運転"] },
  { name: "立川", line: "JR中央線・南武線など", hints: ["多摩地域最大のターミナル", "国営昭和記念公園の最寄り", "JR中央線、JR南武線、JR青梅線が乗り入れる", "多摩モノレールに乗り換え可能"] },
  { name: "舞浜", line: "JR京葉線", hints: ["巨大なテーマパークの最寄り", "JR京葉線にある", "発車メロディがテーマパークの曲", "駅前に大きな商業施設イクスピアリがある"] },
  { name: "有楽町", line: "JR山手線・京浜東北線", hints: ["銀座や日比谷に隣接", "国際フォーラムの最寄り", "JR山手線で東京駅と新橋駅の間", "ガード下の飲み屋街が有名"] },
  { name: "高田馬場", line: "JR山手線", hints: ["多くの学生で賑わう街", "早稲田大学の最寄り駅の一つ", "JR山手線と西武新宿線が乗り入れる", "手塚治虫のアトムの舞台としても知られる"] },
  { name: "桜木町", line: "JR根岸線", hints: ["横浜みなとみらい21地区の玄関口", "ランドマークタワーや赤レンガ倉庫が近い", "JR根岸線（京浜東北線）の駅", "昔は東海道本線の終着駅だった歴史を持つ"] },
  { name: "御茶ノ水", line: "JR中央線・総武線", hints: ["神田川の上にホームがある", "楽器店街や古書店街が有名", "JR中央線と総武線が乗り入れる", "多くの大学や病院が集まる文教地区"] },
];

const privateRailwaysStations = [
    { name: "下北沢", line: "小田急線・京王井の頭線", hints: ["古着屋や小劇場が多いサブカルの街", "「シモキタ」の愛称で親しまれる", "小田急線と京王井の頭線が乗り入れる", "カレーの激戦区としても有名"] },
    { name: "自由が丘", line: "東急東横線・大井町線", hints: ["おしゃれな雑貨店やカフェが多い", "「スイーツの激戦区」として知られる", "東急東横線と東急大井町線が交差する", "ラ・ヴィータというベネチア風の商業施設がある"] },
    { name: "元町・中華街", line: "みなとみらい線", hints: ["日本三大チャイナタウンの一つ", "おしゃれな商店街がある", "みなとみらい線の終着駅", "山下公園や港の見える丘公園が近い"] },
    { name: "押上", line: "東武スカイツリーラインなど", hints: ["巨大な電波塔のふもとにある", "「スカイツリー前」という副駅名がある", "東武スカイツリーライン、京成押上線が乗り入れる", "ソラマチという商業施設が広がる"] },
    { name: "武蔵小杉", line: "東急東横線・目黒線など", hints: ["タワーマンションが林立する川崎市の駅", "JR南武線、東急東横線、東急目黒線が乗り入れる", "近年、再開発で大きく変貌した", "グランツリーという商業施設がある"] },
    { name: "中目黒", line: "東急東横線", hints: ["川沿いの桜並木が有名", "おしゃれなカフェや古着屋が集まる", "東急東横線と東京メトロ日比谷線が乗り入れる", "高架下がおしゃれな店舗街になっている"] },
    { name: "代官山", line: "東急東横線", hints: ["蔦屋書店がランドマークの一つ", "おしゃれなセレクトショップが多い", "大使館が点在する国際的なエリア", "東急東横線で渋谷の隣の駅"] },
    { name: "浅草", line: "東武スカイツリーラインなど", hints: ["雷門や仲見世通りで有名", "東武スカイツリーラインの始発駅", "東京メトロ銀座線も利用できる", "隅田川のほとりに位置し、屋形船が楽しめる"] },
    { name: "三軒茶屋", line: "東急田園都市線・世田谷線", hints: ["「サンチャ」の愛称で親しまれる", "東急田園都市線と東急世田谷線が乗り入れる", "キャロットタワーがランドマーク", "おしゃれなカフェや飲み屋が多い"] },
    { name: "二子玉川", line: "東急田園都市線・大井町線", hints: ["「ニコタマ」の愛称で親しまれる", "多摩川のほとりにある", "ライズという大きな商業施設がある", "東急田園都市線と東急大井町線が乗り入れる"] },
    { name: "町田", line: "小田急線", hints: ["東京都と神奈川県の境にある", "「西の渋谷」と呼ばれることもある", "小田急線とJR横浜線が乗り入れる", "多くの商業施設が集まる多摩地域の中心都市"] },
    { name: "調布", line: "京王線", hints: ["映画の街として知られる", "深大寺や神代植物公園へのバスが出ている", "京王線と京王相模原線が分岐する", "駅周辺が地下化されている"] },
];

const tokyoMetroStations = [
  { name: "銀座", line: "東京メトロ銀座線など", hints: ["高級ブランド店や百貨店が立ち並ぶ", "歌舞伎座の最寄り", "丸ノ内線、日比谷線、銀座線が乗り入れる", "和光の時計塔がランドマーク"] },
  { name: "表参道", line: "東京メトロ銀座線など", hints: ["ファッションブランドの旗艦店が多い", "ケヤキ並木が美しい", "銀座線、千代田線、半蔵門線が乗り入れる", "ヒルズという商業施設が有名"] },
  { name: "赤坂見附", line: "東京メトロ銀座線・丸ノ内線", hints: ["多くのホテルが集まるビジネス街", "永田町駅と乗り換え可能", "銀座線と丸ノ内線が乗り入れる", "皇居にも近い"] },
  { name: "永田町", line: "東京メトロ有楽町線など", hints: ["日本の政治の中心地", "国会議事堂の最寄り駅の一つ", "有楽町線、半蔵門線、南北線が乗り入れる", "赤坂見附駅と改札内で繋がっている"] },
  { name: "大手町", line: "東京メトロ丸ノ内線など", hints: ["日本の経済・金融の中心地", "皇居の東側に位置する", "5路線が乗り入れる地下鉄の巨大ターミナル", "多くの大企業の本社が集まる"] },
  { name: "日本橋", line: "東京メトロ東西線・銀座線など", hints: ["国の道路網の起点", "老舗百貨店が有名", "東西線、銀座線、都営浅草線が乗り入れる", "コレド室町などの商業施設がある"] },
  { name: "霞が関", line: "東京メトロ丸ノ内線など", hints: ["多くの省庁が集まる官庁街", "「霞が関」といえば日本の行政の中枢", "丸ノ内線、日比谷線、千代田線が乗り入れる", "国会議事堂や首相官邸にも近い"] },
  { name: "後楽園", line: "東京メトロ丸ノ内線・南北線", hints: ["巨大なドーム球場の最寄り", "遊園地やスパ施設が併設", "丸ノ内線と南北線が乗り入れる", "文京区役所が入るシビックセンターが隣接"] },
];

const shinkansenStations = [
  { name: "新函館北斗", line: "北海道新幹線", hints: ["北海道新幹線の終着駅（現在）", "北海道の南の玄関口", "函館本線との乗り換え駅", "近くにトラピスト修道院がある"] },
  { name: "新青森", line: "東北新幹線", hints: ["東北新幹線の終着駅", "奥羽本線との乗り換え駅", "ねぶた祭りで有名な市の中心からは少し離れている", "八甲田山への玄関口"] },
  { name: "盛岡", line: "東北新幹線", hints: ["東北新幹線と秋田新幹線の分岐駅", "わんこそばが有名", "岩手県の県庁所在地", "IGRいわて銀河鉄道の起点"] },
  { name: "仙台", line: "東北新幹線", hints: ["東北地方最大の都市の駅", "牛タンや笹かまぼこが名物", "伊達政宗ゆかりの地", "東北新幹線「はやぶさ」が全列車停車する"] },
  { name: "大宮", line: "東北・上越新幹線など", hints: ["多くの新幹線が分岐する埼玉のターミナル", "鉄道博物館が近くにある", "東北・上越・北陸新幹線が乗り入れる", "京浜東北線や埼京線の始発駅"] },
  { name: "名古屋", line: "東海道新幹線", hints: ["東海道新幹線の主要駅", "ひつまぶしや味噌カツが名物", "JR、名鉄、近鉄が集まる巨大ターミナル", "リニア・鉄道館がある"] },
  { name: "京都", line: "東海道新幹線", hints: ["日本の古都の玄関口", "多くの世界遺産へのアクセス拠点", "東海道新幹線が乗り入れる", "駅ビルに巨大な階段があることで有名"] },
  { name: "新大阪", line: "東海道・山陽新幹線", hints: ["東海道新幹線と山陽新幹線の接続駅", "大阪の玄関口の一つ", "JR京都線やおおさか東線に乗り換え可能", "たこ焼きやお好み焼き店が多い"] },
  { name: "岡山", line: "山陽新幹線", hints: ["山陽新幹線と山陰・四国方面の特急の接続駅", "桃太郎伝説の地", "後楽園や城が有名", "「のぞみ」が全列車停車する"] },
  { name: "広島", line: "山陽新幹線", hints: ["平和記念公園や厳島神社への玄関口", "お好み焼きが名物", "マツダスタジアムの最寄り駅", "山陽新幹線が乗り入れる"] },
  { name: "博多", line: "山陽・九州新幹線", hints: ["山陽新幹線の終着駅、九州新幹線の始発駅", "九州最大のターミナル", "ラーメンやもつ鍋が有名", "福岡空港へのアクセスが非常に良い"] },
  { name: "鹿児島中央", line: "九州新幹線", hints: ["九州新幹線の終着駅", "桜島を望む都市", "黒豚やさつま揚げが名物", "観覧車が駅ビルにある"] },
  { name: "金沢", line: "北陸新幹線", hints: ["北陸新幹線の主要駅", "兼六園や21世紀美術館が有名", "鼓門という巨大な木製の門が象徴的", "海鮮が美味しいことで知られる"] },
  { name: "新潟", line: "上越新幹線", hints: ["上越新幹線の終着駅", "日本海側最大の都市の駅", "米と日本酒が有名", "萬代橋が近くにある"] },
];

const tokyuLineStations = [
    { name: "渋谷", line: "東急東横線・田園都市線", hints: ["東急線の最大のターミナル", "スクランブル交差点が有名", "多くの路線が乗り入れるハチ公の街", "ヒカリエやストリームが直結"] },
    { name: "中目黒", line: "東急東横線", hints: ["川沿いの桜並木が有名", "おしゃれなカフェや古着屋が集まる", "東横線と日比谷線が乗り入れる", "高架下がおしゃれな店舗街になっている"] },
    { name: "自由が丘", line: "東急東横線・大井町線", hints: ["おしゃれな雑貨店やカフェが多い", "「スイーツの激戦区」として知られる", "東横線と大井町線が交差する", "ラ・ヴィータというベネチア風の商業施設がある"] },
    { name: "田園調布", line: "東急東横線", hints: ["高級住宅街として有名", "放射状に広がる街路が特徴的", "東横線と目黒線が乗り入れる", "旧駅舎が駅前に保存されている"] },
    { name: "武蔵小杉", line: "東急東横線", hints: ["タワーマンションが林立する川崎市の駅", "JR南武線、東横線、目黒線が乗り入れる", "近年、再開発で大きく変貌した", "グランツリーという商業施設がある"] },
    { name: "日吉", line: "東急東横線", hints: ["有名大学のキャンパス最寄り駅", "東横線と目黒線、グリーンラインが乗り入れる", "駅西口から放射状に商店街が伸びる", "東急新横浜線の分岐駅"] },
    { name: "横浜", line: "東急東横線", hints: ["神奈川県最大のターミナル", "東横線の終着駅", "そごうや高島屋が直結", "多くの路線が集まる「ハマの玄関口」"] },
    { name: "二子玉川", line: "東急田園都市線・大井町線", hints: ["「ニコタマ」の愛称で親しまれる", "多摩川のほとりにある", "ライズという大きな商業施設がある", "田園都市線と大井町線が乗り入れる"] },
    { name: "三軒茶屋", line: "東急田園都市線", hints: ["「サンチャ」の愛称で親しまれる", "田園都市線と世田谷線が乗り入れる", "キャロットタワーがランドマーク", "おしゃれなカフェや飲み屋が多い"] },
    { name: "大井町", line: "東急大井町線", hints: ["大井町線の終着駅", "JR京浜東北線とりんかい線に乗り換え可能", "駅前に大きな家電量販店がある", "劇団四季の劇場がある"] },
    { name: "たまプラーザ", line: "東急田園都市線", hints: ["駅周辺が美しく整備された住宅街", "田園都市線の急行停車駅", "駅直結のゲートプラザが商業の中心", "ドラマのロケ地としてよく使われる"] },
    { name: "代官山", line: "東急東横線", hints: ["蔦屋書店がランドマークの一つ", "おしゃれなセレクトショップが多い", "大使館が点在する国際的なエリア", "東横線で渋谷の隣の駅"] },
];

const fukutoshinHanzomonStations = [
    { name: "渋谷", line: "東京メトロ副都心線・半蔵門線", hints: ["東急東横線や田園都市線と直通運転", "スクランブル交差点が有名", "多くの路線が乗り入れるハチ公の街", "ヒカリエが直結している"] },
    { name: "池袋", line: "東京メトロ副都心線", hints: ["サンシャインシティが有名", "西武線や東武線と接続", "JR山手線も乗り入れる巨大ターミナル", "3つの地下鉄路線が乗り入れる"] },
    { name: "新宿三丁目", line: "東京メトロ副都心線", hints: ["伊勢丹やマルイが直結", "新宿御苑の最寄り駅の一つ", "丸ノ内線、都営新宿線が乗り入れる", "JRの駅からは少し歩く"] },
    { name: "明治神宮前", line: "東京メトロ副都心線", hints: ["「原宿」という副駅名がある", "初詣で有名な神社の最寄り", "千代田線が乗り入れる", "竹下通りの入り口に近い"] },
    { name: "北参道", line: "東京メトロ副都心線", hints: ["明治神宮の北参道に近い", "国立能楽堂の最寄り", "代々木公園も徒歩圏内", "明治神宮前と新宿三丁目の間"] },
    { name: "雑司が谷", line: "東京メトロ副都心線", hints: ["鬼子母神堂の最寄り駅", "都電荒川線と乗り換え可能", "学習院大学が近くにある", "池袋と新宿三丁目の間にある駅"] },
    { name: "和光市", line: "東京メトロ副都心線", hints: ["東武東上線との接続駅", "有楽町線も乗り入れる", "埼玉県の駅", "この路線の始発駅の一つ"] },
    { name: "表参道", line: "東京メトロ半蔵門線", hints: ["ファッションブランドの旗艦店が多い", "ケヤキ並木が美しい", "銀座線、千代田線が乗り入れる", "ヒルズという商業施設が有名"] },
    { name: "九段下", line: "東京メトロ半蔵門線", hints: ["日本武道館の最寄り駅", "靖国神社が近くにある", "東西線、都営新宿線が乗り入れる", "皇居の北側に位置する"] },
    { name: "大手町", line: "東京メトロ半蔵門線", hints: ["日本の経済・金融の中心地", "皇居の東側に位置する", "5路線が乗り入れる地下鉄の巨大ターミナル", "多くの大企業の本社が集まる"] },
    { name: "三越前", line: "東京メトロ半蔵門線", hints: ["老舗百貨店に直結", "日本橋にも近い", "銀座線も乗り入れる", "コレド室町が近い"] },
    { name: "水天宮前", line: "東京メトロ半蔵門線", hints: ["安産祈願で有名な神社の最寄り", "東京シティエアターミナルに直結", "人形町駅まで歩いて行ける", "この路線の駅"] },
    { name: "清澄白河", line: "東京メトロ半蔵門線", hints: ["現代美術館があるアートの街", "おしゃれなカフェが多いことで有名", "都営大江戸線と乗り換え可能", "美しい庭園がある"] },
    { name: "錦糸町", line: "東京メトロ半蔵門線", hints: ["JR総武線と乗り換え可能", "駅ビルに「テルミナ」がある", "東京スカイツリーにも近い", "墨田区の繁華街"] },
    { name: "押上", line: "東京メトロ半蔵門線", hints: ["巨大な電波塔のふもとにある", "「スカイツリー前」という副駅名がある", "東武スカイツリーライン、京成押上線が乗り入れる", "ソラマチという商業施設が広がる"] },
];

const quizVersions = {
  'JR東日本': jrEastStations,
  '私鉄': privateRailwaysStations,
  '東京メトロ': tokyoMetroStations,
  '東急線': tokyuLineStations,
  '副都心線、半蔵門線': fukutoshinHanzomonStations,
  '新幹線': shinkansenStations,
};
type QuizVersionKey = keyof typeof quizVersions;
type StationData = { name: string; line: string; hints: string[] };

type DifficultyKey = 'easy' | 'normal' | 'hard' | 'very-hard';
const difficulties: { key: DifficultyKey; label: string; }[] = [
    { key: 'easy', label: 'かんたん ☆' },
    { key: 'normal', label: 'ふつう ☆☆' },
    { key: 'hard', label: 'むずかしい ☆☆☆' },
    { key: 'very-hard', label: '激むず ☆☆☆☆' },
];

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

const QuizGame = ({ stationsData, onBackToMenu, quizTitle, difficulty }: { stationsData: StationData[], onBackToMenu: () => void, quizTitle: string, difficulty: DifficultyKey }) => {
  const [stations, setStations] = useState<StationData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processedStations = useMemo(() => {
    return stationsData.map(station => {
        let newHints = [...station.hints];
        switch(difficulty) {
            case 'easy':
                newHints.unshift(`路線: ${station.line}`);
                break;
            case 'hard':
                newHints = shuffleArray(newHints).slice(0, 3);
                break;
            case 'very-hard':
                newHints = shuffleArray(newHints).slice(0, 2);
                break;
            case 'normal':
            default:
                break;
        }
        return { ...station, hints: newHints };
    });
  }, [stationsData, difficulty]);


  const startNewGame = useCallback(() => {
    setStations(shuffleArray(processedStations));
    setCurrentQuestionIndex(0);
    setUserGuess('');
    setFeedback('');
    setIsAnswered(false);
  }, [processedStations]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (inputRef.current && !isAnswered) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex, isAnswered]);
  
  const handleNextQuestion = useCallback(() => {
    setIsAnswered(false);
    setFeedback('');
    setUserGuess('');
    if (currentQuestionIndex === stations.length - 1) {
        startNewGame();
    } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentQuestionIndex, stations.length, startNewGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.code === 'Space' || event.code === 'Enter') && isAnswered) {
        event.preventDefault(); 
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleNextQuestion]);

  if (stations.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-xl font-semibold">Loading Quiz...</div>
        </div>
    );
  }

  const currentStation = stations[currentQuestionIndex];

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || userGuess.trim() === '') return;

    const normalizedGuess = userGuess.replace(/駅$/, '').trim();
    const normalizedAnswer = currentStation.name.replace(/駅$/, '').trim();

    if (normalizedGuess.toLowerCase() === normalizedAnswer.toLowerCase()) {
      setFeedback('正解！ 🎉');
    } else {
      setFeedback(`不正解... 正解は「${currentStation.name}」でした。`);
    }
    setIsAnswered(true);
  };

  const handleGiveUp = () => {
    if (isAnswered) return;
    setFeedback(`正解は「${currentStation.name}」でした。`);
    setIsAnswered(true);
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full transform transition-all hover:shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">関東駅名クイズ</h1>
            <h2 className="text-lg font-semibold text-blue-600">{quizTitle}</h2>
          </div>
          <span className="text-lg font-semibold text-gray-500 tabular-nums">
            {currentQuestionIndex + 1} / {stations.length}
          </span>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">ヒント</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {currentStation.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleGuess} className="space-y-4">
          { (difficulty === 'easy' || difficulty === 'normal') &&
            <p className="text-sm text-gray-500 text-center">
              ヒント: 正解は {currentStation.name.length} 文字です
            </p>
          }
          <input
            ref={inputRef}
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            disabled={isAnswered}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="駅名を入力"
            aria-label="駅名を入力"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleGiveUp}
            disabled={isAnswered}
            className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            わからない→答えを見る
          </button>
          <button
            type="submit"
            disabled={isAnswered}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            答える
          </button>
        </form>
        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center font-semibold ${feedback.includes('正解！') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback}
          </div>
        )}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="mt-4 w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {currentQuestionIndex === stations.length - 1 ? 'もう一度プレイ' : '次の問題へ'} (Space / Enter)
          </button>
        )}
        <button onClick={onBackToMenu} className="mt-4 w-full text-center text-gray-500 hover:text-gray-700 text-sm">
            難易度選択に戻る
        </button>
      </div>
    </div>
  );
};

const QuizSelectionScreen = ({ onSelect }: { onSelect: (version: QuizVersionKey) => void }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">関東駅名クイズ</h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-6">バージョンを選んでください</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(quizVersions).map((version) => (
                        <button
                            key={version}
                            onClick={() => onSelect(version as QuizVersionKey)}
                            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                        >
                            {version}バージョン
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DifficultySelectionScreen = ({ versionTitle, onSelect, onBack }: { versionTitle: string, onSelect: (difficulty: DifficultyKey) => void, onBack: () => void }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">関東駅名クイズ</h1>
                <h2 className="text-xl font-semibold text-blue-600 mb-6">{versionTitle}</h2>
                <h3 className="text-lg font-medium text-gray-700 mb-6">難易度を選んでください</h3>
                <div className="grid grid-cols-1 gap-4">
                    {difficulties.map((diff) => (
                        <button
                            key={diff.key}
                            onClick={() => onSelect(diff.key)}
                            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                        >
                            {diff.label}
                        </button>
                    ))}
                </div>
                <button onClick={onBack} className="mt-8 w-full text-center text-gray-500 hover:text-gray-700 text-sm">
                    バージョン選択に戻る
                </button>
            </div>
        </div>
    );
};


const App = () => {
    const [selectedVersion, setSelectedVersion] = useState<QuizVersionKey | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyKey | null>(null);

    const handleSelectVersion = (version: QuizVersionKey) => {
        setSelectedVersion(version);
    };

    const handleSelectDifficulty = (difficulty: DifficultyKey) => {
        setSelectedDifficulty(difficulty);
    };
    
    const handleBackToVersionMenu = () => {
        setSelectedVersion(null);
        setSelectedDifficulty(null);
    };

    const handleBackToDifficultyMenu = () => {
        setSelectedDifficulty(null);
    };

    if (!selectedVersion) {
        return <QuizSelectionScreen onSelect={handleSelectVersion} />;
    }
    
    if (!selectedDifficulty) {
        return <DifficultySelectionScreen 
                    versionTitle={`${selectedVersion}バージョン`}
                    onSelect={handleSelectDifficulty} 
                    onBack={handleBackToVersionMenu} 
                />;
    }
    
    const difficultyLabel = difficulties.find(d => d.key === selectedDifficulty)?.label || '';
    return (
        <QuizGame 
            stationsData={quizVersions[selectedVersion]} 
            difficulty={selectedDifficulty}
            onBackToMenu={handleBackToDifficultyMenu}
            quizTitle={`${selectedVersion} - ${difficultyLabel}`}
        />
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}