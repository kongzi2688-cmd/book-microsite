import Script from 'next/script'

import '../css/reset.css'
import '../css/variables.css'
import '../css/animations.css'
import '../css/layout.css'
import '../css/home.css'
import '../css/intro.css'
import '../css/author.css'
import '../css/story.css'
import '../css/memory.css'
import '../css/purchase.css'
import '../css/work.css'
import '../css/cursor.css'

export const metadata = {
  title: '우리가 빛의 속도로 갈 수 없다면 — 김초엽',
  description:
    "김초엽 소설 『우리가 빛의 속도로 갈 수 없다면』 — SF 문학의 감성 세계로 초대합니다. 그리움, 고독, 광활한 우주를 담은 단편집을 만나보세요.",
  keywords: '김초엽, 우리가 빛의 속도로 갈 수 없다면, SF소설, 한국SF, 단편소설',
  openGraph: {
    title: '우리가 빛의 속도로 갈 수 없다면 — 김초엽',
    description: '그리움과 고독이 담긴 SF 단편집. 빛의 속도로 당신에게 닿기를.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@300;400;500&family=Noto+Serif+KR:wght@300;400;600&family=Space+Grotesk:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
        {/* Pretendard */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        {children}
         <Script src="/js/cursor-effect.js" strategy="afterInteractive" />
         </body>
    </html>
  )
}
