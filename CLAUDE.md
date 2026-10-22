# CLAUDE.md: Bu projede nasıl çalışırım

## Proje bağlamı
Ders ödevi: ~50k $/ay kazanan gerçek bir mobil uygulamanın ilk 5 dakikasını (promise → onboarding → aha → paywall → home) backend'siz bir "premium vertical slice" olarak, orijinalinden daha iyi şekilde yeniden yapıyoruz.
**Gereksinimlerin tamamı `PROJE.md`'de.** Her işe başlamadan önce ilgili bölümü kontrol et.

## İletişim dili
- Kullanıcıyla **Türkçe** konuş.
- Kod, dosya ve değişken adları, kod yorumları, commit mesajları ve uygulama içi metinler (UI copy) **İngilizce**.

## Çalışma şekli: adım adım onay
- Her büyük adımdan önce kısa bir plan sun, **onay al**, sonra uygula. Büyük adımlar: yeni ekran, paket kurulumu, klasör yapısı veya mimari kararı, veri modeli.
- Bir adım bitince şunları özetle: ne yapıldı, nasıl test edilir, sıradaki adım ne. **Onay almadan bir sonraki adıma geçme.**
- Belirsizlik varsa tahmin etme, sor.

## Agent orkestrası

### Roller
- **Ana agent (orkestra şefi):** Bu oturumun kendisi. **Opus 5.5, high effort** ile çalışır. Oturum başında model veya effort farklıysa kullanıcıyı uyar (`/model` ile ayarlanır). Ana agent kendi modelini değiştiremez.
- **Alt agentlar (icracılar):** Ana agent tarafından görev başına oluşturulur. Kullanıcıyla doğrudan konuşmazlar, sonuçları ana agente raporlarlar. Ana agent bu sonuçlardan kullanıcıya gerekenleri aktarır.

### Ana agentin görevleri (sırasıyla)
1. **Analiz:** İşi `PROJE.md` ve mevcut koda göre kendisi analiz eder. Bu adım devredilmez.
2. **Parçalama:** İşi bağımsız ve net çıktılı alt görevlere böler. Hangi görevlerin paralel, hangilerinin sıralı yürüyeceğini belirler.
3. **Kadro planı:** Her alt görev için agent tipini, modeli, effort seviyesini, gereken MCP/skill'leri ve beklenen çıktıyı seçer.
4. **Onay:** Kadro planını kısa bir tablo halinde kullanıcıya sunar, **onay almadan agent başlatmaz** (adım adım onay kuralı burada da geçerli).
5. **Yönetim:** Agentları başlatır. Bağımsız olanları tek mesajda paralel başlatır. Takılan agenta `SendMessage` ile yön verir.
6. **Kalite kapısı:** Her çıktıyı kabul etmeden önce doğrular (aşağıya bak). Yetersizse aynı agenta düzeltme yaptırır, gerekirse daha güçlü bir modele yükseltir.
7. **Birleştirme ve rapor:** Sonuçları birleştirir. Kullanıcıya ne yapıldığını, nasıl test edileceğini ve sıradaki adımı özetler.

### Model ve effort seçimi
Kural: **İşin kalitesini karşılayan en ucuz model.** Çıktı kalite kapısından geçemezse bir üst seviyeye çıkılır.

| İş türü | Agent tipi | Model | Effort |
|---|---|---|---|
| Proje analizi, mimari kararlar, görev parçalama | Ana agent | Opus 5.5 | high |
| Uygulama planı tasarlama (karmaşık ekran veya akış) | `Plan` | opus | high |
| Kod yazma (ekran, component, state, plan motoru) | `general-purpose` | sonnet | medium |
| Animasyon, motion, karmaşık etkileşim kodu | `general-purpose` | sonnet | high |
| Kod inceleme ve QA (Figma uyumu, bug, checklist) | `general-purpose` | opus | high |
| Kod tabanında arama ve dosya bulma | `Explore` | haiku | low |
| Mekanik işler (yeniden adlandırma, format, token dosyası doldurma) | `general-purpose` | haiku | low |
| Web araştırması (gelir doğrulama, App Store yorum analizi, referans bulma) | `general-purpose` | sonnet | medium |
| Mock veri ve UI copy yazımı (gerçekçi içerik) | `general-purpose` | sonnet | medium |
| Belge üretimi (teardown PDF, value-prop, sunum) | `general-purpose` | sonnet | medium |

- Agent başlatırken `model` ve `effort` parametreleri bu tabloya göre **açıkça** verilir.
- `fork` tipi kullanılmaz (her zaman ana modelle, yani Opus ile çalışır, pahalıdır). Sadece tüm konuşma bağlamının gerçekten gerekli olduğu istisnai durumlarda, gerekçesiyle kullanılır.

### MCP ve skill kullanımı
Ana agent her alt görev için hangi aracın gerektiğine karar verir ve agent prompt'unda **açıkça yazar** ("şu skill'i yükle", "şu MCP aracını kullan"). Gerekmeyen araç verilmez.

| İhtiyaç | Kullanılacak araç |
|---|---|
| Web araştırması, gelir ve yorum verisi | `WebSearch`, `WebFetch`, gerekirse `anthropic-skills:deep-research` |
| Teardown ve benzeri PDF belgeleri | `anthropic-skills:pdf` |
| Demo sunumu | Slides artifact türü veya `anthropic-skills:pptx` (kullanıcı formatı seçer) |
| Karşılaştırma grafikleri (time-to-value, clarity testi) | `dataviz` skill'i |
| Uygulamayı çalıştırma ve görerek doğrulama | `run` skill'i |
| Kod inceleme ve sadeleştirme | `code-review`, `simplify` skill'leri |
| Büyük dosya veya log okuma | `headroom:peek` / `headroom:headroom` |
| Web sayfası üzerinde gezinme ve ekran görüntüsü | `claude-in-chrome` skill'i |

- **Figma MCP bağlı** (uzak sunucu, `.mcp.json`, 23.10.2026). Dosya: [Measured vs GoTall](https://www.figma.com/design/CI4KAerQamr8blWOUNMBEp/Measured-vs-GoTall). `use_figma` öncesinde `figma-use` skill'i yüklenir. Görseller `upload_assets` ile yüklenir. Laptopta `/mcp` ile yeniden yetkilendirme gerekir.
- Yeni MCP sunucusu eklemek veya ayar değiştirmek her zaman kullanıcı onayı gerektirir.

### Kalite kapısı (her alt agent çıktısı için)
- **Kod:** `tsc --noEmit` ve lint temiz olmalı. Uygulama Expo'da açılmalı. Ekran Figma görüntüsüyle karşılaştırılır. `PROJE.md` §11 checklist'inin ilgili maddeleri kontrol edilir.
- **Önemli adımlar** (her ekranın tamamlanması, paywall, aha anı) bitince opus/high bir inceleme agenti veya `code-review` çalıştırılır.
- **İçerik:** Lorem ipsum veya placeholder yok, testimonial'lar etiketli, copy İngilizce, kısa ve ikinci tekil şahıs.
- Ana agent, alt agentın "bitti" demesini kanıt saymaz. Değişen dosyaları veya diff'i kendisi kontrol eder.
- Her alt agent prompt'una şu yasak açıkça yazılır: **sistem genelinde program kurulmaz** (winget, choco, msi, global npm). Gerekirse agent durur ve bunu ana agente bildirir. Ana agent da kullanıcıdan onay ister. Proje klasöründeki yerel `npm` bağımlılıkları bu yasağa dahil değildir. (Ders: E1 agentı onaysız LibreOffice kurdu, 22.10.2026.)

### Token tasarrufu (kaliteden ödün vermeden)
- **Gereksiz agent yok:** 1–2 dosyalık veya birkaç dakikalık işleri ana agent kendisi yapar. Agent sadece gerçekten bağımsız, büyük veya paralel yürüyebilecek işler için başlatılır.
- **Az ama yeterli agent:** Aynı anda en fazla 3 alt agent. Aynı türde bir sonraki iş için yeni agent yerine, bağlamı hazır olan mevcut agenta `SendMessage` ile devam edilir.
- **Kısa ve kendine yeten prompt:** Hedef, tam dosya yolları, ilgili `PROJE.md` bölüm numarası, kabul kriterleri ve çıktı formatı yazılır. Tüm bağlam kopyalanmaz. Agent ilgili bölümü kendisi okur.
- **Kısa rapor formatı:** Alt agentlardan şu formatta rapor istenir: *ne yapıldı / değişen dosyalar / doğrulama sonucu / açık sorular*. Dosya içeriği veya uzun log döküm istenmez.
- **Tekrar okuma yok:** Konuşmada zaten olan bilgi yeniden çıkarılmaz. Büyük dosyalar parça parça veya `headroom:peek` ile okunur.
- **Doğru model:** Opus sadece analiz, planlama ve inceleme için kullanılır. Üretim işleri sonnet'e, mekanik işler haiku'ya verilir.
- **Paralellik:** Birbirine bağımlı olmayan agentlar tek mesajda başlatılır. Sıralı bekleme yapılmaz.
- Tasarruf hiçbir zaman kalite kapısını atlamak, test etmemek veya checklist'i kısaltmak anlamına gelmez.

## Tasarım → kod
- Tasarımı ekip **Figma'da** yapar. Ben verilen ekran görüntülerini, renkleri, fontları, spacing'i ve asset'leri **birebir** kodlarım.
- Tasarımı verilmemiş bir ekranı kendi kafamdan "güzel" yapmam. Eksik bir şey varsa tasarımı isterim.
- **İstisna (kullanıcı onayladı, 22.10.2026):** Teslim tarihi sıkışık olduğu için ekranlar `design/measured-slice-spec.md` ve oradaki token'lardan kodlanıyor. Figma ekran görüntüleri gelince kod onlara göre piksel piksel hizalanır. Spesifikasyon ile Figma çelişirse Figma geçerlidir.
- "AI look" yasakları kodda da geçerli: emoji ikon, mor-mavi gradient, her yerde sistem fontu, üst üste aynı kartlar, sadece metinden oluşan onboarding ekranı kullanılmaz.

## Teknoloji yığını
- **Expo + React Native + TypeScript**. Gerçek telefonda **Expo Go** ile test edilir.
- Aday kütüphaneler (**kurmadan önce onay alınır**): expo-router, react-native-reanimated, expo-haptics, lottie-react-native, @react-native-async-storage/async-storage, expo-font, tek bir ikon seti (Phosphor veya Lucide).

## Kapsam disiplini
- Sadece `PROJE.md` içindeki **IN** listesi yapılır. Backend, login, gerçek ödeme, ikinci bir özellik, ayarlar ve profil yok.
- Mock veri gerçekçi olur. "Lorem ipsum", "Test", "Result 1" yasak.
- Placeholder testimonial ve rating'ler "placeholder" olarak etiketlenir. Paywall'da fiyat, trial ve iptal koşulları net yazılır, kapatma butonu kolay bulunur.

## Kod standartları
- Uygulama `mobile/` klasöründe (Expo SDK 58). Route'lar `mobile/src/app/` altında, geri kalan kod `mobile/src/` altında. `@/` alias'ı `mobile/src/` klasörünü gösterir.
- Kod yazan her agent `mobile/AGENTS.md` kurallarına uyar: Expo API'leri için hafızaya değil, SDK 58 dokümanına bakılır. Paketler `npx expo install` ile kurulur. Sadece Expo Go'da hazır gelen native modüller kullanılır.
- Bir iş "bitti" denmeden önce `mobile/` içinde `npx tsc --noEmit` ve `npx expo lint` temiz geçmelidir.
- Tasarım token'ları (renkler, font ölçeği, 8pt spacing) tek bir dosyada tutulur.
- Her ekran ayrı bir dosyada olur.
- Kullanıcı cevapları tek bir state'te tutulur ve AsyncStorage ile kalıcı hale getirilir.
- Mock veriler `data/` klasöründe JSON olarak durur. Plan motoru basit kurallarla çalışır.

## Git
- Proje bir git reposunda tutulur. Uzak repo: [cemaksu229/measured-vertical-slice](https://github.com/cemaksu229/measured-vertical-slice) (**public**, `master` dalı, 23.10.2026).
- **Commit ve push, kullanıcı istediğinde ya da masaüstü ile laptop arasında senkron için yapılır.** Kullanıcının onayladığı ve doğrulanmış (tsc, lint, gerekiyorsa yeniden üretilmiş export'lar) bir iş bitince commit atılır ve `origin/master`'a push edilir. Yarım kalmış veya doğrulanmamış iş push edilmez.
- Force push, geçmişi yeniden yazma ve dal silme yapılmaz. Bunlar her zaman ayrıca onay gerektirir. Repo public olduğu için ders materyali ve ondan türetilen notlar **asla commit'lenmez**: `Vertical_Slice_Project_Brief.pdf`, `hocanınistekleri.txt`, `PROJE.md`, `research/self-assessment.md` sadece yerelde durur (`.gitignore`). Laptopa elle taşınırlar.
- Başka bir bilgisayarda çalışmaya başlamadan önce `git pull` yapılır. Commit mesajları İngilizce olur.

## Yapmayacaklarım
- Onay almadan paket kurmak, dosya silmek, onaylanmamış ekran eklemek, kapsam dışı özellik eklemek.
- Onay almadan agent kadrosu başlatmak, MCP sunucusu eklemek veya ayarları değiştirmek.
