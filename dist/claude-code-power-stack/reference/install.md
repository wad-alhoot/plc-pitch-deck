# التنصيب التفصيلي — الطبقات الست

> ملاحظة: أوامر `/plugin` تُنفَّذ داخل جلسة Claude Code التفاعلية (في الـ terminal)،
> لا في سكربت shell. أوامر `git clone` تُنفَّذ في الـ terminal العادي.

## ١. Superpowers (obra)

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

## ٢. Frontend Design (Anthropic)

```
/plugin install frontend-design@claude-plugins-official
```

نصّبه مرة وانساه — كل prompt يخصّ الواجهة الأمامية سيسحب منه أوتوماتيكياً بدون مناداة.

## ٣. Code Review + Security Review (Anthropic)

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

## ٤. Claude-Mem (thedotmack)

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

ثم **أعد تشغيل Claude Code** ليبدأ تحميل سياق الجلسات السابقة.

- التخزين محلي عبر ChromaDB — لا شيء يغادر الجهاز
- لاستثناء محتوى حسّاس من التخزين: لُفّه بوسم `<private>...</private>`
- متوافق مع: Claude Code · Codex · Gemini CLI · Cursor · Windsurf

## ٥. gstack (Garry Tan)

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

## ٦. الترتيب

انظر قسم «الترتيب الصحيح للتشغيل» في `SKILL.md`.

---

## أولوية التنصيب عند ضيق الوقت

1. **Superpowers** — الأعلى أثراً (يفرض التخطيط + TDD + المراجعة قبل أي كود)
2. **Claude-Mem** — ينهي البدايات الباردة
3. **Security Review** — مجاني وجاهز، فقط اكتب الأمر
4. الباقي عند الحاجة لتحكّم أدق بطبقة معيّنة
