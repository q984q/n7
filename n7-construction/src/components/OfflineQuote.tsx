"use client";
import {QuoteLetterhead} from './QuoteLetterhead';
import {BrandLogo} from './BrandLogo';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';

export function OfflineQuote({context}: {context?: string}) {
  const {cart,liveSettings} = useStore();
  const [city,setCity]=useState(''), [note,setNote]=useState(''), [status,setStatus]=useState('');
  const [customer,setCustomer]=useState('');
  const [object,setObject]=useState(''), [size,setSize]=useState(''), [height,setHeight]=useState('');
  const [needInstall,setNeedInstall]=useState(false), [needSamples,setNeedSamples]=useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedObject = params.get('object');
    const selectedNeed = params.get('need');
    const selectedBrief = params.get('brief');
    const selectedSize = params.get('size');
    const selectedHeight = params.get('height');
    if (selectedObject) setObject(selectedObject);
    if (selectedSize) setSize(selectedSize);
    if (selectedHeight) setHeight(selectedHeight);
    if (selectedNeed || selectedBrief) setNote([selectedNeed && `Запрос: ${selectedNeed}`, selectedBrief].filter(Boolean).join(' · '));
  }, []);
  const details=[object && `Тип объекта: ${object}`,size.trim() && `Размеры площадки: ${size.trim()}`,height.trim() && `Высота опор: ${height.trim()}`,needInstall && 'Нужен расчёт монтажа / шеф-монтажа',needSamples && 'Нужны образцы покрытий',note.trim()].filter(Boolean).join('\n');
  const lines = context ? [context] : cart.map(({product,qty,optionsNote,includeInstall},i)=>`${i+1}. ${product.shortName} · арт. ${product.sku} · ${qty} ${product.unit}${optionsNote ? ` · ${optionsNote}` : ''}${includeInstall ? ' · с монтажом' : ''}`);
  const text=['Запрос коммерческого предложения · N7 CONSTRUCTION',...lines,customer.trim() && `Заказчик: ${customer.trim()}`,city.trim() && `Город поставки: ${city.trim()}`,details, 'Прошу уточнить цену, условия оплаты, срок поставки, стоимость доставки и монтажа.'].filter(Boolean).join('\n');
  const phone=liveSettings.whatsappNumber.replace(/\D/g,'');
  const button='inline-flex min-h-11 items-center justify-center rounded-xl bg-canvas px-4 text-sm font-bold text-ink';
  function download(){const url=URL.createObjectURL(new Blob(['\uFEFF',text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='N7-запрос-КП.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  return <section className="rounded-2xl bg-white p-4 text-ink space-y-3 lg:col-span-5">
    <div className="border-b border-ink/10 pb-3"><BrandLogo theme="light" /></div>
    <h3 className="text-lg font-bold">Подготовить запрос КП</h3>
    <p className="text-sm text-ink-muted">{phone ? 'Откройте чат N7 и нажмите «Отправить» в WhatsApp. До отправки запрос остаётся на вашем устройстве.' : 'Прямой номер N7 пока не опубликован. Можно сохранить запрос или переслать его своему контакту. Автоматической отправки нет.'}</p>
    {!context && <fieldset className="grid gap-3 rounded-xl border p-3"><legend className="px-1 font-bold">Параметры объекта</legend><small>Заполните то, что знаете. Модель выбирать не обязательно.</small><label>Тип площадки<select value={object} onChange={e=>setObject(e.target.value)} className="block w-full rounded-lg bg-canvas p-2"><option value="">Не указан</option>{['Открытый корт','Крытый корт','Спортивный зал','Поле или стадион','Другой объект'].map(v=><option key={v}>{v}</option>)}</select></label><label>Размеры площадки<input value={size} onChange={e=>setSize(e.target.value)} placeholder="Например, 20 × 10 м" className="block w-full rounded-lg bg-canvas p-2" /></label><label>Высота опор для освещения<input value={height} onChange={e=>setHeight(e.target.value)} placeholder="Если известна, например 6 м" className="block w-full rounded-lg bg-canvas p-2" /></label></fieldset>}
    <label className="block text-sm font-semibold">Заказчик (необязательно)<input value={customer} onChange={e=>setCustomer(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas p-3" placeholder="Имя или организация" /></label>
    <label className="block text-sm font-semibold">Город поставки<input value={city} onChange={e=>setCity(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas p-3" placeholder="Например, Павлодар" /></label>
    <div className="flex flex-wrap gap-2"><label className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-2 text-xs font-semibold"><input type="checkbox" checked={needInstall} onChange={e=>setNeedInstall(e.target.checked)} className="accent-track" />Монтаж / шеф-монтаж</label><label className="inline-flex items-center gap-2 rounded-full bg-canvas px-3 py-2 text-xs font-semibold"><input type="checkbox" checked={needSamples} onChange={e=>setNeedSamples(e.target.checked)} className="accent-track" />Запросить образцы</label></div>
    <label className="block text-sm font-semibold">Пожелания к расчёту<textarea value={note} onChange={e=>setNote(e.target.value)} className="mt-1 w-full rounded-xl bg-canvas p-3" placeholder="Сроки, требования и дополнительные комментарии" /></label>
    <QuoteLetterhead context={context} city={city} note={details} customer={customer}/>
    <details><summary className="cursor-pointer py-2 text-sm font-bold">Посмотреть текст запроса</summary><p className="whitespace-pre-wrap break-words text-sm">{text}</p></details>
    <div className="flex flex-wrap gap-2"><a href={`https://wa.me/${phone}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" className={`${button} !bg-ink !text-white`}>{phone?`Написать в N7 · +${phone}`:'Переслать в свой чат'}</a><button type="button" className={button} onClick={async()=>{try{await navigator.clipboard.writeText(text);setStatus('Текст скопирован')}catch{setStatus('Откройте текст запроса и скопируйте вручную или скачайте TXT.')}}}>Копировать</button><button type="button" className={button} onClick={download}>Скачать TXT</button></div><span role="status" className="text-sm">{status}</span>
  </section>
}
