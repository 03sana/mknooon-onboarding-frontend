export default function InvalidLink() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">الرابط غير صالح</h1>
          <p className="text-muted-foreground text-lg">
            للأسف، الرابط الذي تحاولين الوصول إليه غير صحيح أو منتهي الصلاحية.
          </p>
        </div>

        <div className="mt-8 p-4 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-3">
            تأكدي من الرابط وحاولي مرة أخرى، أو تواصلي مع فريق الدعم.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
