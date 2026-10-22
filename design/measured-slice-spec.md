# Measured: Slice spesifikasyonu

> Figma tasarımı ve kodlama için ortak kaynak. Yapı Türkçe, **uygulama metinleri (copy) İngilizce ve kesindir**.
> Rakip: GoTall (31 adım, sonuç paywall arkasında, "$0.67/week" çerçevesi, "Special offer" geri sayımı 2:59:59). Kaynak: `research/gotall-research.md`.

## 1. Value proposition
**One-line test:** For 13–17-year-olds who want to know how tall they'll get but hate 30-question quizzes that end in a paywall, Measured shows your honest height range in under a minute, unlike GoTall, because you see your result before any paywall and the price is never hidden.

| GoTall | Measured |
|---|---|
| 31 adım, sonra paywall, sonra sonuç | 4 soru, sonra **ücretsiz sonuç**, sonra plan paywall'ı |
| Tek sayı, "%98" iddiası | Aralık (±8,5 cm) ve açıklanan yöntem |
| "$0.67/week" çerçevesi, sahte sayaç | Tam faturalanan tutar en büyük yazı, trial bitiş tarihi, iptal yolu |
| Babası bilinmeyen kullanıcı takılıyor | "I don't know" seçeneği, aralık genişler ve bu açıkça söylenir |

## 2. Akış (12 adım + home)
`promise → goal → about → height → parents → building → reveal (AHA) → habits → plan → priming → paywall → welcome → home`

- İlerleme çubuğu goal'den paywall'a kadar görünür. Promise, building ve welcome ekranlarında gizlidir.
- Açılıştan sonuca **4 soru**. Promise ekranında "4 questions · about 60 seconds" yazılır.
- Paywall kapatılırsa (X) kullanıcı ücretsiz modda home'a gider. Sonuç ve 1. hafta planı ücretsiz kalır.

## 3. Kişiselleştirme haritası (her cevap sonraki bir ekranı değiştirir)
| Cevap | Neyi değiştirir |
|---|---|
| goal = `track-child` | Tüm metinlerde "you" yerine "your child". Reveal başlığı "Your child's predicted height". Plan ve paywall başlıkları değişir |
| goal = `reach-potential` / `know-final-height` | Plan başlığı ("Reach the top of your range" / "Your final-height check-in") ve paywall başlığı değişir |
| sex, age | Tahmin formülü. Güven notu (yaş < 8 veya > 17 ise "low confidence"). Building ekranındaki satırlar |
| current height | Reveal'da "X cm to go" ve silüet. Büyüme bittiyse "growth likely complete" |
| parents' heights / unknown | Reveal'da anne, baba ve sen silüet dizisi. Bilinmeyen ebeveyn için popülasyon ortalaması kullanılır, aralık ±10,5 cm olur ve not gösterilir |
| unit (cm/ft) | Seçildiği andan itibaren her yerde aynı birim |
| sleep / activity / diet | Plandaki alışkanlıkların seçimi ve sırası (`logic/plan.ts`) |

## 4. Ekranlar

### 0. Splash
Antrasit zemin, "Measured" wordmark ve tek bir mandalina cetvel çizgisi. 0,8 sn. Native splash'ten geçiş.

### 1. Promise
- **Görsel:** Tam ekran cetvel. Çizgiler aşağıdan yukarı akar, dev bir rakam "150 → 178" sayarak durur, limon renkli aralık bandı yanar.
- **H1:** Your honest adult height, in 60 seconds.
- **Body:** Based on your parents' heights and a method doctors use. See your result before any paywall.
- **Chip:** 4 questions · about 60 seconds
- **CTA:** Predict my height
- **Alt satır (küçük):** No account needed.

### 2. Goal
- **H2:** What brings you here?
- **Seçenekler** (büyük, ikonlu satırlar, tek seçim, seçimde haptic):
  - `know-final-height`: Ruler ikonu. "I want to know my final height"
  - `reach-potential`: TrendUp ikonu. "I want to reach my full potential"
  - `track-child`: UsersThree ikonu. "I'm checking for my child"
- **CTA:** Continue (seçim yapılmadan pasif)

### 3. About
- **H2:** A little about you. *(çocuk yolunda: "A little about your child.")*
- **Girdiler:** Sex (Boy / Girl segment) ve Age (10–20 yatay sayı seçici, varsayılan 14)
- **Helper:** We use this to pick the right growth curve.
- **CTA:** Continue

### 4. Height
- **H2:** How tall are you now? *(çocuk: "How tall is your child now?")*
- **Girdi:** Dikey cetvel picker. Sürükledikçe dev rakam canlı güncellenir. cm ↔ ft/in toggle. Her çizgi geçişinde selection haptic. Varsayılan 160 cm.
- **Helper:** Barefoot, back against a wall. A rough number is fine.
- **CTA:** Continue

### 5. Parents
- **H2:** How tall are your parents?
- **Girdiler:** İki kompakt cetvel picker: Mom (varsayılan 163) ve Dad (varsayılan 177). Her birinin altında "I don't know" checkbox'ı.
- **Helper:** Biological parents give the most accurate estimate. Not sure? That's okay, we'll widen your range.
- **Hata durumu:** 120–220 cm dışında bir değer girilirse inline uyarı gösterilir: "That looks off. Double-check this one?"
- **CTA:** Build my prediction

### 6. Building (loading)
- 2,5 sn. Cetvel dolar. Cevaplara göre 3 satır sırayla tiklenir:
  - "Reading Mom 163 cm and Dad 177 cm"
  - "Applying the mid-parental method"
  - "Adjusting for age 14"
- Bitince success haptic ve otomatik geçiş.

### 7. Reveal (AHA, ücretsiz)
- **Üst başlık:** Your predicted adult height
- **Hero:** Dev rakam "178 cm" sayarak gelir. Altında limon renkli bant "170 – 187 cm".
- **Canlı UI:** Silüet dizisi (Mom, You now, You (predicted), Dad), gerçek oranlarda. Dokunulunca cm ve ft arasında geçiş yapılır.
- **Satırlar:** "≈ 18 cm to go" · "Above average for adult men" · "Medium confidence". Bilinmeyen ebeveyn veya yaş varsa ilgili not da gösterilir.
- **"How we calculate this"** (açılır bölüm): Tanner mid-parental method + CDC growth data. Real outcomes vary by about 8.5 cm either way. Not medical advice.
- **CTA:** Make my growth plan
- **İkincil:** Share my range *(demo'da sadece görsel, toast gösterir)*

### 8. Habits (plan girdileri, tek ekran)
- **H2:** Habits decide whether you hit the top or bottom of your range.
- **Body:** Habits can't change your genes, but sleep, food and movement help you reach your range.
- 3 segment satırı: Sleep (<7h / 7–8h / 9h+), Activity (Low / Medium / High), Protein & dairy (Rarely / Some days / Most days)
- **CTA:** Show my plan

### 9. Plan
- **Başlık:** `buildPlan().headline` (cevapları geri yansıtır)
- 4 haftalık zaman çizelgesi. **1. hafta açık**: 3–5 alışkanlık kartı (Phosphor ikonu, başlık, dailyTarget, "why" satırı). 2–4. haftalar bulanık ve kilit ikonlu: "Unlocks with Pro".
- **CTA:** Keep me on track

### 10. Priming (bildirim izni)
- **Görsel:** Telefonda örnek bir bildirim kartı: "Lights out in 30 min. Sleep is when you grow."
- **H2:** A nudge at bedtime?
- **Body:** One reminder a day for your plan. And if you start a trial, we'll remind you 2 days before it ends.
- **CTA:** Turn on reminders → sistem izin diyaloğu açılır. **İkincil:** Not now

### 11. Paywall
- Sol üstte **görünür X**.
- **Başlık (goal'e göre):** Reach the top of your range / Stay on top of your final height / Help your child reach their range
- **Pro'da neler var (3 madde):** Full 4-week plan · Daily habit tracker · Monthly re-check of your prediction
- **Planlar:**
  - **Yearly** (varsayılan seçili, "Best value"): "**$29.99 / year**", alt satırda küçük "≈ $0.58/week · 7-day free trial"
  - **Weekly:** "**$3.99 / week**", alt satırda "No trial"
- **Şeffaflık kutusu (yearly seçiliyken):** "Today: $0 · On {bugün+7, ör. Oct 29}: $29.99 · Cancel anytime in Settings → Apple ID → Subscriptions"
- **CTA:** Start my free week *(weekly seçiliyse: "Subscribe for $3.99/week")*
- **Alt satır:** Restore · Terms · Privacy · **Demo build: no real payment**
- **Placeholder yorum** (isteğe bağlı): "Placeholder review" etiketiyle tek bir kart

### 12. Welcome
- **Görsel:** Konfeti yerine limon renkli cetvel "full" animasyonu ve success haptic.
- **H2:** Welcome to Measured Pro
- **Body:** Your full plan is unlocked. Week 1 starts tonight.
- **Etiket:** Demo: no payment was taken
- **CTA:** Start week 1

### 13. Home
- **Üstte:** Kompakt tahmin kartı ("178 cm · 170–187"), tıklanınca reveal açılır
- **"Tonight's plan":** Haftanın alışkanlıkları checklist olarak. Tıklanınca tik, success haptic, sayaç ("2 of 4 done").
- **Empty state** (hiçbiri yapılmamışken): "Nothing checked yet. Start with the easiest one."
- **Free kullanıcı:** 2–4. haftalar kilitli kartta, "See Pro" butonuyla paywall'a döner
- **Alt köşe:** Küçük "Reset demo" (sunum için)

## 5. Tasarım sistemi (token'lar)
- **Renkler:** brand `#FF5A1F` · accent `#C6F25B` · ink `#141414` · paper `#F6F4EF` · surface light `#FFFFFF` / dark `#1E1E1E` · muted `#6B6B6B` · danger `#E5484D` · success = accent
- **Dark mode:** zemin ink, metin paper. Light mode: zemin paper, metin ink. Brand ve accent iki modda aynı.
- **Tipografi:** Clash Display (display 64/64 semibold, h1 34/38, h2 26/30) · General Sans (body 17/24, caption 13/18, button 17/20 semibold). Kaynak Fontshare (ücretsiz lisans). İndirilemezse yedek: Bricolage Grotesque + Inter.
- **Spacing:** 8pt grid (4, 8, 16, 24, 32, 40, 48, 64). Radius 12 / 20 / 999.
- **İkonlar:** Phosphor (bold ağırlık), `phosphor-react-native` + `react-native-svg`.
- **Motion:** Ekran geçişi slide. Rakamlar count-up (600–900 ms). Cetvel çizgileri stagger. Butonda press-scale 0.97. Seçim ve cetvel çizgilerinde selection haptic, CTA'da light haptic, sonuç ve tiklerde success haptic.
- **Yasaklar:** Emoji, mor-mavi gradient, sadece metinden oluşan ekran. Her ekranda cetvel, silüet, rakam veya canlı UI gibi bir görsel olmalı.

## 6. Ölçüm hedefleri (demoda kanıt)
| Metrik | GoTall | Measured hedefi |
|---|---|---|
| Sonuca kadar soru sayısı | 31 adım | 4 |
| Sonuca kadar süre | (sizin ölçümünüz) | < 60 sn |
| Sonuç paywall'dan önce mi? | Hayır | Evet |
| Paywall'da tam fiyat, trial tarihi, iptal yolu | Hayır | Evet |
