"use client"
import Image from "next/image"
import { useState } from "react"

type Props = {
  images?: string[]
  title?: string
}

export default function ImageGallery({ images = [], title = '' }: Props) {
  const imgs = images && images.length ? images : ['/placeholder.svg']
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <div>
      <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
        <div className="w-full h-full cursor-pointer" onClick={() => { setIndex(0); setOpen(true) }}>
          <Image src={imgs[0]} alt={title || 'Image'} fill className="object-cover" />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-auto">
        {imgs.map((src, i) => (
          <div key={i} className="w-28 h-20 rounded overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => { setIndex(i); setOpen(true) }}>
            <Image src={src} alt={`${title} ${i + 1}`} width={280} height={160} className="object-cover" />
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button aria-label="Fermer" onClick={() => setOpen(false)} className="absolute top-6 right-6 text-white bg-black/40 rounded-full p-2">✕</button>
          <button aria-label="Précédent" onClick={() => setIndex((index - 1 + imgs.length) % imgs.length)} className="absolute left-6 text-white bg-black/40 rounded-full p-2">‹</button>

          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
            <Image 
              src={imgs[index]} 
              alt={`${title} ${index + 1}`} 
              fill
              className="object-contain" 
            />
          </div>

          <button aria-label="Suivant" onClick={() => setIndex((index + 1) % imgs.length)} className="absolute right-6 text-white bg-black/40 rounded-full p-2">›</button>
        </div>
      )}
    </div>
  )
}
