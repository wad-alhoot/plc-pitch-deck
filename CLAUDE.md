# CLAUDE.md — ذاكرة المشروع الدائمة

## المشروع
`plc-pitch-deck` — عرض تقديمي تفاعلي (Interactive Pitch Deck) لشركة
**PharmaLink Care (PLC)**. ملف واحد: `index.html` (RTL · عربي · Tailwind عبر CDN ·
خطوط Tajawal + Inter · وضع داكن افتراضي · اللون الأساسي `#2DA9D0`).

قواعد تعديل الملف:
- حافظ على `dir="rtl"` و `lang="ar"` وعلى إعدادات `tailwind.config` المضمّنة.
- لا تُدخِل تبعيات build — الملف يجب أن يظل قابلاً للفتح مباشرة في المتصفح.
- أي لون جديد يُضاف إلى `tailwind.config` لا يُكتب inline.

---

## طبقة الأوركسترا: حزمة القوة السداسية

المهارة `claude-code-power-stack` (في `.claude/skills/`) هي **طبقة التنسيق العليا**
فوق كل المهارات الأخرى. تُقرأ تلقائياً وتُطبَّق قبل بدء أي مهمة برمجية أو تحليلية.

### الترتيب الملزم على دورة البناء

```
خطّط  ←  ابنِ  ←  اطلق
```

| المرحلة | ماذا يجري |
|---|---|
| قبل أي كود | `office-hours` — هل نبني الشيء الصح أصلاً؟ |
| تنقيح الـ spec | `superpowers:brainstorm` ← موافقة ← `write-plan` |
| التنفيذ | `execute-plan` بـ TDD (red-green-refactor) + مراجعة subagents |
| قبل الـ PR | `/code-review` |
| عند مسّ auth أو بيانات أو مدخلات خارجية | `/security-review` |
| الإطلاق | `/ship` |
| العودة لمشروع قديم | Claude-Mem ← `/retro` ← `/security-review` |

### القواعد الخمس التي لا تُكسر
1. لا سطر كود قبل spec متّفق عليه (ولو في سطرين).
2. لا PR قبل مراجعة كود.
3. لا نشر قبل فحص أمني إذا التغيير يمسّ المصادقة أو البيانات أو مدخلات خارجية.
4. لا «خلصت» قبل التحقق الفعلي (verification-before-completion).
5. لا مراجعتين على نفس الـ diff — اختر واحدة (تفاصيل في SKILL.md).

### التنسيق مع المهارات المحلية
- **قبل الصياغة:** `six-block-framework` / `prompt-architect` / `prompt-maximizer` — صامتة في خلفية التفكير، لا تُعرض قوالبها.
- **عند القرارات:** `quant-decision-engine` للأرقام · `plc-council` للقرارات الاستراتيجية ذات المخاطر.
- **عند التنفيذ:** `parallel-agents-orchestrator` للتوازي · `05-test-generator` للاختبارات · `03-bug-fix-protocol` للأخطاء · `04-refactor-pro` لإعادة الهيكلة.
- **عند المراجعة:** `06-code-review-pro` · `07-security-audit`.
- **عند الواجهة:** `frontend-design` + `pharmalink-creative-pro` + `website-content-architect` + `theme-factory`.
- **عند أي سياق طبي/FHIR:** `medplum-architect-pro` له الأولوية على أي قرار معماري صحي.

### أولوية حلّ التعارض
```
الأمان  ←  صحّة المنطق  ←  قابلية الصيانة  ←  السرعة  ←  الجمال
```

المرجع الكامل: `.claude/skills/claude-code-power-stack/SKILL.md`
أوامر التنصيب: `.claude/skills/claude-code-power-stack/reference/install.md`
