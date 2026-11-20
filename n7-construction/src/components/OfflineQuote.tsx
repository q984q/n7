"use client";
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export function OfflineQuote({context}: {context?: string}) {
  const {cart,liveSettings} = useStore();
  const [city,setCity]=useState(''), [note,setNote]=useState(''), [status,setStatus]=useState('');
  const lines = context ? [context] : cart.map(({product,qty,optionsNote,includeInstall},i)=>`${i+1}. ${product.shortName} · арт. ${product.sku} · ${qty} ${product.unit}${optionsNote ? ` · ${optionsNote}` : ''}${includeInstall ? ' · с монтажом' : ''}`);
  const text=['Запрос коммерческого предложения · N7 CONSTRUCTION',...lines,city.trim() && `Город поставки: ${city.trim()}`,note.trim(), 'Прошу уточнить цену, условия оплаты, срок поставки, стоимость доставки и монтажа.'].filter(Boolean).join('\n');
  const phone=liveSettings.whatsappNumber.replace(/\D/g,'');
  const button='inline-flex min-h-11 items-center justify-center rounded-xl bg-canvas px-4 text-sm font-bold text-ink';
  function download(){const url=URL.createObjectURL(new Blob(['\uFEFF',text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='N7-запрос-КП.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  return <section className="rounded-2xl bg-white p-4 text-ink space-y-3 lg:col-span-5">
    <h3 className="text-lg font-bold">Подготовить запрос КП</h3>
    <p className="text-sm text-ink-muted">Черновик создаётся на вашем устройстве. Сайт не отправляет его менеджеру. В WhatsApp проверьте получателя и отправьте сообщение самостоятельно.</p>
    <label className="block text-sm font-semibold">Город поставки<input value={city} onChange={e=>setCity(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas p-3" placeholder="Например, Павлодар" /></label>
    <label className="block text-sm font-semibold">Пожелания к расчёту<textarea value={note} onChange={e=>setNote(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas p-3" placeholder="Размеры, сроки, нужны ли монтаж и образцы" /></label>
    <details><summary className="cursor-pointer py-2 text-sm font-bold">Посмотреть текст запроса</summary><p className="whitespace-pre-wrap break-words text-sm">{text}</p></details>
    <div className="flex flex-wrap gap-2"><a href={`https://wa.me/${phone}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className={`${button} !bg-ink !text-white`}>{phone?'Открыть WhatsApp компании':'Выбрать чат в WhatsApp'}</a><button type="button" className={button} onClick={async()=>{try{await navigator.clipboard.writeText(text);setStatus('Текст скопирован')}catch{setStatus('Откройте текст запроса и скопируйте вручную или скачайте TXT.')}}}>Копировать</button><button type="button" className={button} onClick={download}>Скачать TXT</button></div><span role="status" className="text-sm">{status}</span>
  </section>
}
