# التنصيب على مستوى الحساب — ثلاث طرق

| الملف | لأين | ماذا يغطّي |
|---|---|---|
| `claude-code-power-stack.zip` | claude.ai → Settings → Capabilities → Skills → Upload | كل الحساب: الويب + الموبايل + Claude Code (عبر مزامنة `synced`) |
| `install-account-wide.sh` | جهازك: `bash install-account-wide.sh` | كل مشاريع Claude Code على هذا الجهاز |
| `global-CLAUDE.md` | نسخ يدوي إلى `~/.claude/CLAUDE.md` | طبقة الذاكرة فقط (بدون ملف المهارة) |

`claude-code-power-stack/SKILL.md` هو الملف المستقل الكامل — يصلح للصق المباشر في أي محرّر مهارات.

## الترتيب المقترح
1. ارفع الـ zip على claude.ai → تنتشر المهارة على الحساب كله.
2. شغّل `install-account-wide.sh` على الجهاز → طبقة الذاكرة + نسخة محلية للمهارة.
3. نصّب الإضافات الست من داخل جلسة Claude Code (الأوامر يطبعها السكربت في نهايته).

السكربت **idempotent**: تشغيله مرتين لا يُكرّر الكتلة في `CLAUDE.md`، ويأخذ نسخة احتياطية قبل أي تعديل.
