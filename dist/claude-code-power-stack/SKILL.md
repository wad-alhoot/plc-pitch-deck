---
name: claude-code-power-stack
description: >-
  حزمة القوة السداسية لـ Claude Code — طبقة تنسيق عليا تُرتّب كل المهارات الأخرى على دورة «خطّط ← ابنِ ← اطلق»: تخطيط (Superpowers)، تصميم (Frontend Design)، مراجعة كود، فحص أمني، ذاكرة بين الجلسات (Claude-Mem)، وستاك المنتج (gstack). استخدمها تلقائياً عند: بدء أي ميزة أو مشروع برمجي، العودة لمشروع قديم، طلب خطة أو تنفيذ، قبل أي PR أو نشر، عند لمس المصادقة أو البيانات أو مدخلات خارجية، عند بناء واجهة أمامية، وعند السؤال عن plugins أو skills أو workflow. تُحدّد أي مهارة تعمل في أي مرحلة وبأي ترتيب وتمنع تكرار العمل أو تضاربه. لا تتجاهلها حتى لو بدت المهمة صغيرة — أغلب فشل الكود المُولَّد بالذكاء الاصطناعي سببه غياب الترتيب لا ضعف الموديل.
---

## الطبقات الست

### ١. Superpowers — التخطيط قبل الكود
**المصدر:** Jesse Vincent (obra) · **الوظيفة:** يمنع Claude من القفز مباشرة على الكود.

الدورة الإجبارية: `brainstorm` للـ spec ← أخذ موافقتك ← `implementation plan` مكتوب ←
تنفيذ بـ TDD (red-green-refactor) ← مراجعة عبر subagents.

القدرات الخمس:
| القدرة | ماذا تفرض |
|---|---|
| `brainstorming` | تنقيح الـ spec بأسئلة قبل أي سطر كود |
| `test-driven-development` | الاختبارات لازم تفشل قبل ما تُنفَّذ |
| `systematic-debugging` | منهجية أربع مراحل لجذر المشكلة بدل التخمين |
| `subagent-driven-development` | مراجعة على مرحلتين: مطابقة الـ spec + جودة الكود |
| `verification-before-completion` | يمنع Claude من قول «خلصت» قبل ما يخلص فعلاً |

**متى تُستدعى:** أي ميزة جديدة، أي مهمة متعددة الخطوات، أي bug غامض.
**الأثر الأعلى:** لو عندك وقت لطبقة واحدة فقط — هذه هي.

---

### ٢. Frontend Design — شكل مش AI
**المصدر:** Anthropic · **الوظيفة:** يقتل الشكل الجاهز الذي يُعرَف من بعيد
(gradient أزرق-بنفسجي، خط Inter في كل شيء، ثلاثة أعمدة أيقونات).

يمنح Claude المفردات البصرية التي لم يتدرّب على تطبيقها: typography جريء،
حركة مقصودة، هرمية بصرية حقيقية، اختيارات تصميم جريئة بدل الـ defaults الآمنة،
أنظمة typography كاملة لا خط واحد لكل شيء، قواعد واضحة للـ motion والأنيميشن.

**متى تُستدعى:** تلقائياً في أي مهمة frontend — بدون مناداة. نصّبه مرة وانساه.

---

### ٣. Code Review + Security Review — ما بين الكود والنشر
**المصدر:** Anthropic (اثنان) · **الوظيفة:** يقفان بينك وبين نشر كود مكسور.

**Code Review:** يشغّل خمسة agents بالتوازي على الـ PR، كل واحد بزاوية مختلفة،
ثم يفلتر النتائج حسب درجة الثقة فلا ترى إلا المشاكل الحقيقية.
الخمس زوايا: الالتزام بـ CLAUDE.md · كشف الـ bugs · السياق التاريخي من git ·
تاريخ الـ PRs · تعليقات الكود.
**الفرق عن المراجعة اليدوية:** نفس العمق كل مرة، لا يعتمد على مزاج الـ prompt.

**Security Review:** جاهز أصلاً داخل Claude Code — اكتب `/security-review`.
يمسك: SQL injection · command injection · XSS · XXE · ثغرات authentication و
authorization · secrets مكتوبة داخل الكود · تسريب PII في اللوجات · تشفير ضعيف ·
عشوائية غير آمنة · ثغرات الـ dependencies.
نفس الفريق يستخدمه لتأمين Claude Code نفسه قبل كل إصدار.

**متى تُستدعى:** `/code-review` قبل كل PR. `/security-review` إذا التغيير يمسّ
auth أو بيانات أو مدخلات خارجية.

---

### ٤. Claude-Mem — الذاكرة بين الجلسات
**المصدر:** thedotmack · **الوظيفة:** ينهي «كل محادثة تبدأ من الصفر».

يسجّل كل شيء يعمله Claude، يضغطه بالذكاء الاصطناعي، ويُرجّع السياق المهم
للجلسات القادمة بدون ما تحكي كلمة.

- يلتقط استخدام الأدوات وتعديلات الملفات والقرارات أثناء الجلسة
- بحث دلالي (semantic search) عبر كل جلساتك السابقة عن طريق ChromaDB
- وسم `<private>` لاستثناء أي محتوى حسّاس من التخزين
- التخزين محلي — بياناتك لا تغادر جهازك
- يعمل مع Claude Code و Codex و Gemini CLI و Cursor و Windsurf

**متى تُستدعى:** دائماً — خاصةً عند العودة لمشروع قديم.

---

### ٥. gstack — ستاك Garry Tan
**المصدر:** Garry Tan (رئيس Y Combinator) · **الوظيفة:** ٢٣ skill تُحوّل Claude
لفريق منتج كامل: مراجعة بمستوى CEO، مدير هندسة، مصمم، QA، ومسؤول إصدارات.

الفكرة: كل مرحلة في بناء المنتج تحتاج وضع تفكير مختلف. **التخطيط ليس مراجعة،
والمراجعة ليست إطلاقاً، وذوق المؤسس ليس انضباط المهندس.**

| Skill | الوظيفة |
|---|---|
| `office-hours` | ست أسئلة إجبارية قبل أي كود: شو الذي تبنيه فعلاً |
| `plan-ceo-review` | مراجعة تجربة بأسلوب Brian Chesky لأي ميزة |
| `plan-eng-review` | مرور مدير هندسة على النطاق والحالات الحدّية ومعايير النجاح |
| `review` + `qa` | مراجعة كود بمستوى staff engineer + جولة اختبار آلية |
| `browse` | نسخة Playwright مجمّعة أسرع ~٢٠ مرة من Chrome MCP للـ QA البصري |
| `ship` | أمر واحد: يزامن main، يشغّل الاختبارات، يرفع الـ branch، ويفتح PR |
| `retrospective` | retro منظّم يجعل أسبوعك القادم أفضل |

الرخصة MIT ولا يلمس الـ PATH عندك.

---

### ٦. الترتيب الصحيح للتشغيل — الطبقة السادسة الحقيقية

**مشروع/ميزة جديدة من الصفر:**
1. `/office-hours` (gstack) — تأكّد أنك تبني الشيء الصح
2. `/superpowers:brainstorm` — تنقيح الـ spec
3. `write-plan` ثم `execute-plan` — خطة مكتوبة ثم تنفيذ بـ TDD
4. `/code-review` — قبل فتح الـ PR
5. `/security-review` — إذا التغيير يمسّ auth أو بيانات أو مدخلات خارجية
6. `/ship` (gstack) — مزامنة + اختبارات + رفع + فتح PR بأمر واحد

**رجوع لمشروع قديم:**
1. Claude-Mem مركّب ← يحمّل سياق أمس لحاله
2. `/retro` على آخر أسبوع
3. `/security-review` كفحص أساسي

---

## التنسيق مع المهارات الأخرى (طبقة الأوركسترا)

هذه المهارة **لا تُلغي** المهارات الموجودة — تُرتّبها. الخريطة:

| مرحلة الدورة | الطبقة من الحزمة | المهارة المحلية التي تعمل معها |
|---|---|---|
| قبل صياغة أي أمر | — | `six-block-framework` / `prompt-architect` / `prompt-maximizer` (صامتة) |
| قرار «هل نبني هذا أصلاً؟» | `office-hours` | `quant-decision-engine` للأرقام · `plc-council` / `llm-council` للقرارات ذات المخاطر |
| تنقيح الـ spec | `superpowers:brainstorm` | `technology-evaluator-pro` عند اختيار تقنية |
| التخطيط والتنفيذ المتوازي | `subagent-driven-development` | `parallel-agents-orchestrator` (worktrees · loops · Routines) |
| كتابة الاختبارات | `test-driven-development` | `05-test-generator` |
| تصحيح الأخطاء | `systematic-debugging` | `03-bug-fix-protocol` |
| إعادة الهيكلة | — | `04-refactor-pro` / `/simplify` |
| مراجعة الكود | `/code-review` | `06-code-review-pro` |
| الفحص الأمني | `/security-review` | `07-security-audit` |
| الواجهة الأمامية | `frontend-design` | `web-developer-pro-v2` · `pharmalink-creative-pro` · `website-content-architect` · `theme-factory` |
| سياق طبي/FHIR | — | `medplum-architect-pro` (له الأولوية على أي قرار معماري صحي) |
| الذاكرة بين الجلسات | `Claude-Mem` | `CLAUDE.md` الخاص بالمشروع |

### قواعد منع التعارض
1. **لا تُشغّل مراجعتين على نفس الـ diff.** اختر واحدة: `/code-review` المدمجة
   (أسرع، خمس زوايا، فلترة بالثقة) أو `06-code-review-pro` (أربعة أبعاد، تقرير أعمق).
   الافتراضي: `/code-review` للـ PRs اليومية، و`06-code-review-pro` قبل الإصدارات الكبيرة.
2. **الفحص الأمني مرة واحدة:** `/security-review` للتغيير، `07-security-audit` للمشروع كاملاً.
3. **التخطيط قبل التنفيذ دائماً** — حتى لو المستخدم طلب التنفيذ مباشرة، اعرض الخطة أولاً
   في سطرين ثم نفّذ (إلا إذا كان التغيير سطراً واحداً واضحاً).
4. **مهارات الـ prompt تعمل صامتة** في خلفية التفكير — لا تُعلن عنها ولا تُخرج قوالبها للمستخدم.
5. **عند تعارض توصيتين**، الأولوية: الأمان ← صحّة المنطق ← قابلية الصيانة ← السرعة ← الجمال.

---

## أوامر التنصيب

المختصر (التفاصيل في الملحق أسفل الملف):

```bash
# Superpowers
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

# Frontend Design
/plugin install frontend-design@claude-plugins-official

# Claude-Mem
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem     # ثم أعد تشغيل Claude Code

# Security Review — جاهز أصلاً
/security-review

# gstack
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

---

## الخلاصة التي تُطبَّق

بعد بضعة مشاريع بهذا الستاك: **إعادة كتابة أقل، أخطاء راجعة أقل، ولا بدايات باردة كل مرة.**
لا واحدة من هذه الإضافات تُعوّض عن حكمك — لكنها تُثبّت الترتيب الذي ينسى الإنسان تطبيقه
تحت الضغط.

---

## ملحق: التنصيب التفصيلي

> أوامر `/plugin` تُنفَّذ داخل جلسة Claude Code تفاعلية في الـ terminal، لا في سكربت shell.
> أوامر `git clone` تُنفَّذ في الـ terminal العادي.

### ١. Superpowers (obra)

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

الاستخدام بعد التنصيب:
```
/superpowers:brainstorm      # تنقيح الـ spec بأسئلة
write-plan                   # كتابة خطة التنفيذ
execute-plan                 # التنفيذ بـ TDD + مراجعة subagents
```

### ٢. Frontend Design (Anthropic)

```
/plugin install frontend-design@claude-plugins-official
```

نصّبه مرة وانساه — كل prompt يخصّ الواجهة الأمامية سيسحب منه أوتوماتيكياً بدون مناداة.

### ٣. Code Review + Security Review (Anthropic)

`Security Review` جاهز داخل Claude Code:
```
/security-review
```

لتشغيله أوتوماتيكياً على كل PR — أضف الـ GitHub Action:
- المصدر: `github.com/anthropics/claude-code-security-review`
- الوجهة: مجلد `.github/workflows/` في المستودع

نتيجة ذلك: كل PR يُفتح ومعه فحص أمني.

للمراجعة العادية:
```
/code-review
```

### ٤. Claude-Mem (thedotmack)

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

ثم **أعد تشغيل Claude Code** ليبدأ تحميل سياق الجلسات السابقة.

- التخزين محلي عبر ChromaDB — لا شيء يغادر الجهاز
- لاستثناء محتوى حسّاس من التخزين: لُفّه بوسم `<private>...</private>`
- متوافق مع: Claude Code · Codex · Gemini CLI · Cursor · Windsurf

### ٥. gstack (Garry Tan)

يُنصَّب من خارج Claude Code:

```bash
git clone --single-branch --depth 1 \
  https://github.com/garrytan/gstack.git ~/.claude/skills/gstack

cd ~/.claude/skills/gstack && ./setup
```

ثم أضف قسم `gstack` في ملف `CLAUDE.md` تحدّد فيه الـ skills التي تريد تفعيلها.

الرخصة MIT · لا يلمس الـ PATH.

الأوامر الأساسية:
```
/office-hours        # ست أسئلة إجبارية قبل أي كود
/plan-ceo-review     # مراجعة تجربة بأسلوب Brian Chesky
/plan-eng-review     # النطاق + الحالات الحدّية + معايير النجاح
/review  /qa         # مراجعة staff engineer + اختبار آلي
/browse              # QA بصري عبر Playwright مجمّعة
/ship                # مزامنة + tests + رفع + فتح PR
/retrospective       # retro أسبوعي منظّم
```

### ٦. الترتيب

انظر قسم «الترتيب الصحيح للتشغيل» في `SKILL.md`.

---

### أولوية التنصيب عند ضيق الوقت

1. **Superpowers** — الأعلى أثراً (يفرض التخطيط + TDD + المراجعة قبل أي كود)
2. **Claude-Mem** — ينهي البدايات الباردة
3. **Security Review** — مجاني وجاهز، فقط اكتب الأمر
4. الباقي عند الحاجة لتحكّم أدق بطبقة معيّنة
