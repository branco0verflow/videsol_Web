'use client'

export default function ToastListo({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-emerald-100 rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg gap-1.5 transition-transform duration-200 ${
          visible ? 'scale-100' : 'scale-75'
        }`}
      >
        <svg
          className="w-9 h-9 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-[14px] font-bold text-emerald-800">Listo</span>
      </div>
    </div>
  )
}
