"""Build the public, read-only Pages storefront from the running site's public CMS endpoint."""
from pathlib import Path
from urllib.request import urlopen
from html import escape as e
import json, shutil, re
root=Path(__file__).resolve().parents[1]; out=root/'docs'; models=out/'models'; models.mkdir(parents=True,exist_ok=True)
products=json.load(urlopen('http://localhost:3000/api/cms'))['products']; (out/'.nojekyll').touch(); shutil.copytree(root/'n7-construction/public/images',out/'images',dirs_exist_ok=True)
def page(title,body,base=''):
 return f'''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} · N7 Construction</title><link rel="stylesheet" href="{base}style.css"><header><a href="{base}index.html">N7 <b>CONSTRUCTION</b></a><span>Казахстан</span></header><main>{body}</main><footer>N7 CONSTRUCTION · Покрытия, свет и падел-корты</footer></html>'''
sections=[]; nav=[]
for code,title in [('flooring','Спортивные покрытия'),('lighting','Освещение N7'),('infrastructure','Падел-корты')]:
 rows=[p for p in products if p['category']==code]; nav.append(f'<a href="#{code}">{title} <small>{len(rows)}</small></a>'); groups=[]
 for sub in dict.fromkeys(p['subcategoryLabel'] for p in rows):
  cards=[]
  for p in (p for p in rows if p['subcategoryLabel']==sub):
   slug=p['slug']; assert re.fullmatch('[a-z0-9-]+',slug);img=e(p['image'].lstrip('/'));name=e(p['shortName']);sku=e(p['sku']);cards.append(f'<a class="card" href="models/{slug}.html"><img loading="lazy" src="{img}" alt=""><div><small>{sku}</small><h4>{name}</h4><span>Подробнее →</span></div></a>');spec=''.join(f'<tr><th>{e(v["label"])}</th><td>{e(v["value"])}</td></tr>' for v in p['specs']);body=f'<a href="../index.html#{code}">← {title}</a><p class="eyebrow">{e(sub)} · {sku}</p><h1>{name}</h1><div class="detail"><img src="../{img}" alt="{name}"><article><p>{e(p["summary"])}</p><p>Минимальный заказ: {p["minOrder"]} {e(p["unit"])}</p><h2>Характеристики</h2><table>{spec}</table></article></div>';(models/(slug+'.html')).write_text(page(p['shortName'],body,'../'))
  groups.append(f'<section><h3>{e(sub)}</h3><div class="grid">{"".join(cards)}</div></section>')
 sections.append(f'<section id="{code}"><h2>{title}</h2>{"".join(groups)}</section>')
(out/'index.html').write_text(page('Каталог',f'<p class="eyebrow">N7 / КАТАЛОГ</p><h1>Оборудование для спортивных объектов</h1><p>Выберите направление или найдите модель по названию и артикулу.</p><nav>{"".join(nav)}</nav><input id="q" type="search" placeholder="Поиск по каталогу" aria-label="Поиск по каталогу"><p id="none" hidden>Ничего не найдено. Попробуйте другой артикул.</p>{"".join(sections)}<script src="filter.js"></script>'))
