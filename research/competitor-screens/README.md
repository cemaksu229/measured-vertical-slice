GoTall ekran görüntülerini bu klasöre `01.png, 02.png, 03.png ...` adıyla, uygulamadaki sırayla koyun (en fazla ~36 adet).
Paywall'ın büyük kadrajı için ayrıca `paywall.png` ekleyebilirsiniz (paywall sayfasında kullanılır; yoksa type=paywall olan ilk ekran kullanılır).
Kronometreyle ölçün: sonuca ve paywall'a kadar ekran sayısı, dokunuş sayısı, saniye (temiz kurulumdan itibaren) ve `research/teardown-data.json` içindeki `counts` alanlarına yazın.
Her ekran için `annotations` içine title, type (promise/quiz/loading/paywall/result/other), notes ve sürtünme varsa `friction: true` + `frictionNote` ekleyin; X butonu, fiyat, sayaç bilgilerini `paywall.facts` içinde doldurun.
Sonra çalıştırın: `cd design/tools && npm run teardown` (çıktı `deliverables/teardown.pdf`; başka klasör için `-- --screens <dir>`).
