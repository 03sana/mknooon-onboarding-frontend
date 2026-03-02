export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );
}
